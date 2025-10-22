# Document Verification System

A complete document verification system that allows uploading PDFs and accessing them via custom verification URLs.

## Overview

This system provides a way to upload PDF documents and register them with unique identifiers (registration numbers), then access them through standardized verification URLs similar to educational institution document verification systems.

## Features

✅ **Document Registration**
- Upload PDFs with registration numbers
- Store metadata (student name, institution, document type)
- Generate unique verification URLs
- Persistent storage in public folder

✅ **Verification URLs**
- Access documents via: `/API/doc_verification?doc={type}&reg={number}`
- Example: `/API/doc_verification?doc=Transcript&reg=KU0040642023`
- Query parameter validation
- Document verification status

✅ **API Endpoints**
- Upload and register documents
- Verify document authenticity
- List registered documents
- Document metadata retrieval

## Usage

### 1. Upload and Register a Document

**Via Web Interface:**
1. Go to http://localhost:3000
2. Click "Upload File" tab
3. Fill in registration information:
   - **Registration Number**: e.g., `KU0040642023`
   - **Document Type**: Select from dropdown (Transcript, Certificate, etc.)
   - **Student Name**: Optional
   - **Institution**: Optional
4. Upload PDF file
5. Verification URL is generated and copied to clipboard

**Via API:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@document.pdf" \
  -F "registrationNumber=KU0040642023" \
  -F "documentType=Transcript" \
  -F "studentName=John Doe" \
  -F "institution=Kampala University"
```

**Response:**
```json
{
  "success": true,
  "filename": "1761151830277_FinalTranscript_Original.pdf",
  "url": "/uploads/1761151830277_FinalTranscript_Original.pdf",
  "size": 1234567,
  "uploadedAt": "2025-10-22T19:43:50.277Z",
  "verificationUrl": "/API/doc_verification?doc=Transcript&reg=KU0040642023"
}
```

### 2. Access Document via Verification URL

**Direct Browser Access:**
```
http://localhost:3000/API/doc_verification?doc=Transcript&reg=KU0040642023
```

This will display the PDF viewer with:
- Document information header
- Full PDF navigation controls
- Export options

### 3. Verify Document Authenticity

**API Verification Check:**
```bash
curl "http://localhost:3000/api/verify?doc=Transcript&reg=KU0040642023"
```

**Response (Document Found):**
```json
{
  "verified": true,
  "document": {
    "registrationNumber": "KU0040642023",
    "documentType": "Transcript",
    "filename": "1761151830277_FinalTranscript_Original.pdf",
    "uploadedAt": "2025-10-22T19:43:50.277Z",
    "url": "/uploads/1761151830277_FinalTranscript_Original.pdf",
    "studentName": "John Doe",
    "institution": "Kampala University"
  }
}
```

**Response (Document Not Found):**
```json
{
  "verified": false,
  "message": "Document not found or not verified",
  "registrationNumber": "KU0040642023",
  "documentType": "Transcript"
}
```

## API Reference

### POST /api/upload
Upload a PDF and optionally register it for verification.

**Parameters:**
- `file` (required): PDF file
- `registrationNumber` (optional): Unique identifier
- `documentType` (optional): Document type
- `studentName` (optional): Student name
- `institution` (optional): Institution name

**Returns:** Upload confirmation with verification URL

### GET /api/verify
Verify a document's authenticity.

**Query Parameters:**
- `doc`: Document type (e.g., "Transcript")
- `reg`: Registration number (e.g., "KU0040642023")

**Returns:** Verification status and document metadata

### POST /api/verify
Register a document manually.

**Body:**
```json
{
  "registrationNumber": "KU0040642023",
  "documentType": "Transcript",
  "filename": "1761151830277_FinalTranscript_Original.pdf",
  "studentName": "John Doe",
  "institution": "Kampala University"
}
```

### DELETE /api/verify
Remove a document from the registry.

**Query Parameters:**
- `doc`: Document type
- `reg`: Registration number

## Document Registry

Documents are tracked in: `lib/document-registry.json`

**Structure:**
```json
{
  "documents": [
    {
      "registrationNumber": "KU0040642023",
      "documentType": "Transcript",
      "filename": "1761151830277_FinalTranscript_Original.pdf",
      "uploadedAt": "2025-10-22T19:43:50.277Z",
      "verified": true,
      "studentName": "John Doe",
      "institution": "Kampala University"
    }
  ]
}
```

## File Storage

- **Location**: `public/uploads/`
- **Naming Convention**: `{timestamp}_{sanitized_filename}.pdf`
- **Access**: Publicly accessible at `/uploads/{filename}`

## Security Considerations

⚠️ **Current Implementation (Development)**
- Files are publicly accessible
- No authentication required
- Registry stored in JSON file

🔒 **Production Recommendations**
1. **Authentication**: Require auth for uploads and verification
2. **Authorization**: Role-based access control
3. **Database**: Use proper database instead of JSON file
4. **File Storage**: Use cloud storage (AWS S3, Cloudflare R2)
5. **Encryption**: Encrypt sensitive documents
6. **Rate Limiting**: Prevent abuse
7. **Audit Logging**: Track all access and modifications
8. **Validation**: Enhanced validation and sanitization
9. **SSL/TLS**: Use HTTPS in production
10. **Watermarking**: Add watermarks to viewed documents

## Example Workflow

### Educational Institution Use Case

1. **Student graduates and requests transcript**
2. **Institution uploads transcript:**
   - Registration Number: `KU0040642023`
   - Document Type: `Transcript`
   - Student Name: `John Doe`
   - Institution: `Kampala University`

3. **System generates verification URL:**
   ```
   https://yourdomain.com/API/doc_verification?doc=Transcript&reg=KU0040642023
   ```

4. **Institution provides URL to student**

5. **Student shares URL with employers/universities**

6. **Third parties can verify document authenticity:**
   - Visit verification URL to view document
   - Use API to check verification status
   - Confirm document is official and unaltered

## Testing

### Test with Existing Document

Your uploaded document is already registered:

**URL:**
```
http://localhost:3000/API/doc_verification?doc=Transcript&reg=KU0040642023
```

**Verification:**
```bash
curl "http://localhost:3000/api/verify?doc=Transcript&reg=KU0040642023"
```

### Test Upload and Registration

1. Upload a new PDF with registration info
2. Copy the generated verification URL
3. Open URL in browser
4. Verify document displays correctly

## Troubleshooting

### Document Not Found
- Check registration number and document type are correct
- Verify document exists in registry: `lib/document-registry.json`
- Ensure file exists in: `public/uploads/`

### Verification URL Not Generated
- Ensure registration number is provided during upload
- Check document type is selected
- Verify API endpoints are running

### File Not Displaying
- Check PDF file is valid
- Verify worker file exists: `public/pdf.worker.mjs`
- Check browser console for errors

## Future Enhancements

- [ ] QR code generation for verification URLs
- [ ] Email notifications for document access
- [ ] Document expiration dates
- [ ] Batch upload and registration
- [ ] Advanced search and filtering
- [ ] Document versioning
- [ ] Digital signatures
- [ ] Blockchain verification
- [ ] Multi-language support
- [ ] Mobile app integration

---

**Note**: This is a development implementation. For production use, implement proper security measures, use a database, and follow security best practices.

