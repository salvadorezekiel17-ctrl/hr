// HR Leave Requests - Load Data
const HRLeaveRequests = (() => {
    // Direct API URL – no double path
    const API_URL = '/hrms/backend/api/get_leave_requests.php';

    const init = () => {
        loadData();
    };

    const loadData = async () => {
        const tbody = document.getElementById('leaveContainer');
        if (!tbody) return;

        try {
            const response = await fetch(API_URL, {
                credentials: 'include'
            });
            const data = await response.json();

            if (!data.success) throw new Error(data.message);

            const leaves = data.data || [];

            if (leaves.length === 0) {
                tbody.innerHTML = '<p style="text-align:center; padding:2rem;">No leave requests found.</p>';
                return;
            }

            let html = '<table><thead><tr>';
            html += '<th>ID</th><th>Name</th><th>Employee ID</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th><th>Actions</th>';
            html += '</tr></thead><tbody>';

            for (let req of leaves) {
                let statusClass = `status-${req.status}`;
                let statusText = req.status.charAt(0).toUpperCase() + req.status.slice(1);
                let actions = '';

                if (req.status === 'pending') {
                    actions = `<button class="btn-review" data-id="${req.id}">Review</button>`;
                } else {
                    actions = `<span>—</span>`;
                }

                html += `<tr>
                    <td>${escapeHtml(req.id)}</td>
                    <td>${escapeHtml(req.employee_name || '-')}</td>
                    <td>${escapeHtml(req.employee_id)}</td>
                    <td>${escapeHtml(req.type)}</td>
                    <td>${escapeHtml(req.start_date)}</td>
                    <td>${escapeHtml(req.end_date)}</td>
                    <td>${escapeHtml(req.reason || '-')}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td>${actions}</td>
                </tr>`;
            }

            html += '</tbody></table>';
            tbody.innerHTML = html;

            // Attach review button events
            document.querySelectorAll('.btn-review').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    openReviewModal(id);
                });
            });

        } catch (error) {
            console.error('Error loading leave requests:', error);
            tbody.innerHTML = '<p style="text-align:center; padding:2rem; color:red;">Error loading leave requests. Please try again.</p>';
        }
    };

    // ---- Review Modal ----
    let currentLeaveId = null;

    const openReviewModal = async (id) => {
        currentLeaveId = id;
        try {
            const response = await fetch(API_URL, {
                credentials: 'include'
            });
            const data = await response.json();
            const leave = data.data.find(l => l.id == id);

            if (!leave) {
                alert('Leave request not found.');
                return;
            }

            const modalContent = document.getElementById('modalDetails');
            if (!modalContent) return;

            modalContent.innerHTML = `
                <p><strong>Name:</strong> ${escapeHtml(leave.employee_name || '-')}</p>
                <p><strong>Employee ID:</strong> ${escapeHtml(leave.employee_id)}</p>
                <p><strong>Type:</strong> ${escapeHtml(leave.type)}</p>
                <p><strong>Start Date:</strong> ${escapeHtml(leave.start_date)}</p>
                <p><strong>End Date:</strong> ${escapeHtml(leave.end_date)}</p>
                <p><strong>Reason:</strong> ${escapeHtml(leave.reason || '-')}</p>
                <p><strong>Submitted:</strong> ${escapeHtml(leave.created_at || '-')}</p>
            `;

            document.getElementById('reviewModal').style.display = 'flex';

        } catch (error) {
            alert('Error loading leave details.');
        }
    };

    const closeModal = () => {
        document.getElementById('reviewModal').style.display = 'none';
        currentLeaveId = null;
    };

    const updateStatus = async (status) => {
        if (!currentLeaveId) return;

        try {
            const res = await fetch('/hrms/backend/api/update_leave_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: currentLeaveId, status: status })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Leave request ${status}`);
                closeModal();
                loadData();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (e) {
            alert('Request failed: ' + e.message);
        }
    };

    // ---- Set up modal buttons (if they exist in HTML) ----
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
            document.getElementById('modalApproveBtn')?.addEventListener('click', () => updateStatus('approved'));
            document.getElementById('modalRejectBtn')?.addEventListener('click', () => updateStatus('rejected'));
        }
    });

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        str = String(str);
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', function() {
    HRLeaveRequests.init();
});