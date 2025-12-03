// User bookings page
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    function loadBookings() {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const userBookings = bookings.filter(b => b.userId === currentUser.id);

        const bookingsList = document.getElementById('bookingsList');
        const noBookings = document.getElementById('noBookings');

        if (userBookings.length === 0) {
            noBookings.style.display = 'block';
            return;
        }

        noBookings.style.display = 'none';
        bookingsList.innerHTML = '';

        // Sort by event date (newest first)
        userBookings.sort((a, b) => new Date(`${b.eventDate}T${b.eventTime}`) - new Date(`${a.eventDate}T${a.eventTime}`));

        userBookings.forEach(booking => {
            const eventDateTime = new Date(`${booking.eventDate}T${booking.eventTime}`);
            const isPast = eventDateTime < new Date();

            const bookingCard = document.createElement('div');
            bookingCard.className = `booking-card ${isPast ? 'past' : 'upcoming'}`;
            bookingCard.innerHTML = `
                <div class="booking-card-header">
                    <h3>${booking.eventName}</h3>
                    <span class="booking-status ${isPast ? 'past' : 'upcoming'}">${isPast ? 'Past Event' : 'Upcoming'}</span>
                </div>
                <div class="booking-card-body">
                    <div class="booking-detail">
                        <span class="detail-label">📅 Date:</span>
                        <span class="detail-value">${formatDate(booking.eventDate)}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">🕐 Time:</span>
                        <span class="detail-value">${formatTime(booking.eventTime)}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">🎫 Seats:</span>
                        <span class="detail-value">${booking.seats.join(', ')}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">💰 Amount Paid:</span>
                        <span class="detail-value">$${booking.totalAmount}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">📝 Booking ID:</span>
                        <span class="detail-value">#${booking.id}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">✅ Status:</span>
                        <span class="detail-value status-completed">${booking.paymentStatus}</span>
                    </div>
                </div>
            `;
            bookingsList.appendChild(bookingCard);
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

    loadBookings();
});