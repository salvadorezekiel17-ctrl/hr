// HR Payroll Management Module
const HRPayroll = (() => {
    const API_ENDPOINT = `${API_BASE}hr/payroll`;

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
            console.error('Error loading payroll:', error);
            showMessage('message', 'Failed to load payroll data.', 'error');
        }
    };

    const setupEventListeners = () => {
        const processBtn = document.getElementById('processPayrollBtn');
        const viewBtn = document.getElementById('viewPayrollBtn');
        const generateBtn = document.getElementById('generateSlipBtn');

        if (processBtn) processBtn.addEventListener('click', handleProcess);
        if (viewBtn) viewBtn.addEventListener('click', handleView);
        if (generateBtn) generateBtn.addEventListener('click', handleGenerateSlip);
    };

    const displayData = (data) => {
        const container = document.getElementById('payrollContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No payroll records found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="payroll-item" data-id="${item.id}">
                <h3>${escapeHtml(item.employeeName || 'Payroll Record')}</h3>
                <p><strong>Period:</strong> ${escapeHtml(item.paymentPeriod || 'N/A')}</p>
                <p><strong>Salary:</strong> ${escapeHtml(item.salary || '0')}</p>
                <p><strong>Deductions:</strong> ${escapeHtml(item.deductions || '0')}</p>
                <p><strong>Net Pay:</strong> ${escapeHtml(item.netPay || '0')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Pending')}</span></p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View Details</button>
                    <button class="slip-btn" data-id="${item.id}">Generate Slip</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleView(e.target.dataset.id));
        });
        document.querySelectorAll('.slip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleGenerateSlip(e.target.dataset.id));
        });
    };

    const handleProcess = async () => {
        const form = document.getElementById('payrollForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/process`, 'POST', payload);
            showMessage('message', 'Payroll processed successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error processing payroll:', error);
            showMessage('message', 'Failed to process payroll.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayPayrollDetails(data);
        } catch (error) {
            console.error('Error loading payroll details:', error);
            showMessage('message', 'Failed to load payroll details.', 'error');
        }
    };

    const handleGenerateSlip = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/slip`, 'GET');
            showMessage('message', 'Payroll slip generated successfully.', 'success');
        } catch (error) {
            console.error('Error generating slip:', error);
            showMessage('message', 'Failed to generate payroll slip.', 'error');
        }
    };

    const displayPayrollDetails = (data) => {
        const modalContent = document.getElementById('payrollDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>Payroll Details</h2>
                <p><strong>Employee:</strong> ${escapeHtml(data.employeeName || 'N/A')}</p>
                <p><strong>Period:</strong> ${escapeHtml(data.paymentPeriod || 'N/A')}</p>
                <p><strong>Basic Salary:</strong> ${escapeHtml(data.basicSalary || '0')}</p>
                <p><strong>Allowances:</strong> ${escapeHtml(data.allowances || '0')}</p>
                <p><strong>Deductions:</strong> ${escapeHtml(data.deductions || '0')}</p>
                <p><strong>Taxes:</strong> ${escapeHtml(data.taxes || '0')}</p>
                <p><strong>Net Pay:</strong> ${escapeHtml(data.netPay || '0')}</p>
                <p><strong>Status:</strong> ${escapeHtml(data.status || 'N/A')}</p>
                <button class="close-btn">Close</button>
            </div>
        `;

        modalContent.innerHTML = html;
        document.querySelector('.close-btn').addEventListener('click', () => {
            modalContent.style.display = 'none';
        });
        modalContent.style.display = 'block';
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    HRPayroll.init();
});
