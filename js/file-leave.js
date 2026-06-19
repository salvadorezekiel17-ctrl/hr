// Team Leader File Leave Module
const TeamLeaderFileLease = (() => {
    const API_ENDPOINT = `${API_BASE}team-leader/file-leave`;

    const init = () => {
        setupEventListeners();
    };

    const setupEventListeners = () => {
        const form = document.getElementById('fileLeaveForm');
        const submitBtn = document.getElementById('submitLeaveBtn');

        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        if (submitBtn) {
            submitBtn.addEventListener('click', handleSubmit);
        }
    };

    const handleSubmit = async (e) => {
        if (e.preventDefault) e.preventDefault();

        const form = document.getElementById('fileLeaveForm');
        if (!form) return;

        const leaveType = document.getElementById('leaveType').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const reason = document.getElementById('reason').value;

        if (!leaveType || !startDate || !endDate) {
            showMessage('message', 'Please fill in all required fields.', 'error');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            showMessage('message', 'Start date must be before end date.', 'error');
            return;
        }

        const payload = {
            leaveType: leaveType,
            startDate: startDate,
            endDate: endDate,
            reason: reason
        };

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Leave request filed successfully.', 'success');
            form.reset();
        } catch (error) {
            console.error('Error filing leave:', error);
            showMessage('message', 'Failed to file leave request.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    TeamLeaderFileLease.init();
});
