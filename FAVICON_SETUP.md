# Favicon Setup for PDF Viewer

## 🎯 Eagle Favicon Implementation

To set the eagle image as your favicon, you'll need to create the following files in the `public/` directory:

### Required Files:
```
public/
├── favicon.ico          (16x16, 32x32, 48x48 multi-size)
├── favicon-16x16.png    (16x16 PNG)
├── favicon-32x32.png    (32x32 PNG)
└── apple-touch-icon.png (180x180 PNG for iOS)
```

## 🛠️ How to Create Favicon Files

### Option 1: Online Favicon Generator
1. Go to https://favicon.io/favicon-converter/
2. Upload your eagle image
3. Download the generated files
4. Place them in the `public/` directory

### Option 2: Manual Creation
1. **favicon.ico**: Convert your eagle image to ICO format (16x16, 32x32, 48x48)
2. **favicon-16x16.png**: Resize eagle image to 16x16 pixels
3. **favicon-32x32.png**: Resize eagle image to 32x32 pixels  
4. **apple-touch-icon.png**: Resize eagle image to 180x180 pixels

### Option 3: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
brew install imagemagick

# Create different sizes
convert eagle-image.png -resize 16x16 favicon-16x16.png
convert eagle-image.png -resize 32x32 favicon-32x32.png
convert eagle-image.png -resize 180x180 apple-touch-icon.png

# Create multi-size ICO
convert eagle-image.png -resize 16x16 eagle-16.png
convert eagle-image.png -resize 32x32 eagle-32.png
convert eagle-image.png -resize 48x48 eagle-48.png
convert eagle-16.png eagle-32.png eagle-48.png favicon.ico
```

## 📁 File Structure After Setup
```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── pdf.worker.mjs
└── uploads/
```

## ✅ Verification

After adding the files:

1. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
2. **Check browser tab** - should show eagle icon
3. **Check bookmarks** - eagle icon should appear
4. **Check mobile** - apple-touch-icon should work

## 🎨 Design Tips

### For Best Results:
- **Keep it simple**: Eagle should be recognizable at 16x16
- **High contrast**: Works well on light/dark backgrounds
- **Square format**: Crop eagle to square if needed
- **Clean edges**: Avoid fine details that disappear at small sizes

### Color Considerations:
- The green eagle will work well
- Consider a version with white background for dark browser themes
- Test on different browser themes

## 🔧 Current Configuration

The layout.tsx is already configured with:

```typescript
icons: {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  ],
  apple: [
    { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
}
```

## 🚀 After Adding Files

1. **Test locally:**
   ```bash
   npm run dev
   # Check http://localhost:3000
   ```

2. **Deploy:**
   ```bash
   git add public/favicon.*
   git commit -m "Add eagle favicon"
   git push origin main
   ```

3. **Verify on production** - favicon should appear on your deployed site!

---

## 💡 Pro Tips

- **Favicon caching**: Browsers cache favicons aggressively - use hard refresh
- **Multiple sizes**: ICO format supports multiple sizes in one file
- **Apple devices**: apple-touch-icon.png is crucial for iOS bookmarks
- **Manifest**: Consider adding a web app manifest for PWA features

The eagle with the book is perfect for a university verification portal! 🦅📚
