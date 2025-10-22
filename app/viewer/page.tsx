'use client';

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

export default function ViewerPage() {
  // Sample PDF URL
  const pdfUrl = 'https://pdfobject.com/pdf/sample.pdf';
  
  return (
    <main className="h-screen">
      <PDFViewer pdfUrl={pdfUrl} />
    </main>
  );
}

