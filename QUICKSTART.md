# Quick Start Guide

## 5-Minute Setup

### Step 1: Copy Your Slides
```bash
# Place your PDF files in the slides/ folder
cp your-slides/*.pdf ./slides/
```

### Step 2: Update Course Data
Edit `data.json` and update:
- Week topics
- Slide filenames
- Past works information

### Step 3: Add Student Works
```bash
# Copy student images to the appropriate semester folder
cp student-renders/*.jpg ./past-works/2025-spring/
```

### Step 4: Update Timestamps
Run the Python script to auto-update file modification times:
```bash
python3 scripts/update-manifest.py
```

Or manually edit `file-manifest.json` with timestamps for your slides.

### Step 5: Push to GitHub
```bash
git add .
git commit -m "Initial course website setup"
git push origin main
```

## Next Steps

1. **Enable GitHub Pages** in your repository settings
2. **Share your URL** with students
3. **Test the website** on different devices
4. **Update regularly** as you add new slides and student works

## Helpful Commands

### Update file manifest (when slides change)
```bash
python3 scripts/update-manifest.py
```

### Local testing
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Check git status
```bash
git status
```

## Tips

- ✅ Keep slide filenames consistent with data.json
- ✅ Use descriptive image names in past works
- ✅ Test on mobile before deploying
- ✅ Keep image file sizes under 5MB
- ✅ Update the manifest when you modify slides

## Troubleshooting

**Q: Slides don't download**
- A: Check filename matches in data.json and slides/ folder

**Q: Images not showing**
- A: Verify paths in data.json are correct

**Q: Changes not appearing on website**
- A: Wait a few seconds for GitHub Pages to rebuild

Need help? See README.md for detailed documentation.
