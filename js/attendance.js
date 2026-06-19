// Employee Attendance Module
const AttendanceModule = (() => {
    const API_ENDPOINT = `${API_BASE}employee/attendance`;

    const init = () => {
        loadAttendanceData();
    };

    const loadAttendanceData = async () => {
        try {
            const employeeId = StorageManager.getEmployeeId();
            if (!employeeId) {
                showMessage('message', 'Employee not found. Please log in.', 'error');
                return;
            }

            const response = await apiCall(`${API_ENDPOINT}?employee_id=${employeeId}`);
            const attendance = response.data || [];

            displayAttendanceTable(attendance);
        } catch (error) {
            console.error('Error loading attendance:', error);
            showMessage('message', 'Failed to load attendance data.', 'error');
        }
    };

    const displayAttendanceTable = (attendance) => {
        const tbody = document.querySelector('#attendanceTable tbody');
        if (!tbody) return;

        if (attendance.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-message">No attendance records found.</td></tr>';
            return;
        }

        tbody.innerHTML = attendance.map(record => {
            const status = record.status?.toLowerCase() || 'absent';
            const statusLabel = record.status || 'Absent';
            return `
            <tr>
                <td>${record.date || '-'}</td>
                <td>${record.time_in || '-'}</td>
                <td>${record.time_out || '-'}</td>
                <td><span class="status-badge status-${status}">${statusLabel}</span></td>
            </tr>
        `;
        }).join('');
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    AttendanceModule.init();
});
