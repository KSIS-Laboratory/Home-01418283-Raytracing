# Ray Tracing in Entertainment Industry - Course Website

A simple GitHub Pages website for course 01418283: Ray Tracing in Entertainment Industry.

## Features

✨ **Semester-Based Schedules** - Manage 15-week course schedules for each semester independently
📋 **Lecture & Assignment Tracking** - Track lectures and assignments for each week
📥 **Slide Downloads** - Direct download links for all course materials
🕐 **Automatic Update Tracking** - Displays when slides were last updated
🖼️ **Past Works Gallery** - Showcase student rendered images by semester
📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Project Structure

```
.
├── index.html              # Main webpage
├── style.css               # Styling and responsive design
├── script.js               # JavaScript for dynamic content
├── data.json               # Course data (schedule, past works)
├── file-manifest.json      # Tracks file update times
├── slides/                 # PDF slides for each week
│   └── Week_01_Introduction.pdf
│   └── Week_02_Ray_Surface_Interactions.pdf
│   └── ... (etc for weeks 3-15)
├── past-works/             # Student renderings
│   ├── 2025-spring/        # Spring 2025 works
│   │   ├── sample1.jpg
│   │   └── sample2.jpg
│   └── 2025-fall/          # Fall 2025 works
│       ├── sample1.jpg
│       └── sample2.jpg
└── README.md               # This file
```

## Setup Instructions

### 1. GitHub Pages Setup

If you haven't already:

1. Create a GitHub repository named `<username>.github.io` (replace `<username>` with your GitHub username)
2. Push all files in this directory to the repository
3. GitHub Pages will automatically serve the site at `https://<username>.github.io`

Alternatively, for a course-specific repo:
- Create a repository (e.g., `raytracing-course`)
- In repository settings, enable GitHub Pages and select the main branch as the source
- The site will be available at `https://<username>.github.io/raytracing-course`

### 2. Adding Slide Files

1. Add your PDF slides to the `slides/` directory
2. Name them according to the pattern: `Week_XX_TopicName.pdf`
3. The slides are automatically linked from the data.json schedule

### 3. Updating Slide Modification Times

Every time you update a slide, update the corresponding timestamp in `file-manifest.json`:

```json
{
  "slides/Week_01_Introduction.pdf": "2026-05-22T14:30:00Z"
}
```

Format: ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)

**Automated approach using GitHub Actions (optional):**
Create `.github/workflows/update-manifest.yml`:

```yaml
name: Update File Manifest
on: [push]
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Update manifest
        run: |
          python3 scripts/update-manifest.py
      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add file-manifest.json
          git commit -m "Update file manifest" || true
          git push
```

## Updating Course Data

Edit `data.json` to:

- **Change course details** - Modify `courseName` and `courseCode`
- **Update material** - Edit the `material` array with week numbers, topics, and slide filenames
- **Add schedules** - Edit the `schedules` array to define 15-week schedule for each semester
- **Add past works** - Add student renderings to the `pastWorks` array

### Example: Adding a New Semester Schedule

To add a new semester (e.g., "2026-1st"), add it to the `schedules` array in `data.json`:

```json
{
  "semester": "2026-1st",
  "year": 2026,
  "weeks": [
    {
      "week": 1,
      "topic": "Introduction to Ray Tracing",
      "lectureFile": "slides/2026-1st/Week01.pdf",
      "assignmentFile": "assignments/2026-1st/Week01_Assignment.pdf"
    },
    {
      "week": 2,
      "topic": "Ray-Surface Interactions",
      "lectureFile": "slides/2026-1st/Week02.pdf",
      "assignmentFile": "assignments/2026-1st/Week02_Assignment.pdf"
    },
    ...
    {
      "week": 15,
      "topic": "Final Project Presentations",
      "lectureFile": "slides/2026-1st/Week15.pdf",
      "assignmentFile": ""
    }
  ]
}
```

**Tips for schedule management:**
- Each semester must have exactly 15 weeks
- Use consistent folder naming: `slides/SEMESTER/` and `assignments/SEMESTER/`
- Leave `assignmentFile` empty (`""`) if no assignment for that week (e.g., week 15)
- The website will automatically create tabs for each semester

### Example: Adding a New Past Works Semester

```json
{
  "semester": "2026-1st",
  "year": 2026,
  "works": [
    {
      "studentName": "New Student",
      "title": "Rendering Title",
      "image": "past-works/2026-spring/image.jpg",
      "description": "Description of the work"
    }
  ]
}
```

## Adding Student Works

1. Create a new folder in `past-works/` for each semester (e.g., `2026-spring/`)
2. Add student rendered images (JPG or PNG format recommended)
3. Update `data.json` with the new semester and image references
4. The gallery will automatically update

### Image Guidelines

- **Format**: JPG or PNG
- **Size**: Keep under 5MB for faster loading
- **Dimensions**: Square or landscape (400x300px minimum recommended)
- **Naming**: Use descriptive names (e.g., `student-name-crystal-sphere.jpg`)

## Customization

### Colors

Edit the color values in `style.css`:

```css
/* Main gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accent color */
color: #667eea;
```

### Fonts

Modify the font in `style.css`:

```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

### Navigation

Add or remove navigation items by editing the navbar in `index.html` or modifying `style.css` nav styling.

## Deployment Checklist

Before making your site public:

- [ ] Replace sample data in `data.json` with actual course information
- [ ] Add your PDF slides to the `slides/` folder
- [ ] Add student work images to `past-works/` folders
- [ ] Update `file-manifest.json` with correct timestamps
- [ ] Test all slide download links
- [ ] Verify responsive design on mobile devices
- [ ] Check that all image paths are correct

## Troubleshooting

### Slides won't download

- Ensure slide files exist in the `slides/` directory
- Check that the filename in `data.json` matches the actual file name
- Verify file extensions are correct (.pdf, not .PDF)

### Images not showing in past works

- Check file paths in `data.json` match actual image locations
- Ensure images are in the correct subdirectories
- Verify image file names don't have spaces or special characters

### Update times not displaying

- Make sure `file-manifest.json` exists in the root directory
- Verify timestamps are in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- Check browser console for error messages

## Local Testing

To test locally before deploying:

1. Install Python 3 (or any simple HTTP server)
2. Navigate to the project directory
3. Run: `python -m http.server 8000`
4. Open: `http://localhost:8000` in your browser

## License

This website template is provided as-is for educational purposes.

## Support

For questions about setup or customization, refer to the file structure and comments in the HTML, CSS, and JavaScript files.

---

**Last Updated**: May 22, 2026
