// Team Leader Attendance History Module
const TeamLeaderAttendanceHistory = (() => {
    const API_ENDPOINT = `${API_BASE}team-leader/attendance-history`;

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
            console.error('Error loading attendance history:', error);
            showMessage('message', 'Failed to load attendance history.', 'error');
        }
    };

    const setupEventListeners = () => {
        const filterBtn = document.getElementById('filterAttendanceBtn');
        const exportBtn = document.getElementById('exportAttendanceBtn');

        if (filterBtn) filterBtn.addEventListener('click', handleFilter);
        if (exportBtn) exportBtn.addEventListener('click', handleExport);
    };

    const displayData = (data) => {
        const tbody = document.getElementById('attBody');
        if (!tbody) return;

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No attendance records found.</td></tr>';
            return;
        }

        const html = data.map(item => `
            <tr data-id="${item.id}">
                <td>${escapeHtml(formatDate(item.attendanceDate || ''))}</td>
                <td>${escapeHtml(formatTime(item.timeIn || ''))}</td>
                <td>${escapeHtml(formatTime(item.timeOut || ''))}</td>
                <td><span class="${getStatusClass(item.status || 'Present')}">${escapeHtml(item.status || 'Present')}</span></td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
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
            console.error('Error filtering attendance:', error);
            showMessage('message', 'Failed to filter attendance records.', 'error');
        }
    };

    const handleExport = async () => {
        const filterForm = document.getElementById('filterForm');
        const filters = filterForm ? Object.fromEntries(new FormData(filterForm)) : {};

        try {
            const queryString = new URLSearchParams(filters).toString();
            const response = await apiCall(`${API_ENDPOINT}/export?${queryString}`);
            showMessage('message', 'Attendance records exported successfully.', 'success');
        } catch (error) {
            console.error('Error exporting attendance:', error);
            showMessage('message', 'Failed to export attendance records.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    TeamLeaderAttendanceHistory.init();
});
