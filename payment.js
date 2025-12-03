// Payment processing
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
    if (!bookingData) {
        window.location.href = 'events.html';
        return;
    }

    // Display booking details
    document.getElementById('eventName').textContent = bookingData.eventName;
    document.getElementById('eventDateTime').textContent = `${bookingData.eventDate} at ${bookingData.eventTime}`;
    document.getElementById('selectedSeats').textContent = bookingData.seats.join(', ');
    document.getElementById('totalAmount').textContent = `$${bookingData.totalAmount}`;

    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    // Format expiry date input
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // CVV input - numbers only
    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Payment form submission
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const messageEl = document.getElementById('paymentMessage');
        messageEl.textContent = 'Processing payment...';
        messageEl.className = 'message';

        // Simulate payment processing
        setTimeout(() => {
            // Create booking
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            const newBooking = {
                id: Date.now(),
                userId: currentUser.id,
                eventId: bookingData.eventId,
                eventName: bookingData.eventName,
                eventDate: bookingData.eventDate,
                eventTime: bookingData.eventTime,
                seats: bookingData.seats,
                totalAmount: bookingData.totalAmount,
                paymentStatus: 'completed',
                bookingDate: new Date().toISOString()
            };

            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            messageEl.textContent = 'Payment successful! Redirecting to your bookings...';
            messageEl.className = 'message success';

            sessionStorage.removeItem('bookingData');

            setTimeout(() => {
                window.location.href = 'user-bookings.html';
            }, 2000);
        }, 1500);
    });
});