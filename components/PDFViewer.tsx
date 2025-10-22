'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';

// Configure PDF.js worker - use local worker file for reliability
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
}

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const goToFirstPage = () => setPageNumber(1);
  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
  const goToLastPage = () => setPageNumber(numPages);

  const handleExport = async (format: string) => {
    try {
      switch (format) {
        case 'pdf':
          // Download the original PDF
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `document_page_${pageNumber}.pdf`;
          link.click();
          break;

        case 'xlsx':
        case 'xls':
          alert(`Export to ${format.toUpperCase()} format - Integration with Excel export library needed`);
          break;

        case 'rtf':
        case 'mht':
        case 'html':
        case 'text':
        case 'csv':
          alert(`Export to ${format.toUpperCase()} format - Integration with conversion library needed`);
          break;

        case 'image':
          alert('Export to Image format - Canvas-based export can be implemented');
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export document');
    }
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#525659]">
      {/* Toolbar - More compact, gray theme */}
      <div className="bg-[#e8e8e8] border-b border-gray-400">
        <div className="flex items-center justify-between px-3 py-1.5">
          {/* Navigation Controls */}
          <div className="flex items-center">
            <button
              onClick={goToFirstPage}
              disabled={pageNumber === 1 || loading}
              className="p-1 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-400"
              title="First Page"
            >
              <ChevronFirst className="w-4 h-4 text-gray-700" />
            </button>
            
            <button
              onClick={goToPreviousPage}
              disabled={pageNumber === 1 || loading}
              className="p-1 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-400"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            {/* Page Counter */}
            <div className="flex items-center gap-1 px-2 border-r border-gray-400">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-600" />
              ) : (
                <>
                  <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={pageNumber}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 && value <= numPages) {
                        setPageNumber(value);
                      }
                    }}
                    className="w-10 px-1 py-0.5 text-center text-xs border border-gray-400 bg-white focus:outline-none focus:border-gray-600"
                  />
                  <span className="text-xs text-gray-700">of</span>
                  <span className="text-xs text-gray-700 font-medium">{numPages}</span>
                </>
              )}
            </div>

            <button
              onClick={goToNextPage}
              disabled={pageNumber === numPages || loading}
              className="p-1 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-400"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>

            <button
              onClick={goToLastPage}
              disabled={pageNumber === numPages || loading}
              className="p-1 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-gray-400"
              title="Last Page"
            >
              <ChevronLast className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Export Controls */}
          <div className="relative">
            <div className="flex items-center">
              <button
                onClick={() => handleExport('pdf')}
                className="p-1 hover:bg-gray-300 transition-colors border-l border-gray-400"
                title="Export a report and save it to the disk"
              >
                <Download className="w-4 h-4 text-gray-700" />
              </button>

              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center p-1 hover:bg-gray-300 transition-colors border-l border-gray-400"
                title="Export a report and show it in a new window"
              >
                <FileText className="w-4 h-4 text-gray-700" />
                <ChevronRight className="w-3 h-3 text-gray-700 ml-0.5" />
              </button>
            </div>

            {/* Export Menu Dropdown */}
            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-400 shadow-lg z-10">
                <div className="py-0.5">
                  {[
                    { format: 'pdf', label: 'PDF' },
                    { format: 'xls', label: 'XLS' },
                    { format: 'xlsx', label: 'XLSX' },
                    { format: 'rtf', label: 'RTF' },
                    { format: 'mht', label: 'MHT' },
                    { format: 'html', label: 'HTML' },
                    { format: 'text', label: 'Text' },
                    { format: 'csv', label: 'CSV' },
                    { format: 'image', label: 'Image' },
                  ].map(({ format, label }) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      className="w-full px-3 py-1 hover:bg-gray-200 transition-colors text-left text-xs text-gray-800"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-[#525659] flex items-start justify-center py-4">
        <div className="bg-white shadow-2xl">
          {loading && (
            <div className="flex items-center justify-center h-[800px] w-[600px]">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-500 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Loading...</p>
              </div>
            </div>
          )}
          
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading=""
            error={
              <div className="flex items-center justify-center h-[800px] w-[600px]">
                <div className="text-center">
                  <p className="text-red-600 mb-2 text-sm">Failed to load PDF</p>
                  <p className="text-gray-600 text-xs">Please check the file URL</p>
                </div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="max-w-full"
              width={850}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}

