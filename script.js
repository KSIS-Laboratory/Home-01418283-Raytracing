// Load course data from JSON
async function loadCourseData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading course data:', error);
        return null;
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get file modification time from GitHub API
async function getFileUpdateTime(filePath) {
    try {
        // This requires the repo to be on GitHub
        // For local development or private repos, use the manifest approach
        const manifestResponse = await fetch('file-manifest.json');
        if (!manifestResponse.ok) {
            return null;
        }
        const manifest = await manifestResponse.json();
        return manifest[filePath] || null;
    } catch (error) {
        console.warn(`Could not retrieve update time for ${filePath}`);
        return null;
    }
}

// Generate material from data
async function generateMaterial(data) {
    const container = document.getElementById('materialContainer');
    container.innerHTML = '';

    for (const week of data.material) {
        const weekCard = document.createElement('div');
        weekCard.className = 'week-card';

        const weekTitle = document.createElement('h3');
        weekTitle.textContent = `Week ${week.week}`;
        weekCard.appendChild(weekTitle);

        const topic = document.createElement('div');
        topic.className = 'week-topic';
        topic.textContent = week.topic;
        weekCard.appendChild(topic);

        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = week.slideFile;
        downloadLink.className = 'slide-link';
        downloadLink.download = week.slideFilename;
        downloadLink.textContent = '📥 Download Slide';
        weekCard.appendChild(downloadLink);

        // Add update info
        const updateInfo = document.createElement('div');
        updateInfo.className = 'update-info';
        updateInfo.id = `update-${week.week}`;
        updateInfo.textContent = 'Loading update info...';
        weekCard.appendChild(updateInfo);

        container.appendChild(weekCard);

        // Try to get update time
        const updateTime = await getFileUpdateTime(week.slideFile);
        if (updateTime) {
            updateInfo.textContent = `Last updated: ${formatDate(updateTime)}`;
        } else {
            updateInfo.textContent = 'Update time not available';
        }
    }
}

// Generate past works gallery
function generatePastWorks(data) {
    const semesterTabs = document.getElementById('semesterTabs');
    const gallery = document.getElementById('workGallery');
    
    semesterTabs.innerHTML = '';
    
    // Create tabs for each semester
    data.pastWorks.forEach((semester, index) => {
        const tab = document.createElement('button');
        tab.className = `semester-tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = semester.semester;
        tab.onclick = () => displayGalleryForSemester(semester, data.pastWorks);
        semesterTabs.appendChild(tab);
    });

    // Display first semester by default
    if (data.pastWorks.length > 0) {
        displayGalleryForSemester(data.pastWorks[0], data.pastWorks);
    }
}

// Display gallery for selected semester
function displayGalleryForSemester(semester, allSemesters) {
    const gallery = document.getElementById('workGallery');
    gallery.innerHTML = '';

    // Update active tab
    const tabs = document.querySelectorAll('.semester-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent === semester.semester) {
            tab.classList.add('active');
        }
    });

    // Populate gallery
    semester.works.forEach(work => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = work.image;
        img.alt = work.title;
        img.className = 'gallery-image';
        img.onerror = () => {
            // Show placeholder if image not found
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="250"%3E%3Crect fill="%23f0f0f0" width="300" height="250"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EImage Not Available%3C/text%3E%3C/svg%3E';
        };
        item.appendChild(img);

        const info = document.createElement('div');
        info.className = 'gallery-info';

        const title = document.createElement('h4');
        title.textContent = work.title;
        info.appendChild(title);

        const studentName = document.createElement('div');
        studentName.className = 'student-name';
        studentName.textContent = `by ${work.studentName}`;
        info.appendChild(studentName);

        const description = document.createElement('div');
        description.className = 'work-description';
        description.textContent = work.description;
        info.appendChild(description);

        item.appendChild(info);
        gallery.appendChild(item);
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the page
async function init() {
    const data = await loadCourseData();
    if (data) {
        await generateMaterial(data);
        generatePastWorks(data);
    }
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
