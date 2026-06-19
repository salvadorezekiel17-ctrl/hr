// HR Create Account Module
const HRCreateAccount = (() => {
    const API_ENDPOINT = `${API_BASE}hr/accounts`;

    const init = () => {
        setupEventListeners();
    };

    const setupEventListeners = () => {
        const form = document.getElementById('createAccountForm');
        const submitBtn = document.getElementById('submitAccountBtn');

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        if (submitBtn) {
            submitBtn.addEventListener('click', handleSubmit);
        }
    };

    const handleSubmit = async (e) => {
        if (e.preventDefault) e.preventDefault();

        const form = document.getElementById('createAccountForm');
        if (!form) return;

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const position = document.getElementById('position').value;
        const department = document.getElementById('department').value;
        const role = document.getElementById('role').value;

        if (!firstName || !lastName || !email || !phone || !position || !department || !role) {
            showMessage('message', 'Please fill in all required fields.', 'error');
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
            phone: phone,
            position: position,
            department: department,
            role: role
        };

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Account created successfully.', 'success');
            form.reset();
        } catch (error) {
            console.error('Error creating account:', error);
            showMessage('message', 'Failed to create account.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    HRCreateAccount.init();
});
