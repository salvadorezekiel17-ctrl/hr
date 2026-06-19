// HR Biometric Logs Module - FINAL FIX (auto-detects tbody)
const HRBiometricLogs = (() => {
    const API_ENDPOINT = 'get_attendance.php';

    function showMessage(msg, type) {
        const container = document.getElementById('message');
        if (container) {
            container.textContent = msg;
            container.className = type || 'info';
        } else {
            alert(msg);
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            if (m === '"') return '&quot;';
            return m;
        });
    }

    function formatTimestamp(ts) {
        if (!ts) return 'N/A';
        try {
            const d = new Date(ts);
            return d.toLocaleString();
        } catch {
            return ts;
        }
    }

    // --- Get the tbody element (tries multiple IDs) ---
    function getTbody() {
        const possibleIds = ['biometricTableBody', 'logsTableBody', 'attendanceTableBody', 'tableBody'];
        for (let id of possibleIds) {
            const el = document.getElementById(id);
            if (el) {
                console.log(`Found tbody with ID: ${id}`);
                return el;
            }
        }
        // If none found, try to find any tbody inside the table
        const table = document.querySelector('table');
        if (table) {
            const tbody = table.querySelector('tbody');
            if (tbody) {
                console.log('Found tbody by table query');
                return tbody;
            }
        }
        return null;
    }

    const init = () => {
        loadData();
        setupEventListeners();
    };

    const loadData = async () => {
        const tbody = getTbody();
        if (!tbody) {
            console.error('No tbody found! Check your HTML.');
            // Show a message on the page somewhere
            const container = document.querySelector('.panel') || document.body;
            container.innerHTML += '<p style="color:red;">Table body not found – please check HTML.</p>';
            return;
        }

        try {
            const response = await apiCall(API_ENDPOINT);
            console.log('API Response:', response);

            let data = [];
            if (response.data && Array.isArray(response.data)) {
                data = response.data;
            } else if (Array.isArray(response)) {
                data = response;
            }

            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:20px;">No attendance records found.</td></tr>';
                return;
            }

            displayData(data, tbody);
        } catch (error) {
            console.error('Error loading biometric logs:', error);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red;padding:20px;">Error loading data</td></tr>';
            showMessage('Failed to load biometric logs.', 'error');
        }
    };

    const displayData = (data, tbody) => {
        if (!tbody) tbody = getTbody();
        if (!tbody) return;

        let html = '';
        for (let log of data) {
            const employee = log.employeeName || log.employee || log.name || log.employee_name || 'N/A';
            const timestamp = log.timestamp || log.logDate || log.date || log.datetime || log.time || 'N/A';
            const method = log.verificationMethod || log.method || log.verification || log.type || 'N/A';
            const status = log.status || log.attendance_status || log.attendance || 'Present';
            const id = log.id || log.employee_id || log.log_id || '';

            html += `
                <tr>
                    <td>${escapeHtml(employee)}</td>
                    <td>${escapeHtml(formatTimestamp(timestamp))}</td>
                    <td>${escapeHtml(method)}</td>
                    <td><span class="status-badge status-${escapeHtml(status).toLowerCase()}">${escapeHtml(status)}</span></td>
                    <td>
                        <button class="btn-view" data-id="${escapeHtml(id)}">View</button>
                        <button class="btn-adjust" data-id="${escapeHtml(id)}">Adjust</button>
                    </td>
                </tr>
            `;
        }
        tbody.innerHTML = html;
    };

    const setupEventListeners = () => {
        const filterBtn = document.getElementById('filterLogsBtn');
        const exportBtn = document.getElementById('exportLogsBtn');

        if (filterBtn) filterBtn.addEventListener('click', handleFilter);
        if (exportBtn) exportBtn.addEventListener('click', handleExport);
    };

    const handleFilter = async () => {
        const filterForm = document.getElementById('filterForm');
        if (!filterForm) return;

        const formData = new FormData(filterForm);
        const filters = Object.fromEntries(formData);

        try {
            const queryString = new URLSearchParams(filters).toString();
            const url = queryString ? `${API_ENDPOINT}?${queryString}` : API_ENDPOINT;
            const response = await apiCall(url);
            let data = [];
            if (response.data && Array.isArray(response.data)) data = response.data;
            else if (Array.isArray(response)) data = response;
            const tbody = getTbody();
            if (tbody) displayData(data, tbody);
        } catch (error) {
            console.error('Error filtering logs:', error);
            showMessage('Failed to filter logs.', 'error');
        }
    };

    const handleExport = async () => {
        const filterForm = document.getElementById('filterForm');
        const filters = filterForm ? Object.fromEntries(new FormData(filterForm)) : {};

        try {
            const queryString = new URLSearchParams(filters).toString();
            const url = `${API_ENDPOINT}/export${queryString ? '?' + queryString : ''}`;
            await apiCall(url);
            showMessage('Logs exported successfully.', 'success');
        } catch (error) {
            console.error('Error exporting logs:', error);
            showMessage('Failed to export logs.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    HRBiometricLogs.init();
});