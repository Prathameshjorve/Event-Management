// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('EventHub - Event Management System initialized');
    
    // Initialize localStorage with default data if needed
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
            { id: 2, username: 'user', password: 'user123', role: 'user' }
        ]));
    }
    
    if (!localStorage.getItem('events')) {
        localStorage.setItem('events', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
});