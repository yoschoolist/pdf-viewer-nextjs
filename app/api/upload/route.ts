import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${filename}`;

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

// Optional: GET endpoint to list uploaded files
export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] });
    }

    const fs = require('fs');
    const files = fs.readdirSync(uploadsDir);
    
    const fileList = files
      .filter((file: string) => file.endsWith('.pdf'))
      .map((file: string) => {
        const stats = fs.statSync(join(uploadsDir, file));
        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          uploadedAt: stats.birthtime,
        };
      })
      .sort((a: any, b: any) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

    return NextResponse.json({ files: fileList });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ files: [] });
  }
}

