// Employee Deployment History Module
const EmployeeDeploymentHistory = (() => {
    const API_ENDPOINT = `${API_BASE}employee/deployment-history`;

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
            console.error('Error loading deployment history:', error);
            showMessage('message', 'Failed to load deployment history.', 'error');
        }
    };

    const setupEventListeners = () => {
        const viewBtn = document.getElementById('viewDeploymentBtn');
        if (viewBtn) viewBtn.addEventListener('click', handleView);
    };

    const displayData = (data) => {
        const container = document.getElementById('deploymentHistoryContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No deployment history found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="deployment-history-item" data-id="${item.id}">
                <h3>${escapeHtml(item.location || 'Deployment')}</h3>
                <p><strong>Position:</strong> ${escapeHtml(item.position || 'N/A')}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(item.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(item.endDate || 'N/A')}</p>
                <p><strong>Company:</strong> ${escapeHtml(item.company || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Active')}</span></p>
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

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayDeploymentDetails(data);
        } catch (error) {
            console.error('Error loading deployment details:', error);
            showMessage('message', 'Failed to load deployment details.', 'error');
        }
    };

    const displayDeploymentDetails = (data) => {
        const modalContent = document.getElementById('deploymentDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>${escapeHtml(data.location || 'Deployment Details')}</h2>
                <p><strong>Position:</strong> ${escapeHtml(data.position || 'N/A')}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(data.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(data.endDate || 'N/A')}</p>
                <p><strong>Company:</strong> ${escapeHtml(data.company || 'N/A')}</p>
                <p><strong>Department:</strong> ${escapeHtml(data.department || 'N/A')}</p>
                <p><strong>Supervisor:</strong> ${escapeHtml(data.supervisor || 'N/A')}</p>
                <p><strong>Status:</strong> ${escapeHtml(data.status || 'N/A')}</p>
                <p><strong>Notes:</strong> ${escapeHtml(data.notes || '')}</p>
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
    EmployeeDeploymentHistory.init();
});
