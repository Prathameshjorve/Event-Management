// Authentication logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage if empty
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
            { id: 2, username: 'user', password: 'user123', role: 'user' }
        ]));
    }

    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetTab}Form`).classList.add('active');
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;
        
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.username === username && u.password === password && u.role === role);
        
        const messageEl = document.getElementById('loginMessage');
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            messageEl.textContent = 'Login successful! Redirecting...';
            messageEl.className = 'message success';
            
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'events.html';
                }
            }, 1000);
        } else {
            messageEl.textContent = 'Invalid credentials or role mismatch';
            messageEl.className = 'message error';
        }
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const role = document.getElementById('registerRole').value;
        
        const messageEl = document.getElementById('registerMessage');
        
        if (password !== confirmPassword) {
            messageEl.textContent = 'Passwords do not match';
            messageEl.className = 'message error';
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users'));
        
        if (users.find(u => u.username === username)) {
            messageEl.textContent = 'Username already exists';
            messageEl.className = 'message error';
            return;
        }
        
        const newUser = {
            id: Date.now(),
            username,
            password,
            role
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        messageEl.textContent = 'Registration successful! Please login.';
        messageEl.className = 'message success';
        
        setTimeout(() => {
            document.querySelector('[data-tab="login"]').click();
            document.getElementById('loginUsername').value = username;
        }, 1500);
    });
});