import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const REGISTRY_PATH = join(process.cwd(), 'lib', 'document-registry.json');

interface DocumentRecord {
  registrationNumber: string;
  documentType: string;
  filename: string;
  uploadedAt: string;
  verified: boolean;
  studentName?: string;
  institution?: string;
  metadata?: Record<string, any>;
}

interface Registry {
  documents: DocumentRecord[];
}

async function getRegistry(): Promise<Registry> {
  try {
    if (!existsSync(REGISTRY_PATH)) {
      return { documents: [] };
    }
    const data = await readFile(REGISTRY_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading registry:', error);
    return { documents: [] };
  }
}

async function saveRegistry(registry: Registry): Promise<void> {
  await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

// GET: Verify a document by registration number and document type
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reg = searchParams.get('reg');
  const doc = searchParams.get('doc');

  if (!reg || !doc) {
    return NextResponse.json(
      { error: 'Missing required parameters: reg and doc' },
      { status: 400 }
    );
  }

  const registry = await getRegistry();
  const document = registry.documents.find(
    (d) => d.registrationNumber === reg && d.documentType === doc
  );

  if (!document) {
    return NextResponse.json(
      { 
        verified: false, 
        message: 'Document not found or not verified',
        registrationNumber: reg,
        documentType: doc,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    verified: true,
    document: {
      registrationNumber: document.registrationNumber,
      documentType: document.documentType,
      filename: document.filename,
      uploadedAt: document.uploadedAt,
      url: `/uploads/${document.filename}`,
      studentName: document.studentName,
      institution: document.institution,
      metadata: document.metadata,
    },
  });
}

// POST: Register a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      registrationNumber, 
      documentType, 
      filename,
      studentName,
      institution,
      metadata 
    } = body;

    if (!registrationNumber || !documentType || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields: registrationNumber, documentType, filename' },
        { status: 400 }
      );
    }

    const registry = await getRegistry();

    // Check if document already exists
    const existingIndex = registry.documents.findIndex(
      (d) => d.registrationNumber === registrationNumber && d.documentType === documentType
    );

    const newDocument: DocumentRecord = {
      registrationNumber,
      documentType,
      filename,
      uploadedAt: new Date().toISOString(),
      verified: true,
      studentName,
      institution,
      metadata,
    };

    if (existingIndex >= 0) {
      // Update existing document
      registry.documents[existingIndex] = newDocument;
    } else {
      // Add new document
      registry.documents.push(newDocument);
    }

    await saveRegistry(registry);

    return NextResponse.json({
      success: true,
      message: 'Document registered successfully',
      verificationUrl: `/API/doc_verification?doc=${documentType}&reg=${registrationNumber}`,
      document: newDocument,
    });
  } catch (error) {
    console.error('Error registering document:', error);
    return NextResponse.json(
      { error: 'Failed to register document' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a document from registry
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reg = searchParams.get('reg');
  const doc = searchParams.get('doc');

  if (!reg || !doc) {
    return NextResponse.json(
      { error: 'Missing required parameters: reg and doc' },
      { status: 400 }
    );
  }

  const registry = await getRegistry();
  const initialLength = registry.documents.length;

  registry.documents = registry.documents.filter(
    (d) => !(d.registrationNumber === reg && d.documentType === doc)
  );

  if (registry.documents.length === initialLength) {
    return NextResponse.json(
      { error: 'Document not found' },
      { status: 404 }
    );
  }

  await saveRegistry(registry);

  return NextResponse.json({
    success: true,
    message: 'Document removed from registry',
  });
}

