// EventPulse Organizer Dashboard JavaScript

// Sample data
let events = [
    {
        id: "1",
        title: "AI in Healthcare Conference",
        date: "2024-02-15",
        time: "09:00",
        location: "Main Auditorium",
        attendees: 145,
        maxAttendees: 200,
        status: "upcoming",
        speakers: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
        description: "Exploring the future of AI in healthcare applications"
    },
    {
        id: "2",
        title: "Digital Transformation Workshop",
        date: "2024-02-18",
        time: "14:00",
        location: "Conference Room A",
        attendees: 89,
        maxAttendees: 100,
        status: "upcoming",
        speakers: ["Dr. Alex Thompson"],
        description: "Hands-on workshop on digital transformation strategies"
    },
    {
        id: "3",
        title: "Cybersecurity Summit",
        date: "2024-02-12",
        time: "10:00",
        location: "Tech Hub",
        attendees: 167,
        maxAttendees: 150,
        status: "completed",
        speakers: ["Maria Rodriguez", "John Smith", "Dr. Emily Parker"],
        description: "Latest trends and threats in cybersecurity"
    }
];

// Current user state
let currentUser = null;

// Calendar state
let currentCalendarDate = new Date();
let selectedDate = null;

// DOM Elements
const dashboardPage = document.getElementById('dashboardPage');
const eventForm = document.getElementById('eventForm');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check if user is logged in (simulate with localStorage)
    const savedUser = localStorage.getItem('eventPulseUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('googleLoginBtn').addEventListener('click', handleGoogleLogin);
    
    // Event form
    eventForm.addEventListener('submit', handleCreateEvent);
    
    // Sidebar navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Calendar navigation
    document.getElementById('prevMonth')?.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Event management
    setupEventManagement();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulate login process
    setButtonLoading('loginBtn', true);
    
    setTimeout(() => {
        if (email && password) {
            currentUser = {
                id: '1',
                name: 'John Organizer',
                email: email,
                role: 'organizer'
            };
            
            localStorage.setItem('eventPulseUser', JSON.stringify(currentUser));
            showNotification('Login successful!', 'success');
            showDashboard();
        } else {
            showNotification('Please fill in all fields', 'error');
        }
        setButtonLoading('loginBtn', false);
    }, 1500);
}

function handleGoogleLogin() {
    setButtonLoading('googleLoginBtn', true);
    
    setTimeout(() => {
        currentUser = {
            id: '1',
            name: 'John Organizer',
            email: 'organizer@eventpulse.com',
            role: 'organizer'
        };
        
        localStorage.setItem('eventPulseUser', JSON.stringify(currentUser));
        showNotification('Google login successful!', 'success');
        showDashboard();
        setButtonLoading('googleLoginBtn', false);
    }, 2000);
}

function handleLogout() {
    localStorage.removeItem('eventPulseUser');
    currentUser = null;
    showLogin();
    showNotification('Logged out successfully', 'info');
}

function showLogin() {
    loginPage.classList.add('active');
    dashboardPage.classList.remove('active');
}

function showDashboard() {
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
    updateDashboardStats();
    renderRecentActivities();
    renderEvents();
    renderCalendar();
}

function handleNavigation(e) {
    e.preventDefault();
    const section = e.currentTarget.dataset.section;
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Show corresponding content section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
}

function handleCreateEvent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newEvent = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        maxAttendees: parseInt(document.getElementById('maxAttendees').value),
        speakers: document.getElementById('speakers').value.split(',').map(s => s.trim()).filter(s => s),
        description: document.getElementById('eventDescription').value,
        attendees: 0,
        status: "upcoming"
    };
    
    events.push(newEvent);
    eventForm.reset();
    
    showNotification('Event created successfully!', 'success');
    updateDashboardStats();
    renderEvents();
    renderCalendar();
}

function updateDashboardStats() {
    const totalEvents = events.length;
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
    const totalRevenue = totalAttendees * 150; // $150 per ticket
    
    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('totalAttendees').textContent = totalAttendees.toLocaleString();
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
}

function renderRecentActivities() {
    const activitiesContainer = document.getElementById('recentActivities');
    const recentEvents = events.slice(0, 3);
    
    activitiesContainer.innerHTML = recentEvents.map(event => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="activity-details">
                <h4>${event.title}</h4>
                <p>${event.date} • ${event.attendees} attendees</p>
            </div>
            <span class="status status-${event.status}">${event.status}</span>
        </div>
    `).join('');
}

function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    
    eventsGrid.innerHTML = events.map(event => {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleString('default', { month: 'short' });
        
        return `
            <div class="event-card">
                <div class="event-date">
                    <div class="day">${day}</div>
                    <div class="month">${month}</div>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p><i class="fas fa-clock"></i> ${event.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    <p><i class="fas fa-users"></i> ${event.attendees}/${event.maxAttendees} attendees</p>
                    <p><i class="fas fa-microphone"></i> ${event.speakers.join(', ')}</p>
                </div>
                <div class="event-actions">
                    <button class="btn-secondary" onclick="editEvent('${event.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-secondary btn-danger" onclick="deleteEvent('${event.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function setupEventManagement() {
    // Event management functions will be called from inline onclick handlers
}

function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        // Populate form with event data
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('maxAttendees').value = event.maxAttendees;
        document.getElementById('speakers').value = event.speakers.join(', ');
        document.getElementById('eventDescription').value = event.description || '';
        
        // Switch to scheduler tab
        document.querySelector('[data-section="scheduler"]').click();
        
        // Update form to edit mode
        const form = document.getElementById('eventForm');
        form.dataset.editId = eventId;
        form.querySelector('button[type="submit"]').textContent = 'Update Event';
        
        showNotification('Event loaded for editing', 'info');
    }
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== eventId);
        renderEvents();
        updateDashboardStats();
        showNotification('Event deleted successfully', 'success');
    }
}

function setButtonLoading(buttonId, loading) {
    const button = document.getElementById(buttonId);
    if (loading) {
        button.disabled = true;
        button.style.position = 'relative';
        button.style.color = 'transparent';
    } else {
        button.disabled = false;
        button.style.position = '';
        button.style.color = '';
    }
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 3000);
}

// Calendar Functions
function renderCalendar() {
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarDaysElement = document.getElementById('calendarDays');
    
    if (!currentMonthElement || !calendarDaysElement) return;
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthElement.textContent = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;
    
    // Generate calendar days
    const firstDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1);
    const lastDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    let calendarHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const prevMonthDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 0 - (startingDayOfWeek - 1 - i));
        calendarHTML += `<div class="calendar-day other-month" data-date="${formatDate(prevMonthDay)}">
            <div class="day-number">${prevMonthDay.getDate()}</div>
        </div>`;
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), day);
        const dateString = formatDate(currentDay);
        const dayEvents = getEventsForDate(dateString);
        const hasEvents = dayEvents.length > 0;
        const isSelected = selectedDate === dateString;
        
        calendarHTML += `<div class="calendar-day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}" 
            data-date="${dateString}" onclick="selectDate('${dateString}')">
            <div class="day-number">${day}</div>
            ${hasEvents ? `<div class="event-indicator">${dayEvents.length}</div>` : ''}
        </div>`;
    }
    
    // Add remaining days to complete the calendar grid
    const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
        const nextMonthDay = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, day);
        calendarHTML += `<div class="calendar-day other-month" data-date="${formatDate(nextMonthDay)}">
            <div class="day-number">${day}</div>
        </div>`;
    }
    
    calendarDaysElement.innerHTML = calendarHTML;
}

function getEventsForDate(dateString) {
    return events.filter(event => event.date === dateString);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function selectDate(dateString) {
    selectedDate = dateString;
    renderCalendar();
    renderSelectedDateEvents(dateString);
}

function renderSelectedDateEvents(dateString) {
    const selectedDateTitle = document.getElementById('selectedDateTitle');
    const selectedDateEventsList = document.getElementById('selectedDateEventsList');
    
    if (!selectedDateTitle || !selectedDateEventsList) return;
    
    const dateEvents = getEventsForDate(dateString);
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    selectedDateTitle.textContent = `Events for ${formattedDate}`;
    
    if (dateEvents.length === 0) {
        selectedDateEventsList.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 1rem;">No events scheduled for this date</p>';
        return;
    }
    
    selectedDateEventsList.innerHTML = dateEvents.map(event => `
        <div class="date-event-item">
            <h4>${event.title}</h4>
            <p><i class="fas fa-clock"></i> ${event.time} • <i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-users"></i> ${event.attendees}/${event.maxAttendees} attendees</p>
        </div>
    `).join('');
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);