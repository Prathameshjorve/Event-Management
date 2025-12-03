// Admin dashboard logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'auth.html';
        return;
    }

    document.getElementById('adminName').textContent = `Admin: ${currentUser.username}`;

    // Initialize events if empty
    if (!localStorage.getItem('events')) {
        localStorage.setItem('events', JSON.stringify([]));
    }
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Show/hide add event form
    document.getElementById('addEventBtn').addEventListener('click', () => {
        document.getElementById('addEventForm').style.display = 'block';
        document.getElementById('formTitle').textContent = 'Add New Event';
        document.getElementById('eventForm').reset();
        document.getElementById('eventId').value = '';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('addEventForm').style.display = 'none';
        document.getElementById('eventForm').reset();
    });

    // Check for time conflicts
    function hasTimeConflict(date, time, duration, excludeId = null) {
        const events = JSON.parse(localStorage.getItem('events'));
        const newStart = new Date(`${date}T${time}`);
        const newEnd = new Date(newStart.getTime() + duration * 60 * 60 * 1000);

        return events.some(event => {
            if (excludeId && event.id === excludeId) return false;
            
            const existingStart = new Date(`${event.date}T${event.time}`);
            const existingEnd = new Date(existingStart.getTime() + event.duration * 60 * 60 * 1000);

            return (newStart < existingEnd && newEnd > existingStart);
        });
    }

    // Add/Edit event form submission
    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const eventId = document.getElementById('eventId').value;
        const name = document.getElementById('eventName').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const duration = parseInt(document.getElementById('eventDuration').value);
        const description = document.getElementById('eventDescription').value;

        const messageEl = document.getElementById('formMessage');

        // Check for conflicts
        if (hasTimeConflict(date, time, duration, eventId ? parseInt(eventId) : null)) {
            messageEl.textContent = 'Time conflict! Another event is scheduled at this time.';
            messageEl.className = 'message error';
            return;
        }

        const events = JSON.parse(localStorage.getItem('events'));

        if (eventId) {
            // Edit existing event
            const index = events.findIndex(e => e.id === parseInt(eventId));
            events[index] = { id: parseInt(eventId), name, date, time, duration, description };
            messageEl.textContent = 'Event updated successfully!';
        } else {
            // Add new event
            const newEvent = {
                id: Date.now(),
                name,
                date,
                time,
                duration,
                description
            };
            events.push(newEvent);
            messageEl.textContent = 'Event added successfully!';
        }

        localStorage.setItem('events', JSON.stringify(events));
        messageEl.className = 'message success';

        setTimeout(() => {
            document.getElementById('addEventForm').style.display = 'none';
            document.getElementById('eventForm').reset();
            loadEvents();
        }, 1500);
    });

    // Load and display events
    function loadEvents() {
        const events = JSON.parse(localStorage.getItem('events'));
        const bookings = JSON.parse(localStorage.getItem('bookings'));
        const tbody = document.getElementById('eventsTableBody');

        tbody.innerHTML = '';

        events.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        events.forEach(event => {
            const eventBookings = bookings.filter(b => b.eventId === event.id);
            const totalSeats = eventBookings.reduce((sum, b) => sum + b.seats.length, 0);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.time}</td>
                <td>${event.duration}h</td>
                <td>${totalSeats} seats</td>
                <td class="action-buttons">
                    <button class="btn-small btn-primary" onclick="editEvent(${event.id})">Edit</button>
                    <button class="btn-small btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Edit event
    window.editEvent = function(id) {
        const events = JSON.parse(localStorage.getItem('events'));
        const event = events.find(e => e.id === id);

        document.getElementById('eventId').value = event.id;
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventDuration').value = event.duration;
        document.getElementById('eventDescription').value = event.description;

        document.getElementById('formTitle').textContent = 'Edit Event';
        document.getElementById('addEventForm').style.display = 'block';
    };

    // Delete event
    window.deleteEvent = function(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            let events = JSON.parse(localStorage.getItem('events'));
            events = events.filter(e => e.id !== id);
            localStorage.setItem('events', JSON.stringify(events));
            loadEvents();
        }
    };

    loadEvents();
});