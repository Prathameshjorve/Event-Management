// Events listing page
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        document.getElementById('userName').textContent = `Welcome, ${currentUser.username}`;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    } else {
        document.getElementById('userName').style.display = 'none';
        document.getElementById('logoutBtn').textContent = 'Login';
        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.location.href = 'auth.html';
        });
        document.querySelector('a[href="user-bookings.html"]').style.display = 'none';
    }

    function loadEvents() {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const eventsGrid = document.getElementById('eventsGrid');
        const noEvents = document.getElementById('noEvents');

        eventsGrid.innerHTML = '';

        if (events.length === 0) {
            noEvents.style.display = 'block';
            return;
        }

        noEvents.style.display = 'none';

        // Sort by date and time
        events.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        events.forEach(event => {
            const eventBookings = bookings.filter(b => b.eventId === event.id);
            const bookedSeats = eventBookings.reduce((seats, booking) => {
                return seats.concat(booking.seats);
            }, []);
            const availableSeats = 100 - bookedSeats.length;

            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-card-header">
                    <h3>${event.name}</h3>
                    <span class="event-date">${formatDate(event.date)}</span>
                </div>
                <div class="event-card-body">
                    <p class="event-description">${event.description}</p>
                    <div class="event-details">
                        <div class="event-detail">
                            <span class="detail-label">Time:</span>
                            <span class="detail-value">${formatTime(event.time)}</span>
                        </div>
                        <div class="event-detail">
                            <span class="detail-label">Duration:</span>
                            <span class="detail-value">${event.duration} hours</span>
                        </div>
                        <div class="event-detail">
                            <span class="detail-label">Available Seats:</span>
                            <span class="detail-value ${availableSeats === 0 ? 'sold-out' : ''}">${availableSeats}/100</span>
                        </div>
                    </div>
                </div>
                <div class="event-card-footer">
                    ${availableSeats > 0 
                        ? `<button class="btn-primary btn-full" onclick="bookEvent(${event.id})">Book Seats</button>`
                        : `<button class="btn-full btn-disabled" disabled>Sold Out</button>`
                    }
                </div>
            `;
            eventsGrid.appendChild(eventCard);
        });
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    }

    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    window.bookEvent = function(eventId) {
        if (!currentUser) {
            alert('Please login to book seats');
            window.location.href = 'auth.html';
            return;
        }
        window.location.href = `booking.html?eventId=${eventId}`;
    };

    loadEvents();
});