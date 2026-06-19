// Leave Requests Module (works for both Employee and HR)
const LeaveRequestsModule = (() => {
    const userRole = StorageManager.getUserRole();
    const isHR = userRole === 'HR' || userRole === 'hr';
    const API_ENDPOINT = `${API_BASE}${isHR ? 'hr' : 'employee'}/leave-requests`;

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
        if (isHR) {
            const approveBtn = document.getElementById('approveLeaveBtn');
            const rejectBtn = document.getElementById('rejectLeaveBtn');
            const viewBtn = document.getElementById('viewLeaveBtn');

            if (approveBtn) approveBtn.addEventListener('click', handleApprove);
            if (rejectBtn) rejectBtn.addEventListener('click', handleReject);
            if (viewBtn) viewBtn.addEventListener('click', handleView);
        } else {
            const createBtn = document.getElementById('createLeaveBtn');
            const editBtn = document.getElementById('editLeaveBtn');
            const deleteBtn = document.getElementById('deleteLeaveBtn');

            if (createBtn) createBtn.addEventListener('click', handleCreate);
            if (editBtn) editBtn.addEventListener('click', handleEdit);
            if (deleteBtn) deleteBtn.addEventListener('click', handleDelete);
        }
    };

    const displayData = (data) => {
        const container = document.getElementById('leaveRequestsContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No leave requests found.</p>';
            return;
        }

        if (isHR) {
            displayHRData(data, container);
        } else {
            displayEmployeeData(data, container);
        }
    };

    const displayEmployeeData = (data, container) => {
        const html = data.map(item => `
            <div class="leave-request-item" data-id="${item.id}">
                <h3>${escapeHtml(item.type || 'Leave Request')}</h3>
                <p><strong>Start Date:</strong> ${escapeHtml(item.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(item.endDate || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status-${item.status?.toLowerCase()}">${escapeHtml(item.status || 'Pending')}</span></p>
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

    const displayHRData = (data, container) => {
        const html = data.map(item => `
            <div class="leave-request-item" data-id="${item.id}">
                <h3>${escapeHtml(item.employeeName || 'Leave Request')}</h3>
                <p><strong>Type:</strong> ${escapeHtml(item.type || 'N/A')}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(item.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(item.endDate || 'N/A')}</p>
                <p><strong>Reason:</strong> ${escapeHtml(item.reason || '')}</p>
                <p><strong>Status:</strong> <span class="status-${item.status?.toLowerCase()}">${escapeHtml(item.status || 'Pending')}</span></p>
                <div class="actions">
                    ${item.status === 'Pending' ? `
                        <button class="approve-btn" data-id="${item.id}">Approve</button>
                        <button class="reject-btn" data-id="${item.id}">Reject</button>
                    ` : ''}
                    <button class="view-btn" data-id="${item.id}">View</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleApprove(e.target.dataset.id));
        });
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleReject(e.target.dataset.id));
        });
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleView(e.target.dataset.id));
        });
    };

    // Employee handlers
    const handleCreate = async () => {
        const form = document.getElementById('leaveRequestForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(API_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) });
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
        const form = document.getElementById('leaveRequestForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
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
            await apiCall(`${API_ENDPOINT}/${id}`, { method: 'DELETE' });
            showMessage('message', 'Leave request deleted successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error deleting leave request:', error);
            showMessage('message', 'Failed to delete leave request.', 'error');
        }
    };

    // HR handlers
    const handleApprove = async (id) => {
        if (!id || !confirm('Are you sure you want to approve this leave request?')) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/approve`, {
                method: 'POST',
                body: JSON.stringify({ status: 'approved' })
            });
            showMessage('message', 'Leave request approved successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error approving leave request:', error);
            showMessage('message', 'Failed to approve leave request.', 'error');
        }
    };

    const handleReject = async (id) => {
        if (!id || !confirm('Are you sure you want to reject this leave request?')) return;

        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/reject`, {
                method: 'POST',
                body: JSON.stringify({ status: 'rejected', reason: reason })
            });
            showMessage('message', 'Leave request rejected successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error rejecting leave request:', error);
            showMessage('message', 'Failed to reject leave request.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayLeaveDetails(data);
        } catch (error) {
            console.error('Error loading leave details:', error);
            showMessage('message', 'Failed to load leave details.', 'error');
        }
    };

    const displayLeaveDetails = (data) => {
        const modalContent = document.getElementById('leaveDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>Leave Request Details</h2>
                <p><strong>Employee:</strong> ${escapeHtml(data.employeeName || 'N/A')}</p>
                <p><strong>Type:</strong> ${escapeHtml(data.type || 'N/A')}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(data.startDate || 'N/A')}</p>
                <p><strong>End Date:</strong> ${escapeHtml(data.endDate || 'N/A')}</p>
                <p><strong>Total Days:</strong> ${escapeHtml(data.totalDays || '0')}</p>
                <p><strong>Reason:</strong> ${escapeHtml(data.reason || '')}</p>
                <p><strong>Status:</strong> ${escapeHtml(data.status || 'N/A')}</p>
                ${data.approvedBy ? `<p><strong>Approved By:</strong> ${escapeHtml(data.approvedBy || '')}</p>` : ''}
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
    LeaveRequestsModule.init();
});
