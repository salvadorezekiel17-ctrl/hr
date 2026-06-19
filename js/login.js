/* ========================================
   LOGIN.JS - Login Form Handling
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const messageDiv = document.getElementById('message');
        const loginBtn = document.getElementById('loginBtn');

        // Clear previous message
        showMessage('message', '', 'error');

        // Validate inputs
        if (!email || !password) {
            showMessage('message', 'All fields are required.', 'error');
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            showMessage('message', 'Please enter a valid email address.', 'error');
            return;
        }

        // Disable button and show loading state
        setButtonLoading('loginBtn', true, 'Signing in...');

        try {
            // Perform login
            const response = await performLogin(email, password);

            // Show success message
            showMessage('message', 'Login successful! Redirecting...', 'success');

            // Redirect after a short delay
            setTimeout(() => {
                redirectByRole(response.user.role);
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            showMessage('message', error.message || 'Login failed. Please try again.', 'error');
            setButtonLoading('loginBtn', false);
        }
    });
});
