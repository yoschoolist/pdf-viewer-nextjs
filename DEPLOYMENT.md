# Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

### Step 1: Set Up Vercel Blob Storage

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard/stores

2. **Create a Blob Storage**
   - Click "Create Database"
   - Select "Blob" 
   - Choose a name (e.g., "pdf-uploads")
   - Click "Create"

3. **Get Your Token**
   - After creation, copy the `BLOB_READ_WRITE_TOKEN`
   - You'll need this for the next step

### Step 2: Configure Environment Variables

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add the following variable:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxxxxxxx
```

2. **Important:** Make sure to add it for **all environments** (Production, Preview, Development)

### Step 3: Deploy

1. **Automatic Deployment:**
   - Push to `main` branch
   - Vercel will automatically deploy

2. **Manual Deployment:**
   ```bash
   vercel --prod
   ```

### Step 4: Verify

1. Visit your Vercel deployment URL
2. Try uploading a PDF with registration info
3. Verify the file uploads successfully
4. Check that it redirects to the verification page

---

## 🔧 How It Works

### Development (Local)
- Files are stored in `public/uploads/`
- Works with local filesystem

### Production (Vercel)
- Files are stored in **Vercel Blob Storage**
- Serverless-compatible
- Files get a permanent URL like: `https://xxxxx.public.blob.vercel-storage.com/filename.pdf`

---

## 📊 Storage Costs

**Vercel Blob Pricing:**
- **Hobby Plan:** 500 MB free
- **Pro Plan:** Unlimited storage (pay per GB)

Check current pricing: https://vercel.com/docs/storage/vercel-blob/usage-and-pricing

---

## 🔍 Troubleshooting

### Error: "Failed to upload file"

**Check:**
1. ✅ `BLOB_READ_WRITE_TOKEN` is set in Vercel
2. ✅ Token is valid (not expired)
3. ✅ Blob Storage is created and active

### Error: "Document not found"

**Check:**
1. ✅ Document was successfully registered
2. ✅ Registry file (`lib/document-registry.json`) exists
3. ✅ File URL is accessible

### Files Not Persisting

**Remember:**
- In production, files are in Blob Storage, not the filesystem
- Registry file persists in the repository
- For production, consider using a database instead of JSON file

---

## 🎯 Production Recommendations

### 1. Use Database for Registry
Instead of `lib/document-registry.json`, use:
- **Vercel Postgres**
- **MongoDB Atlas**
- **Supabase**
- **PlanetScale**

### 2. Add Authentication
Protect upload/admin routes:
- NextAuth.js
- Clerk
- Auth0

### 3. Add File Validation
- File size limits
- Malware scanning
- Content validation

### 4. Monitor Usage
- Track upload counts
- Monitor storage usage
- Set up alerts

---

## 🔐 Security Checklist

- [ ] Environment variables are set
- [ ] Blob Storage token is kept secret
- [ ] File upload size limits configured
- [ ] Rate limiting implemented
- [ ] Authentication added for sensitive routes
- [ ] CORS configured properly
- [ ] SSL/TLS enabled (automatic on Vercel)

---

## 📚 Additional Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 Alternative Storage Options

If you prefer not to use Vercel Blob:

### Cloudflare R2
```bash
npm install @aws-sdk/client-s3
```

### AWS S3
```bash
npm install @aws-sdk/client-s3
```

### Supabase Storage
```bash
npm install @supabase/supabase-js
```

Update `app/api/upload/route.ts` accordingly.

