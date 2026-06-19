// Coordinator Completed Job Orders Module
const CoordinatorCompletedJobOrders = (() => {
    const API_ENDPOINT = `${API_BASE}coordinator/completed-job-orders`;

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
            console.error('Error loading completed job orders:', error);
            showMessage('message', 'Failed to load completed job orders.', 'error');
        }
    };

    const setupEventListeners = () => {
        const viewBtn = document.getElementById('viewJobOrderBtn');
        const archiveBtn = document.getElementById('archiveJobOrderBtn');

        if (viewBtn) viewBtn.addEventListener('click', handleView);
        if (archiveBtn) archiveBtn.addEventListener('click', handleArchive);
    };

    const displayData = (data) => {
        const container = document.getElementById('completedJobOrdersContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No completed job orders found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="job-order-item" data-id="${item.id}">
                <h3>${escapeHtml(item.jobTitle || 'Job Order')}</h3>
                <p><strong>Order ID:</strong> ${escapeHtml(item.orderId || 'N/A')}</p>
                <p><strong>Client:</strong> ${escapeHtml(item.client || 'N/A')}</p>
                <p><strong>Completion Date:</strong> ${escapeHtml(item.completionDate || 'N/A')}</p>
                <p><strong>Filled Positions:</strong> ${escapeHtml(item.filledPositions || '0')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Completed')}</span></p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View</button>
                    <button class="archive-btn" data-id="${item.id}">Archive</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleView(e.target.dataset.id));
        });
        document.querySelectorAll('.archive-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleArchive(e.target.dataset.id));
        });
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayJobOrderDetails(data);
        } catch (error) {
            console.error('Error loading job order details:', error);
            showMessage('message', 'Failed to load job order details.', 'error');
        }
    };

    const handleArchive = async (id) => {
        if (!id || !confirm('Are you sure you want to archive this job order?')) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/archive`, 'POST');
            showMessage('message', 'Job order archived successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error archiving job order:', error);
            showMessage('message', 'Failed to archive job order.', 'error');
        }
    };

    const displayJobOrderDetails = (data) => {
        const modalContent = document.getElementById('jobOrderDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>${escapeHtml(data.jobTitle || 'Job Order Details')}</h2>
                <p><strong>Order ID:</strong> ${escapeHtml(data.orderId || 'N/A')}</p>
                <p><strong>Client:</strong> ${escapeHtml(data.client || 'N/A')}</p>
                <p><strong>Job Description:</strong> ${escapeHtml(data.description || 'N/A')}</p>
                <p><strong>Completion Date:</strong> ${escapeHtml(data.completionDate || 'N/A')}</p>
                <p><strong>Filled Positions:</strong> ${escapeHtml(data.filledPositions || '0')}</p>
                <p><strong>Total Positions:</strong> ${escapeHtml(data.totalPositions || '0')}</p>
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
    CoordinatorCompletedJobOrders.init();
});
