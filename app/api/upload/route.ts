import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const registrationNumber = formData.get('registrationNumber') as string;
    const documentType = formData.get('documentType') as string;
    const studentName = formData.get('studentName') as string;
    const institution = formData.get('institution') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Convert file to base64 for storage in registry
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;
    
    const publicUrl = dataUrl; // Store as data URL

    // If registration info provided, register the document
    let verificationUrl = null;
    if (registrationNumber && documentType) {
      try {
        const registerResponse = await fetch(`${request.nextUrl.origin}/api/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationNumber,
            documentType,
            filename,
            publicUrl, // Store the actual URL (Blob or local)
            studentName,
            institution,
          }),
        });
        
        if (registerResponse.ok) {
          const registerData = await registerResponse.json();
          verificationUrl = registerData.verificationUrl;
        }
      } catch (error) {
        console.error('Error registering document:', error);
      }
    }

    return NextResponse.json({
      success: true,
      filename,
      url: publicUrl,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      verificationUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET endpoint to list uploaded files from registry
export async function GET() {
  try {
    // Fetch from the verify API which reads the registry
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/verify/list`);
    if (!response.ok) {
      return NextResponse.json({ files: [] });
    }
    
    const data = await response.json();
    return NextResponse.json({ files: data.files || [] });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ files: [] });
  }
}
