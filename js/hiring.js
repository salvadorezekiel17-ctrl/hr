// HR Hiring & Job Postings Module
const HRHiring = (() => {
    const API_ENDPOINT = `${API_BASE}hr/hiring`;

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
            console.error('Error loading job postings:', error);
            showMessage('message', 'Failed to load job postings.', 'error');
        }
    };

    const setupEventListeners = () => {
        const createBtn = document.getElementById('createJobBtn');
        const editBtn = document.getElementById('editJobBtn');
        const closeBtn = document.getElementById('closeJobBtn');
        const viewBtn = document.getElementById('viewJobBtn');

        if (createBtn) createBtn.addEventListener('click', handleCreate);
        if (editBtn) editBtn.addEventListener('click', handleEdit);
        if (closeBtn) closeBtn.addEventListener('click', handleClose);
        if (viewBtn) viewBtn.addEventListener('click', handleView);
    };

    const displayData = (data) => {
        const container = document.getElementById('hiringContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No job postings found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="job-posting-item" data-id="${item.id}">
                <h3>${escapeHtml(item.jobTitle || 'Job Posting')}</h3>
                <p><strong>Position:</strong> ${escapeHtml(item.position || 'N/A')}</p>
                <p><strong>Department:</strong> ${escapeHtml(item.department || 'N/A')}</p>
                <p><strong>Open Positions:</strong> ${escapeHtml(item.openPositions || '0')}</p>
                <p><strong>Salary Range:</strong> ${escapeHtml(item.salaryRange || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Open')}</span></p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View Applicants</button>
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    ${item.status === 'Open' ? `<button class="close-btn" data-id="${item.id}">Close</button>` : ''}
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
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleClose(e.target.dataset.id));
        });
    };

    const handleCreate = async () => {
        const form = document.getElementById('jobForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Job posting created successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error creating job posting:', error);
            showMessage('message', 'Failed to create job posting.', 'error');
        }
    };

    const handleEdit = async (id) => {
        if (!id) return;

        const form = document.getElementById('jobForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`, 'PUT', payload);
            showMessage('message', 'Job posting updated successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error updating job posting:', error);
            showMessage('message', 'Failed to update job posting.', 'error');
        }
    };

    const handleClose = async (id) => {
        if (!id || !confirm('Are you sure you want to close this job posting?')) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/close`, 'POST');
            showMessage('message', 'Job posting closed successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error closing job posting:', error);
            showMessage('message', 'Failed to close job posting.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/applicants`);
            const applicants = response.data || [];
            displayApplicants(applicants);
        } catch (error) {
            console.error('Error loading applicants:', error);
            showMessage('message', 'Failed to load applicants.', 'error');
        }
    };

    const displayApplicants = (applicants) => {
        const modalContent = document.getElementById('applicantsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>Job Applicants</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${applicants.map(app => `
                            <tr>
                                <td>${escapeHtml(app.name || 'N/A')}</td>
                                <td>${escapeHtml(app.email || 'N/A')}</td>
                                <td>${escapeHtml(app.phone || 'N/A')}</td>
                                <td>${escapeHtml(app.status || 'N/A')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
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
    HRHiring.init();
});
