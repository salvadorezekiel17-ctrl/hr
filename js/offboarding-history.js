// HR Offboarding History Module
const HROffboardingHistory = (() => {
    const API_ENDPOINT = `${API_BASE}hr/offboarding-history`;

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
            console.error('Error loading offboarding history:', error);
            showMessage('message', 'Failed to load offboarding history.', 'error');
        }
    };

    const setupEventListeners = () => {
        const filterBtn = document.getElementById('filterOffboardingBtn');
        const viewBtn = document.getElementById('viewOffboardingBtn');

        if (filterBtn) filterBtn.addEventListener('click', handleFilter);
        if (viewBtn) viewBtn.addEventListener('click', handleView);
    };

    const displayData = (data) => {
        const container = document.getElementById('offboardingHistoryContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No offboarding records found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="offboarding-item" data-id="${item.id}">
                <h3>${escapeHtml(item.employeeName || 'Offboarding Record')}</h3>
                <p><strong>Position:</strong> ${escapeHtml(item.position || 'N/A')}</p>
                <p><strong>Offboard Date:</strong> ${escapeHtml(item.offboardDate || 'N/A')}</p>
                <p><strong>Reason:</strong> ${escapeHtml(item.reason || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Pending')}</span></p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View Details</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleView(e.target.dataset.id));
        });
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
            console.error('Error filtering offboarding records:', error);
            showMessage('message', 'Failed to filter offboarding records.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayOffboardingDetails(data);
        } catch (error) {
            console.error('Error loading offboarding details:', error);
            showMessage('message', 'Failed to load offboarding details.', 'error');
        }
    };

    const displayOffboardingDetails = (data) => {
        const modalContent = document.getElementById('offboardingDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>Offboarding Details</h2>
                <p><strong>Employee:</strong> ${escapeHtml(data.employeeName || 'N/A')}</p>
                <p><strong>Position:</strong> ${escapeHtml(data.position || 'N/A')}</p>
                <p><strong>Department:</strong> ${escapeHtml(data.department || 'N/A')}</p>
                <p><strong>Offboard Date:</strong> ${escapeHtml(data.offboardDate || 'N/A')}</p>
                <p><strong>Reason:</strong> ${escapeHtml(data.reason || 'N/A')}</p>
                <p><strong>Final Salary:</strong> ${escapeHtml(data.finalSalary || '0')}</p>
                <p><strong>Assets Returned:</strong> ${escapeHtml(data.assetsReturned || 'No')}</p>
                <p><strong>Exit Interview:</strong> ${escapeHtml(data.exitInterview || 'Pending')}</p>
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
    HROffboardingHistory.init();
});
