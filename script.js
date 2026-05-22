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

// Generate home section
async function generateHome(data) {
    const homeContent = document.getElementById('homeContent');
    homeContent.innerHTML = '';

    const overview = data.courseOverview;

    // Introduction section
    const intro = document.createElement('div');
    intro.className = 'home-section-block';
    const introTitle = document.createElement('h2');
    introTitle.textContent = 'What is Ray Tracing?';
    intro.appendChild(introTitle);
    const introText = document.createElement('p');
    introText.textContent = overview.introduction;
    intro.appendChild(introText);
    homeContent.appendChild(intro);

    // Course Structure section
    const structure = document.createElement('div');
    structure.className = 'home-section-block';
    const structureTitle = document.createElement('h2');
    structureTitle.textContent = 'Course Structure';
    structure.appendChild(structureTitle);
    const structureText = document.createElement('p');
    structureText.textContent = overview.courseStructure;
    structure.appendChild(structureText);
    homeContent.appendChild(structure);

    // Learning Language section
    const language = document.createElement('div');
    language.className = 'home-section-block';
    const languageTitle = document.createElement('h2');
    languageTitle.textContent = 'Learning with Python';
    language.appendChild(languageTitle);
    const languageText = document.createElement('p');
    languageText.textContent = overview.learningLanguage;
    language.appendChild(languageText);
    homeContent.appendChild(language);

    // Weekly Structure section
    const weekly = document.createElement('div');
    weekly.className = 'home-section-block';
    const weeklyTitle = document.createElement('h2');
    weeklyTitle.textContent = '15 Weeks of Ray Tracing Curriculum';
    weekly.appendChild(weeklyTitle);
    const weeklyText = document.createElement('p');
    weeklyText.textContent = overview.weeklyStructure;
    weekly.appendChild(weeklyText);
    homeContent.appendChild(weekly);

    // Course Outline section
    const outline = document.createElement('div');
    outline.className = 'home-section-block';
    const outlineTitle = document.createElement('h2');
    outlineTitle.textContent = 'Course Outline';
    outline.appendChild(outlineTitle);
    const outlineText = document.createElement('p');
    outlineText.textContent = overview.courseOutline;
    outline.appendChild(outlineText);
    homeContent.appendChild(outline);


    // Audience section
    const audience = document.createElement('div');
    audience.className = 'home-section-block';
    const audienceText = document.createElement('p');
    audienceText.className = 'audience-info';
    audienceText.textContent = '📚 ' + overview.audience;
    audience.appendChild(audienceText);
    homeContent.appendChild(audience);
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

// Generate schedule
function generateSchedule(data) {
    const scheduleTabs = document.getElementById('scheduleTabs');
    
    scheduleTabs.innerHTML = '';
    
    // Create tabs for each semester
    data.schedules.forEach((semester, index) => {
        const tab = document.createElement('button');
        tab.className = `semester-tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = semester.semester;
        tab.onclick = () => displayScheduleForSemester(semester, data.schedules);
        scheduleTabs.appendChild(tab);
    });

    // Display first semester by default
    if (data.schedules.length > 0) {
        displayScheduleForSemester(data.schedules[0], data.schedules);
    }
}

// Display schedule for selected semester
function displayScheduleForSemester(semester, allSemesters) {
    const table = document.getElementById('scheduleTable');
    table.innerHTML = '';

    // Update active tab
    const tabs = document.querySelectorAll('.semester-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent === semester.semester) {
            tab.classList.add('active');
        }
    });

    // Create table
    const scheduleTable = document.createElement('table');
    scheduleTable.className = 'course-schedule';

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Week', 'Topic', 'Description'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    scheduleTable.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    
    semester.weeks.forEach(weekData => {
        const row = document.createElement('tr');
        
        // Week
        const weekCell = document.createElement('td');
        weekCell.className = 'week-number';
        weekCell.textContent = `Week ${weekData.week}`;
        row.appendChild(weekCell);
        
        // Topic
        const topicCell = document.createElement('td');
        topicCell.className = 'week-topic';
        topicCell.textContent = weekData.topic;
        row.appendChild(topicCell);
        
        // Description
        const descriptionCell = document.createElement('td');
        descriptionCell.className = 'week-description';
        descriptionCell.textContent = weekData.description || '-';
        row.appendChild(descriptionCell);
        
        tbody.appendChild(row);
    });
    
    scheduleTable.appendChild(tbody);
    table.appendChild(scheduleTable);
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
        await generateHome(data);
        await generateMaterial(data);
        generateSchedule(data);
        generatePastWorks(data);
    }
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
