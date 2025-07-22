// Simulated users and papers
const users = [
  { username: "reviewer1", password: "pass123", name: "Alice Reviewer", email: "alice@example.com", firstName: "Alice", lastName: "Reviewer", phone: "123-456-7890", expertise: "AI, Healthcare", assignedPapers: [1, 2] },
  { username: "reviewer2", password: "pass456", name: "Bob Reviewer", email: "bob@example.com", firstName: "Bob", lastName: "Reviewer", phone: "987-654-3210", expertise: "Blockchain, Security", assignedPapers: [3] }
];

const papers = [
  { id: 1, title: "AI in Healthcare", abstract: "Exploring AI applications in healthcare.", pdf: "#" },
  { id: 2, title: "Quantum Computing", abstract: "Introduction to quantum algorithms.", pdf: "#" },
  { id: 3, title: "Blockchain Security", abstract: "Security aspects of blockchain technology.", pdf: "#" }
];

let reviews = {};
let activities = [];
let currentUser = null;

function showLogin() {
  document.getElementById('dashboard-section').style.display = 'none';
}

function showDashboard() {
  document.getElementById('login-bg').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'flex';
  document.getElementById('user-name').textContent = currentUser.name;
  showPage('overview');
  updateStatsAndActivities();
}

document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
  if (user) {
    currentUser = user;
    showDashboard();
  } else {
    document.getElementById('login-error').textContent = "Invalid credentials.";
  }
};

document.getElementById('logout-btn').onclick = function() {
  currentUser = null;
  showLogin();
};

// Sidebar navigation
const sidebarLinks = [
  { id: 'nav-overview', page: 'overview' },
  { id: 'nav-assigned', page: 'assigned' },
  { id: 'nav-completed', page: 'completed' },
  { id: 'nav-profile', page: 'profile' }
];
sidebarLinks.forEach(link => {
  document.getElementById(link.id).onclick = function() {
    document.querySelectorAll('.sidebar nav ul li').forEach(li => li.classList.remove('active'));
    this.classList.add('active');
    showPage(link.page);
  };
});

function showPage(page) {
  document.querySelectorAll('.dashboard-page').forEach(sec => sec.style.display = 'none');
  const pageId = `page-${page}`;
  const pageSection = document.getElementById(pageId);
  if (pageSection) {
    pageSection.style.display = 'block';
    if (page === 'overview') updateStatsAndActivities();
    if (page === 'assigned') renderAssignedPapers();
    if (page === 'completed') renderCompletedReviews();
    if (page === 'profile') renderProfilePage();
  }
}

function updateStatsAndActivities() {
  // Stats
  const assigned = currentUser.assignedPapers.length;
  const reviewed = currentUser.assignedPapers.filter(pid => reviews[pid] && reviews[pid].reviewer === currentUser.username).length;
  const pending = assigned - reviewed;
  document.getElementById('stat-assigned').textContent = assigned;
  document.getElementById('stat-reviewed').textContent = reviewed;
  document.getElementById('stat-pending').textContent = pending;

  // Activities: Only show 'New paper assigned'
  const activitiesList = document.getElementById('activities-list');
  activitiesList.innerHTML = '';
  const userActivities = activities
    .filter(a => a.user === currentUser.username && a.title === 'New paper assigned')
    .slice(-5)
    .reverse();
  if (userActivities.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent activities.';
    activitiesList.appendChild(li);
  } else {
    userActivities.forEach(act => {
      const li = document.createElement('li');
      // Capitalize each word in the activity title and add space before the paper title
      const capTitle = act.title.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      li.innerHTML = `<strong>${capTitle}</strong> <span style="margin-left:8px;">${act.detail} - ${act.time}</span>`;
      activitiesList.appendChild(li);
    });
  }
}

function renderAssignedPapers() {
  const sec = document.getElementById('page-assigned');
  sec.innerHTML = '<h2>Review Assigned Papers</h2>';
  const container = document.createElement('div');
  container.className = 'assigned-bubbles';
  let hasAssigned = false;
  currentUser.assignedPapers.forEach(pid => {
    const paper = papers.find(p => p.id === pid);
    if (!paper) return;
    hasAssigned = true;
    const bubble = document.createElement('div');
    bubble.className = 'paper-bubble';
    bubble.innerHTML = `
      <div class="paper-info">
        <h3>${paper.title}</h3>
        <div class="abstract">${paper.abstract}</div>
        <button class="btn-viewpdf" onclick="window.open('${paper.pdf}','_blank')">View PDF</button>
      </div>
      <form class="review-form" data-paperid="${paper.id}">
        <label>Score
          <select required>
            <option value="">Select</option>
            <option>1 - Poor</option>
            <option>2 - Fair</option>
            <option>3 - Good</option>
            <option>4 - Very Good</option>
            <option>5 - Excellent</option>
          </select>
        </label>
        <label>Comments
          <textarea required></textarea>
        </label>
        <button type="submit">Submit Review</button>
        <div class="review-status"></div>
      </form>
    `;
    container.appendChild(bubble);
    // Fill form if already reviewed
    const review = reviews[paper.id];
    const form = bubble.querySelector('.review-form');
    const scoreSel = form.querySelector('select');
    const commentsTa = form.querySelector('textarea');
    const statusDiv = form.querySelector('.review-status');
    if (review && review.reviewer === currentUser.username) {
      scoreSel.value = review.score;
      commentsTa.value = review.comments;
      statusDiv.textContent = 'Review already submitted.';
      form.querySelector('button[type="submit"]').style.display = 'none';
      scoreSel.disabled = true;
      commentsTa.disabled = true;
    } else {
      form.onsubmit = function(e) {
        e.preventDefault();
        reviews[paper.id] = {
          score: scoreSel.value,
          comments: commentsTa.value,
          reviewer: currentUser.username
        };
        statusDiv.textContent = 'Review submitted!';
        form.querySelector('button[type="submit"]').style.display = 'none';
        scoreSel.disabled = true;
        commentsTa.disabled = true;
        // Add to completed activities
        activities.push({ user: currentUser.username, title: 'Paper review completed', detail: paper.title, time: 'Just now' });
        renderAssignedPapers();
      };
    }
  });
  if (!hasAssigned) {
    container.innerHTML = '<div>No assigned papers.</div>';
  }
  sec.appendChild(container);
}

function renderCompletedReviews() {
  const sec = document.getElementById('page-completed');
  sec.innerHTML = '<h2>Reviews Completed</h2>';
  const list = document.createElement('ul');
  list.className = 'completed-list';
  let hasCompleted = false;
  currentUser.assignedPapers.forEach(pid => {
    const review = reviews[pid];
    if (review && review.reviewer === currentUser.username) {
      hasCompleted = true;
      const paper = papers.find(p => p.id === pid);
      const li = document.createElement('li');
      li.innerHTML = `<strong>${paper.title}</strong><br>${paper.abstract}`;
      list.appendChild(li);
    }
  });
  if (!hasCompleted) {
    list.innerHTML = '<li>No reviews completed yet.</li>';
  }
  sec.appendChild(list);
}

function renderProfilePage() {
  const sec = document.getElementById('page-profile');
  sec.innerHTML = '<h2>Profile</h2><p>Manage your speaker profile and contact information.</p>';
  const container = document.createElement('div');
  container.className = 'profile-container';

  // Profile Card (left)
  const card = document.createElement('div');
  card.className = 'profile-card';
  card.innerHTML = `
    <div class="profile-avatar" id="profile-avatar">
      <span>${currentUser.firstName ? currentUser.firstName[0] : 'U'}</span>
      <label class="profile-avatar-upload" title="Upload photo">
        <input type="file" id="avatar-upload" accept="image/*" style="display:none;">
        <svg width="18" height="18" fill="none" stroke="#f48fb1" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15A7 7 0 1 0 12 19.93"/><path d="M16 16l4 4m0 0l-4-4m4 4V16"/></svg>
      </label>
    </div>
    <div class="profile-name" id="profile-fullname">${currentUser.firstName || ''} ${currentUser.lastName || ''}</div>
    <div class="profile-title" id="profile-title">${currentUser.expertise || ''}</div>
  `;

  // Avatar upload logic (optional, just for UI)
  card.querySelector('#avatar-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        card.querySelector('.profile-avatar').innerHTML = `<img src="${evt.target.result}" alt="Avatar">` + card.querySelector('.profile-avatar-upload').outerHTML;
      };
      reader.readAsDataURL(file);
    }
  });

  // Profile Form (right)
  const form = document.createElement('form');
  form.className = 'profile-form-modern';
  form.innerHTML = `
    <div class="form-row">
      <div style="flex:1">
        <label>First Name</label>
        <input type="text" id="profile-fn" value="${currentUser.firstName || ''}" required>
      </div>
      <div style="flex:1">
        <label>Last Name</label>
        <input type="text" id="profile-ln" value="${currentUser.lastName || ''}" required>
      </div>
    </div>
    <label>Email</label>
    <input type="email" id="profile-email" value="${currentUser.email || ''}" required>
    <label>Phone Number</label>
    <input type="text" id="profile-phone" value="${currentUser.phone || ''}">
    <label>Areas of Expertise</label>
    <input type="text" id="profile-expertise" value="${currentUser.expertise || ''}">
    <button type="submit">Update Profile</button>
    <div class="profile-status"></div>
  `;
  form.onsubmit = function(e) {
    e.preventDefault();
    currentUser.firstName = document.getElementById('profile-fn').value;
    currentUser.lastName = document.getElementById('profile-ln').value;
    currentUser.email = document.getElementById('profile-email').value;
    currentUser.phone = document.getElementById('profile-phone').value;
    currentUser.expertise = document.getElementById('profile-expertise').value;
    // Update card
    card.querySelector('#profile-fullname').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    card.querySelector('#profile-title').textContent = currentUser.expertise;
    form.querySelector('.profile-status').textContent = 'Profile updated!';
    setTimeout(() => { form.querySelector('.profile-status').textContent = ''; }, 2000);
  };

  container.appendChild(card);
  container.appendChild(form);
  sec.appendChild(container);
}

// Example: Add some activities for demo
activities.push(
  { user: 'reviewer1', title: 'New paper assigned', detail: 'Quantum Computing', time: 'Yesterday' },
  { user: 'reviewer1', title: 'New paper assigned', detail: 'AI in Healthcare', time: '2 days ago' },
  { user: 'reviewer2', title: 'New paper assigned', detail: 'Blockchain Security', time: '3 days ago' }
);

// Show login on load
showLogin();