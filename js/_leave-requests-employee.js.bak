// Employee Leave Requests Module
const EmployeeLeaveRequests = (() => {
    const API_ENDPOINT = `${API_BASE}employee/leave-requests`;

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
            console.error('Error loading leave requests:', error);
            showMessage('message', 'Failed to load leave requests.', 'error');
        }
    };

    const setupEventListeners = () => {
        const createBtn = document.getElementById('createLeaveBtn');
        const editBtn = document.getElementById('editLeaveBtn');
        const deleteBtn = document.getElementById('deleteLeaveBtn');

        if (createBtn) createBtn.addEventListener('click', handleCreate);
        if (editBtn) editBtn.addEventListener('click', handleEdit);
        if (deleteBtn) deleteBtn.addEventListener('click', handleDelete);
    };

    const displayData = (data) => {
        const container = document.getElementById('leaveRequestsContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No leave requests found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="leave-request-item" data-id="${item.id}">
                <h3>${escapeHtml(item.type || 'Leave Request')}</h3>
                <p><strong>Start Date:</strong> ${escapeHtml(item.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(item.endDate || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Pending')}</span></p>
                <p><strong>Reason:</strong> ${escapeHtml(item.reason || '')}</p>
                <div class="actions">
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEdit(e.target.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDelete(e.target.dataset.id));
        });
    };

    const handleCreate = async () => {
        const form = document.getElementById('leaveRequestForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Leave request created successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error creating leave request:', error);
            showMessage('message', 'Failed to create leave request.', 'error');
        }
    };

    const handleEdit = async (id) => {
        if (!id) return;
        const item = document.querySelector(`[data-id="${id}"]`);
        if (!item) return;

        const form = document.getElementById('leaveRequestForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`, 'PUT', payload);
            showMessage('message', 'Leave request updated successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error updating leave request:', error);
            showMessage('message', 'Failed to update leave request.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!id || !confirm('Are you sure you want to delete this leave request?')) return;

        try {
            await apiCall(`${API_ENDPOINT}/${id}`, 'DELETE');
            showMessage('message', 'Leave request deleted successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error deleting leave request:', error);
            showMessage('message', 'Failed to delete leave request.', 'error');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    EmployeeLeaveRequests.init();
});
