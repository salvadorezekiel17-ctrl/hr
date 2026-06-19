// Team Leader For Validation Module
const TeamLeaderForValidation = (() => {
    const API_ENDPOINT = `${API_BASE}team-leader/for-validation`;

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
            console.error('Error loading validation requests:', error);
            showMessage('message', 'Failed to load validation requests.', 'error');
        }
    };

    const setupEventListeners = () => {
        const approveBtn = document.getElementById('approveValidationBtn');
        const rejectBtn = document.getElementById('rejectValidationBtn');
        const viewBtn = document.getElementById('viewValidationBtn');

        if (approveBtn) approveBtn.addEventListener('click', handleApprove);
        if (rejectBtn) rejectBtn.addEventListener('click', handleReject);
        if (viewBtn) viewBtn.addEventListener('click', handleView);
    };

    const displayData = (data) => {
        const container = document.getElementById('validationContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No items pending validation.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="validation-item" data-id="${item.id}">
                <h3>${escapeHtml(item.type || 'Validation Request')}</h3>
                <p><strong>Employee:</strong> ${escapeHtml(item.employeeName || 'N/A')}</p>
                <p><strong>Request Date:</strong> ${escapeHtml(item.requestDate || 'N/A')}</p>
                <p><strong>Description:</strong> ${escapeHtml(item.description || '')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Pending')}</span></p>
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

    const handleApprove = async (id) => {
        if (!id || !confirm('Are you sure you want to approve this request?')) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/approve`, 'POST', { status: 'approved' });
            showMessage('message', 'Request approved successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error approving request:', error);
            showMessage('message', 'Failed to approve request.', 'error');
        }
    };

    const handleReject = async (id) => {
        if (!id || !confirm('Are you sure you want to reject this request?')) return;

        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/reject`, 'POST', { status: 'rejected', reason: reason });
            showMessage('message', 'Request rejected successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error rejecting request:', error);
            showMessage('message', 'Failed to reject request.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayValidationDetails(data);
        } catch (error) {
            console.error('Error loading validation details:', error);
            showMessage('message', 'Failed to load validation details.', 'error');
        }
    };

    const displayValidationDetails = (data) => {
        const modalContent = document.getElementById('validationDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>Validation Request Details</h2>
                <p><strong>Type:</strong> ${escapeHtml(data.type || 'N/A')}</p>
                <p><strong>Employee:</strong> ${escapeHtml(data.employeeName || 'N/A')}</p>
                <p><strong>Request Date:</strong> ${escapeHtml(data.requestDate || 'N/A')}</p>
                <p><strong>Description:</strong> ${escapeHtml(data.description || '')}</p>
                <p><strong>Supporting Documents:</strong> ${escapeHtml(data.documents || 'None')}</p>
                <p><strong>Status:</strong> ${escapeHtml(data.status || 'N/A')}</p>
                ${data.comments ? `<p><strong>Comments:</strong> ${escapeHtml(data.comments)}</p>` : ''}
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
    TeamLeaderForValidation.init();
});
