// Coordinator Active Deployments Module
const CoordinatorActiveDeployments = (() => {
    const API_ENDPOINT = `${API_BASE}coordinator/active-deployments`;

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
            console.error('Error loading active deployments:', error);
            showMessage('message', 'Failed to load active deployments.', 'error');
        }
    };

    const setupEventListeners = () => {
        const createBtn = document.getElementById('createDeploymentBtn');
        const editBtn = document.getElementById('editDeploymentBtn');
        const endBtn = document.getElementById('endDeploymentBtn');

        if (createBtn) createBtn.addEventListener('click', handleCreate);
        if (editBtn) editBtn.addEventListener('click', handleEdit);
        if (endBtn) endBtn.addEventListener('click', handleEnd);
    };

    const displayData = (data) => {
        const container = document.getElementById('activeDeploymentsContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No active deployments found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="deployment-item" data-id="${item.id}">
                <h3>${escapeHtml(item.employeeName || 'Deployment')}</h3>
                <p><strong>Location:</strong> ${escapeHtml(item.location || 'N/A')}</p>
                <p><strong>Position:</strong> ${escapeHtml(item.position || 'N/A')}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(item.startDate || 'N/A')}</p>
                <p><strong>Client:</strong> ${escapeHtml(item.client || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Active')}</span></p>
                <div class="actions">
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="end-btn" data-id="${item.id}">End Deployment</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEdit(e.target.dataset.id));
        });
        document.querySelectorAll('.end-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEnd(e.target.dataset.id));
        });
    };

    const handleCreate = async () => {
        const form = document.getElementById('deploymentForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Deployment created successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error creating deployment:', error);
            showMessage('message', 'Failed to create deployment.', 'error');
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
            showMessage('message', 'Deployment updated successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error updating deployment:', error);
            showMessage('message', 'Failed to update deployment.', 'error');
        }
    };

    const handleEnd = async (id) => {
        if (!id || !confirm('Are you sure you want to end this deployment?')) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/end`, 'POST');
            showMessage('message', 'Deployment ended successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error ending deployment:', error);
            showMessage('message', 'Failed to end deployment.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    CoordinatorActiveDeployments.init();
});
