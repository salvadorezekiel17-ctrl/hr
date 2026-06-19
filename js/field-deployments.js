// HR Field Deployments Module
const HRFieldDeployments = (() => {
    const API_ENDPOINT = `${API_BASE}hr/field-deployments`;

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
            console.error('Error loading field deployments:', error);
            showMessage('message', 'Failed to load field deployments.', 'error');
        }
    };

    const setupEventListeners = () => {
        const createBtn = document.getElementById('createDeploymentBtn');
        const editBtn = document.getElementById('editDeploymentBtn');
        const viewBtn = document.getElementById('viewDeploymentBtn');

        if (createBtn) createBtn.addEventListener('click', handleCreate);
        if (editBtn) editBtn.addEventListener('click', handleEdit);
        if (viewBtn) viewBtn.addEventListener('click', handleView);
    };

    const displayData = (data) => {
        const container = document.getElementById('fieldDeploymentsContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No field deployments found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="deployment-item" data-id="${item.id}">
                <h3>${escapeHtml(item.employeeName || 'Deployment')}</h3>
                <p><strong>Location:</strong> ${escapeHtml(item.location || 'N/A')}</p>
                <p><strong>Project:</strong> ${escapeHtml(item.project || 'N/A')}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(item.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(item.endDate || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Active')}</span></p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View</button>
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleView(e.target.dataset.id));
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEdit(e.target.dataset.id));
        });
    };

    const handleCreate = async () => {
        const form = document.getElementById('deploymentForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Field deployment created successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error creating deployment:', error);
            showMessage('message', 'Failed to create field deployment.', 'error');
        }
    };

    const handleEdit = async (id) => {
        if (!id) return;

        const form = document.getElementById('deploymentForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`, 'PUT', payload);
            showMessage('message', 'Field deployment updated successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error updating deployment:', error);
            showMessage('message', 'Failed to update field deployment.', 'error');
        }
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
                <h2>Field Deployment Details</h2>
                <p><strong>Employee:</strong> ${escapeHtml(data.employeeName || 'N/A')}</p>
                <p><strong>Location:</strong> ${escapeHtml(data.location || 'N/A')}</p>
                <p><strong>Project:</strong> ${escapeHtml(data.project || 'N/A')}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(data.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(data.endDate || 'N/A')}</p>
                <p><strong>Department:</strong> ${escapeHtml(data.department || 'N/A')}</p>
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
    HRFieldDeployments.init();
});
