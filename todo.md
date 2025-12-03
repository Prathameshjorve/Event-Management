# Event Management System - MVP Implementation Plan

## Core Files to Create/Modify:

1. **index.html** - Main landing page with login/register options
2. **style.css** - Global styles for the entire application
3. **script.js** - Main JavaScript for routing and initialization

4. **auth.html** - Login/Register page for both admin and users
5. **auth.js** - Authentication logic and user management

6. **admin-dashboard.html** - Admin panel for event management
7. **admin-dashboard.js** - Admin functionality (add/edit/delete events, conflict checking)

8. **events.html** - Event listing page for users
9. **events.js** - Display events and navigation to booking

10. **booking.html** - Auditorium seat selection interface
11. **booking.js** - Seat selection logic and availability checking

12. **payment.html** - Payment and booking confirmation page
13. **payment.js** - Payment processing and booking finalization

14. **user-bookings.html** - User's booking history
15. **user-bookings.js** - Display user's past and upcoming bookings

## Data Structure (localStorage):
- users: [{id, username, password, role: 'admin'/'user'}]
- events: [{id, name, date, time, duration, description}]
- bookings: [{id, userId, eventId, seats: [], paymentStatus, timestamp}]
- seatAvailability: {eventId: [seat numbers booked]}

## Features:
- 100 seats (10 rows × 10 columns)
- Event conflict prevention (no overlapping time slots)
- Role-based access (admin vs user)
- Real-time seat availability
- Simple payment simulation