// Booking page logic
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('eventId'));

    const events = JSON.parse(localStorage.getItem('events')) || [];
    const event = events.find(e => e.id === eventId);

    if (!event) {
        alert('Event not found');
        window.location.href = 'events.html';
        return;
    }

    // Display event info
    document.getElementById('eventName').textContent = event.name;
    document.getElementById('eventDateTime').textContent = `${event.date} at ${event.time} (${event.duration}h)`;

    // Get booked seats for this event
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookedSeats = bookings
        .filter(b => b.eventId === eventId)
        .reduce((seats, booking) => seats.concat(booking.seats), []);

    let selectedSeats = [];

    // Create seat map (10 rows x 10 columns = 100 seats)
    const seatMap = document.getElementById('seatMap');
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        const rowLabel = document.createElement('span');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        rowDiv.appendChild(rowLabel);

        for (let i = 1; i <= 10; i++) {
            const seatNumber = `${row}${i}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.dataset.seat = seatNumber;
            seat.textContent = i;

            if (bookedSeats.includes(seatNumber)) {
                seat.classList.add('booked');
            } else {
                seat.classList.add('available');
                seat.addEventListener('click', () => toggleSeat(seatNumber, seat));
            }

            rowDiv.appendChild(seat);
        }

        seatMap.appendChild(rowDiv);
    });

    function toggleSeat(seatNumber, seatElement) {
        if (seatElement.classList.contains('selected')) {
            seatElement.classList.remove('selected');
            seatElement.classList.add('available');
            selectedSeats = selectedSeats.filter(s => s !== seatNumber);
        } else {
            seatElement.classList.remove('available');
            seatElement.classList.add('selected');
            selectedSeats.push(seatNumber);
        }

        updateSummary();
    }

    function updateSummary() {
        const count = selectedSeats.length;
        const total = count * 50;

        document.getElementById('selectedSeatsCount').textContent = count;
        document.getElementById('selectedSeatsList').textContent = count > 0 ? selectedSeats.sort().join(', ') : 'None';
        document.getElementById('totalAmount').textContent = `$${total}`;

        document.getElementById('proceedBtn').disabled = count === 0;
    }

    document.getElementById('proceedBtn').addEventListener('click', () => {
        if (selectedSeats.length > 0) {
            sessionStorage.setItem('bookingData', JSON.stringify({
                eventId,
                eventName: event.name,
                eventDate: event.date,
                eventTime: event.time,
                seats: selectedSeats,
                totalAmount: selectedSeats.length * 50
            }));
            window.location.href = 'payment.html';
        }
    });
});