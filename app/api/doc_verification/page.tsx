'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading PDF Viewer...</p>
      </div>
    </div>
  ),
});

function DocumentVerificationContent() {
  const searchParams = useSearchParams();
  const doc = searchParams.get('doc'); // e.g., "Transcript"
  const reg = searchParams.get('reg'); // e.g., "KU0040642023"
  
  const [loading, setLoading] = React.useState(true);
  const [document, setDocument] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (doc && reg) {
      fetch(`/api/verify?doc=${encodeURIComponent(doc)}&reg=${encodeURIComponent(reg)}`)
        .then(res => res.json())
        .then(data => {
          if (data.verified) {
            setDocument(data.document);
          } else {
            setError(data.message || 'Document not found');
          }
        })
        .catch(() => setError('Failed to verify document'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('Missing parameters');
    }
  }, [doc, reg]);

  if (!doc || !reg) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Request</h1>
          <p className="text-gray-600 mb-4">
            Please provide both document type and registration number.
          </p>
          <p className="text-sm text-gray-500">
            Required parameters: ?doc=Transcript&reg=KU0040642023
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Document Not Verified</h1>
          <p className="text-gray-600 mb-2">
            {error || 'The requested document could not be found or verified.'}
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded text-left text-sm">
            <p className="text-gray-700"><strong>Document Type:</strong> {doc}</p>
            <p className="text-gray-700"><strong>Registration Number:</strong> {reg}</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Please contact the issuing institution if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#525659]">
      <PDFViewer pdfUrl={document.url} />
    </div>
  );
}

export default function DocumentVerificationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DocumentVerificationContent />
    </Suspense>
  );
}

