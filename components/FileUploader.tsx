'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
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

export default function FileUploader() {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'history'>('url');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('Transcript');
  const [studentName, setStudentName] = useState<string>('');
  const [institution, setInstitution] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded files history
  React.useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      setUploadedFiles(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a valid PDF file');
      return;
    }

    setUploading(true);

    try {
      // Upload file to server
      const formData = new FormData();
      formData.append('file', file);
      
      // Add registration info if provided
      if (registrationNumber) formData.append('registrationNumber', registrationNumber);
      if (documentType) formData.append('documentType', documentType);
      if (studentName) formData.append('studentName', studentName);
      if (institution) formData.append('institution', institution);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Set the uploaded file URL
      setPdfFile(data.url);
      setPdfUrl('');
      
      // Refresh the uploaded files list
      await loadUploadedFiles();
      
      // Show verification URL if registration was provided
      if (data.verificationUrl) {
        const fullUrl = `${window.location.origin}${data.verificationUrl}`;
        
        // Copy URL to clipboard
        navigator.clipboard.writeText(fullUrl);
        
        // Redirect to verification page
        window.location.href = data.verificationUrl;
        return; // Exit early since we're redirecting
      } else {
        alert(`File uploaded successfully: ${data.filename}`);
      }
      
      // Clear form fields
      setRegistrationNumber('');
      setStudentName('');
      setInstitution('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfUrl.trim()) {
      setPdfFile(null);
      // URL is already set in state
    }
  };

  const handleClear = () => {
    setPdfFile(null);
    setPdfUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentPdfUrl = pdfFile || pdfUrl;

  if (currentPdfUrl) {
    return (
      <div className="relative h-screen">
        <button
          onClick={handleClear}
          className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Close PDF"
        >
          <X className="w-5 h-5" />
        </button>
        <PDFViewer pdfUrl={currentPdfUrl} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Viewer</h1>
          <p className="text-gray-600">
            Upload a PDF file or provide a URL to view the document
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'url'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            URL
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'upload'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History ({uploadedFiles.length})
          </button>
        </div>

        {/* URL Input */}
        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF URL
              </label>
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              View PDF
            </button>
            
            {/* Example URLs */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Example URLs (click to use):
              </p>
              <div className="space-y-2">
                {[
                  {
                    label: 'Sample PDF',
                    url: 'https://pdfobject.com/pdf/sample.pdf',
                  },
                  {
                    label: 'PDF.js Test Document',
                    url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
                  },
                ].map((example) => (
                  <button
                    key={example.url}
                    type="button"
                    onClick={() => setPdfUrl(example.url)}
                    className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* File Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* Registration Information Form */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">
                Document Registration (Optional)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g., KU0040642023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type *
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="Transcript">Transcript</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Degree">Degree</option>
                    <option value="Letter">Letter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-600">
                  * If provided, a verification URL will be generated like: 
                  <br />
                  <code className="bg-white px-2 py-1 rounded text-blue-600 mt-1 inline-block">
                    /API/doc_verification?doc=Transcript&reg=KU0040642023
                  </code>
                </p>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 mb-2">Uploading and registering...</p>
                  <p className="text-sm text-gray-500">Please wait</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    <span className="text-blue-600 font-medium">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PDF files only</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Files will be stored in public/uploads folder
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-2">No uploaded files yet</p>
                <p className="text-sm">Upload a file to see it here</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setPdfFile(file.url);
                      setPdfUrl('');
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 truncate">
                          {file.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB •{' '}
                          {new Date(file.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(file.url);
                        setPdfUrl('');
                      }}
                      className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Navigate through pages with intuitive controls</li>
            <li>• Export to multiple formats (PDF, Excel, Text, etc.)</li>
            <li>• Responsive design for all screen sizes</li>
            <li>• Fast loading with modern PDF rendering</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

