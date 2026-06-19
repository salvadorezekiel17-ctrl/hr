// Employee Payslips Module
const PayslipsModule = (() => {
    const API_ENDPOINT = `${API_BASE}employee/payslips`;

    const init = () => {
        loadPayslips();
    };

    const loadPayslips = async () => {
        try {
            const employeeId = StorageManager.getEmployeeId();
            if (!employeeId) {
                showMessage('message', 'Employee not found. Please log in.', 'error');
                return;
            }

            const response = await apiCall(`${API_ENDPOINT}?employee_id=${employeeId}`);
            const payslips = response.data || [];

            displayPayslips(payslips);
        } catch (error) {
            console.error('Error loading payslips:', error);
            showMessage('message', 'Failed to load payslips.', 'error');
        }
    };

    const displayPayslips = (payslips) => {
        const tbody = document.querySelector('#payslipsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = payslips.map(payslip => `
            <tr>
                <td>${payslip.month || '-'}</td>
                <td>${payslip.year || '-'}</td>
                <td>${formatCurrency(payslip.basic_salary || 0)}</td>
                <td>${formatCurrency(payslip.deductions || 0)}</td>
                <td>${formatCurrency(payslip.net_salary || 0)}</td>
                <td>
                    <button class="btn-submit" data-id="${payslip.id}" onclick="event.preventDefault()">View</button>
                </td>
            </tr>
        `).join('');

        // Add view button listeners
        document.querySelectorAll('#payslipsTable button').forEach(btn => {
            btn.addEventListener('click', () => viewPayslip(btn.dataset.id));
        });
    };

    const viewPayslip = (payslipId) => {
        // Open PDF or detailed view modal
        window.open(`${API_BASE}payslips/${payslipId}/pdf`, '_blank');
    };

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    PayslipsModule.init();
});
