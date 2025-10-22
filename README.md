# PDF Viewer - Next.js Application

A modern, feature-rich PDF viewer built with Next.js, React, and TypeScript. This application provides a similar experience to advanced document viewers with navigation controls and export options.

## Features

✨ **Navigation Controls**
- First Page
- Previous Page
- Next Page
- Last Page
- Direct page number input

📤 **Export Options**
- PDF Download
- Multiple format support (XLS, XLSX, RTF, MHT, HTML, Text, CSV, Image)

📁 **File Management**
- Upload PDF files directly
- Automatic storage in public folder
- Upload history with metadata
- File type validation
- Unique filename generation

🔐 **Document Verification System**
- Custom verification URLs (e.g., `/API/doc_verification?doc=Transcript&reg=KU0040642023`)
- Registration number tracking
- Document type classification
- Verification API endpoints
- Metadata storage (student name, institution)
- Shareable verification links

🎨 **Modern UI**
- Clean, professional interface
- Responsive design
- Loading states
- Error handling
- Three-tab interface (URL, Upload, History)

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-pdf** - PDF rendering
- **Lucide React** - Icons
- **jsPDF** - PDF generation

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Usage

The PDF viewer supports three methods of loading PDFs:

1. **Option 1: Use a URL**
   - Enter any publicly accessible PDF URL
   - Example: `https://example.com/document.pdf`

2. **Option 2: Upload a file**
   - Upload PDF files directly from your computer
   - Files are automatically stored in `public/uploads/`
   - Uploaded files are accessible at `/uploads/{filename}`

3. **Option 3: View upload history**
   - Access previously uploaded PDFs
   - View file metadata (size, upload date)
   - Quick access to recent documents

4. **Option 4: Document Verification URLs**
   - Upload with registration information
   - Get shareable verification URL
   - Access via `/API/doc_verification?doc={type}&reg={number}`
   - Perfect for educational institutions and official documents

### Advanced Usage

#### Custom PDF Viewer Component

```typescript
import PDFViewer from '@/components/PDFViewer';

export default function MyPage() {
  return <PDFViewer pdfUrl="/path/to/your/document.pdf" />;
}
```

#### With Dynamic URLs

```typescript
'use client';

import { useState } from 'react';
import PDFViewer from '@/components/PDFViewer';

export default function DynamicViewer() {
  const [pdfUrl, setPdfUrl] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Enter PDF URL"
        onChange={(e) => setPdfUrl(e.target.value)}
        className="border p-2 mb-4"
      />
      {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />}
    </div>
  );
}
```

## Features Breakdown

### Navigation
- **First/Last Page**: Jump to document start/end
- **Previous/Next Page**: Navigate sequentially
- **Page Input**: Direct page navigation with validation

### Export Functionality
The export menu provides options for:
- **PDF**: Downloads the original document
- **Excel formats (XLS/XLSX)**: Ready for integration with excel export libraries
- **Document formats (RTF, MHT, HTML, Text)**: Can be extended with conversion libraries
- **CSV**: Structured data export
- **Image**: Canvas-based screenshot export

### UI Components
- Responsive toolbar with clear controls
- Loading indicators during document load
- Error states with helpful messages
- Smooth animations and transitions

## API Routes

### Upload API (`/api/upload`)

**POST**: Upload a PDF file
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
// Returns: { success, filename, url, size, uploadedAt }
```

**GET**: List all uploaded files
```typescript
const response = await fetch('/api/upload');
const data = await response.json();
// Returns: { files: [...] }
```

### File Storage
- **Location**: `public/uploads/`
- **Naming**: `{timestamp}_{sanitized_filename}.pdf`
- **Access**: Files are publicly accessible at `/uploads/{filename}`

## Customization

### Styling

Modify `app/globals.css` to customize the appearance:
```css
/* Change viewer background */
.bg-gray-200 {
  background-color: your-color;
}
```

### PDF Rendering Options

In `components/PDFViewer.tsx`, adjust the Page component:
```typescript
<Page
  pageNumber={pageNumber}
  width={800}  // Adjust width
  scale={1.5}  // Add scale
  renderTextLayer={true}
  renderAnnotationLayer={true}
/>
```

### Add More Export Formats

Extend the `handleExport` function in `PDFViewer.tsx`:
```typescript
case 'your-format':
  // Your export logic
  break;
```

## Environment Variables

Create a `.env.local` file for configuration:
```env
NEXT_PUBLIC_DEFAULT_PDF_URL=https://example.com/default.pdf
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t pdf-viewer .
docker run -p 3000:3000 pdf-viewer
```

### Static Export
```bash
npm run build
npm run export
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Tips

1. **Lazy Loading**: Large PDFs load one page at a time
2. **Worker Configuration**: PDF.js worker runs in separate thread
3. **Caching**: Browser caches loaded PDFs

## Troubleshooting

### PDF Not Loading
- Check the PDF URL is accessible
- Verify CORS headers if loading from external source
- Ensure PDF file is not corrupted

### Worker Error
The PDF.js worker file is automatically copied to the `public` directory during `npm install`. If you encounter worker errors:

1. **Manual fix:**
```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.mjs
```

2. **Alternative (use CDN):** Update in `PDFViewer.tsx`:
```typescript
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

The local worker file is preferred for better reliability and offline support.

### Export Not Working
- PDF download requires accessible URL
- Other formats may need additional libraries installed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your projects!

## Acknowledgments

- [react-pdf](https://github.com/wojtekmaj/react-pdf) - PDF rendering
- [PDF.js](https://mozilla.github.io/pdf.js/) - Mozilla's PDF library
- [Lucide](https://lucide.dev/) - Icon library

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and React
