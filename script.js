// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const createEventBtn = document.getElementById('create-event-btn');
const myEventsBtn = document.getElementById('my-events-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const createEventModal = document.getElementById('create-event-modal');
const eventsContainer = document.getElementById('events-container');

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    loadEvents();
});

loginBtn.addEventListener('click', () => showModal(loginModal));
signupBtn.addEventListener('click', () => showModal(signupModal));
createEventBtn.addEventListener('click', () => showModal(createEventModal));
logoutBtn.addEventListener('click', handleLogout);

// Close modals when clicking the close button or outside the modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Form Submissions
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('signup-form').addEventListener('submit', handleSignup);
document.getElementById('create-event-form').addEventListener('submit', handleCreateEvent);

// Functions
function showModal(modal) {
    modal.style.display = 'block';
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        createEventBtn.style.display = 'inline-block';
        myEventsBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';
        createEventBtn.style.display = 'none';
        myEventsBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            loginModal.style.display = 'none';
            checkAuthStatus();
            loadEvents();
        } else {
            alert(data.msg || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('An error occurred during login');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            signupModal.style.display = 'none';
            checkAuthStatus();
            loadEvents();
        } else {
            alert(data.msg || 'Registration failed');
        }
    } catch (err) {
        console.error('Signup error:', err);
        alert('An error occurred during registration');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    checkAuthStatus();
    loadEvents();
}

async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const events = await response.json();

        eventsContainer.innerHTML = '';
        events.forEach(event => {
            const eventCard = createEventCard(event);
            eventsContainer.appendChild(eventCard);
        });
    } catch (err) {
        console.error('Error loading events:', err);
        eventsContainer.innerHTML = '<p>Error loading events. Please try again later.</p>';
    }
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
        <div class="event-image">
            <img src="https://via.placeholder.com/300x200" alt="${event.title}">
        </div>
        <div class="event-info">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-date">${new Date(event.date).toLocaleString()}</p>
            <p class="event-location">${event.location}</p>
            <p class="event-description">${event.description}</p>
            <div class="event-meta">
                <span class="event-capacity">${event.attendees.length}/${event.capacity} attendees</span>
                <button class="register-btn" onclick="registerForEvent('${event._id}')">Register</button>
            </div>
        </div>
    `;
    return card;
}

async function handleCreateEvent(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to create an event');
        return;
    }

    const eventData = {
        title: document.getElementById('event-title').value,
        description: document.getElementById('event-description').value,
        date: document.getElementById('event-date').value,
        location: document.getElementById('event-location').value,
        capacity: parseInt(document.getElementById('event-capacity').value),
        category: document.getElementById('event-category').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(eventData)
        });

        const data = await response.json();

        if (response.ok) {
            createEventModal.style.display = 'none';
            loadEvents();
        } else {
            alert(data.msg || 'Failed to create event');
        }
    } catch (err) {
        console.error('Error creating event:', err);
        alert('An error occurred while creating the event');
    }
}

async function registerForEvent(eventId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to register for events');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
            method: 'PUT',
            headers: {
                'x-auth-token': token
            }
        });

        const data = await response.json();

        if (response.ok) {
            loadEvents();
        } else {
            alert(data.msg || 'Failed to register for event');
        }
    } catch (err) {
        console.error('Error registering for event:', err);
        alert('An error occurred while registering for the event');
    }
}