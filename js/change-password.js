// Change Password Module
const ChangePassword = (() => {
    const API_ENDPOINT = `${API_BASE}auth/change-password`;

    const init = () => {
        setupEventListeners();
    };

    const setupEventListeners = () => {
        const form = document.getElementById('changePasswordForm');
        const submitBtn = document.getElementById('submitPasswordBtn');

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        if (submitBtn) {
            submitBtn.addEventListener('click', handleSubmit);
        }
    };

    const handleSubmit = async (e) => {
        if (e.preventDefault) e.preventDefault();

        const form = document.getElementById('changePasswordForm');
        if (!form) return;

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage('message', 'Please fill in all password fields.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('message', 'New passwords do not match.', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showMessage('message', 'New password must be at least 8 characters long.', 'error');
            return;
        }

        const payload = {
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Password changed successfully.', 'success');
            form.reset();
        } catch (error) {
            console.error('Error changing password:', error);
            showMessage('message', 'Failed to change password. Please check your current password.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    ChangePassword.init();
});
