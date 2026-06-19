// HR Registration Module
const HRRegister = (() => {
    const API_ENDPOINT = `${API_BASE}hr/register`;

    const init = () => {
        setupEventListeners();
    };

    const setupEventListeners = () => {
        const form = document.getElementById('registrationForm');
        const submitBtn = document.getElementById('submitRegisterBtn');

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        if (submitBtn) {
            submitBtn.addEventListener('click', handleSubmit);
        }
    };

    const handleSubmit = async (e) => {
        if (e.preventDefault) e.preventDefault();

        const form = document.getElementById('registrationForm');
        if (!form) return;

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const department = document.getElementById('department').value;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !department) {
            showMessage('message', 'Please fill in all required fields.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('message', 'Passwords do not match.', 'error');
            return;
        }

        if (password.length < 8) {
            showMessage('message', 'Password must be at least 8 characters long.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('message', 'Please enter a valid email address.', 'error');
            return;
        }

        const payload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            department: department
        };

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'HR registration successful.', 'success');
            form.reset();
        } catch (error) {
            console.error('Error registering HR:', error);
            showMessage('message', 'Failed to register HR account.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    HRRegister.init();
});
