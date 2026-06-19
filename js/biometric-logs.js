// HR Biometric Logs Module
const HRBiometricLogs = (() => {
    const API_ENDPOINT = `${API_BASE}hr/biometric-logs`;

    const init = () => {
        loadData();
        setupEventListeners();
    };

    const loadData = async () => {
        try {
            const response = await apiCall(API_ENDPOINT);
            const data = response.data || [];
            displayData(data);
        } catch (error) {
            console.error('Error loading biometric logs:', error);
            showMessage('message', 'Failed to load biometric logs.', 'error');
        }
    };

    const setupEventListeners = () => {
        const filterBtn = document.getElementById('filterLogsBtn');
        const exportBtn = document.getElementById('exportLogsBtn');

        if (filterBtn) filterBtn.addEventListener('click', handleFilter);
        if (exportBtn) exportBtn.addEventListener('click', handleExport);
    };

    const displayData = (data) => {
        const container = document.getElementById('biometricLogsContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No biometric logs found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="log-item" data-id="${item.id}">
                <p><strong>Employee:</strong> ${escapeHtml(item.employeeName || 'N/A')}</p>
                <p><strong>Date:</strong> ${escapeHtml(item.logDate || 'N/A')}</p>
                <p><strong>Time In:</strong> ${escapeHtml(item.timeIn || 'N/A')}</p>
                <p><strong>Time Out:</strong> ${escapeHtml(item.timeOut || 'N/A')}</p>
                <p><strong>Hours Worked:</strong> ${escapeHtml(item.hoursWorked || '0')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Present')}</span></p>
            </div>
        `).join('');

        container.innerHTML = html;
    };

    const handleFilter = async () => {
        const filterForm = document.getElementById('filterForm');
        if (!filterForm) return;

        const formData = new FormData(filterForm);
        const filters = Object.fromEntries(formData);

        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await apiCall(`${API_ENDPOINT}?${queryString}`);
            const data = response.data || [];
            displayData(data);
        } catch (error) {
            console.error('Error filtering logs:', error);
            showMessage('message', 'Failed to filter biometric logs.', 'error');
        }
    };

    const handleExport = async () => {
        const filterForm = document.getElementById('filterForm');
        const filters = filterForm ? Object.fromEntries(new FormData(filterForm)) : {};

        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await apiCall(`${API_ENDPOINT}/export?${queryString}`);
            showMessage('message', 'Biometric logs exported successfully.', 'success');
        } catch (error) {
            console.error('Error exporting logs:', error);
            showMessage('message', 'Failed to export biometric logs.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    HRBiometricLogs.init();
});
