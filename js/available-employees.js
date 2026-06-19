// Coordinator Available Employees Module
const CoordinatorAvailableEmployees = (() => {
    const API_ENDPOINT = `${API_BASE}coordinator/available-employees`;

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
            console.error('Error loading available employees:', error);
            showMessage('message', 'Failed to load available employees.', 'error');
        }
    };

    const setupEventListeners = () => {
        const filterBtn = document.getElementById('filterEmployeesBtn');
        const deployBtn = document.getElementById('deployEmployeeBtn');

        if (filterBtn) filterBtn.addEventListener('click', handleFilter);
        if (deployBtn) deployBtn.addEventListener('click', handleDeploy);
    };

    const displayData = (data) => {
        const container = document.getElementById('availableEmployeesContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No available employees found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="employee-item" data-id="${item.id}">
                <h3>${escapeHtml(item.name || 'Employee')}</h3>
                <p><strong>Position:</strong> ${escapeHtml(item.position || 'N/A')}</p>
                <p><strong>Email:</strong> ${escapeHtml(item.email || 'N/A')}</p>
                <p><strong>Phone:</strong> ${escapeHtml(item.phone || 'N/A')}</p>
                <p><strong>Skills:</strong> ${escapeHtml(item.skills || 'N/A')}</p>
                <p><strong>Availability:</strong> <span class="status">${escapeHtml(item.availability || 'Available')}</span></p>
                <div class="actions">
                    <button class="deploy-btn" data-id="${item.id}">Deploy</button>
                    <button class="view-btn" data-id="${item.id}">View Profile</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        document.querySelectorAll('.deploy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDeploy(e.target.dataset.id));
        });
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
            console.error('Error filtering employees:', error);
            showMessage('message', 'Failed to filter employees.', 'error');
        }
    };

    const handleDeploy = async (id) => {
        if (!id) return;

        const form = document.getElementById('deploymentForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = { employeeId: id, ...Object.fromEntries(formData) };

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}/deploy`, 'POST', payload);
            showMessage('message', 'Employee deployed successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error deploying employee:', error);
            showMessage('message', 'Failed to deploy employee.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayEmployeeProfile(data);
        } catch (error) {
            console.error('Error loading employee profile:', error);
            showMessage('message', 'Failed to load employee profile.', 'error');
        }
    };

    const displayEmployeeProfile = (data) => {
        const modalContent = document.getElementById('employeeProfileModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>${escapeHtml(data.name || 'Employee Profile')}</h2>
                <p><strong>Email:</strong> ${escapeHtml(data.email || 'N/A')}</p>
                <p><strong>Phone:</strong> ${escapeHtml(data.phone || 'N/A')}</p>
                <p><strong>Position:</strong> ${escapeHtml(data.position || 'N/A')}</p>
                <p><strong>Skills:</strong> ${escapeHtml(data.skills || 'N/A')}</p>
                <p><strong>Experience:</strong> ${escapeHtml(data.experience || 'N/A')}</p>
                <p><strong>Availability:</strong> ${escapeHtml(data.availability || 'N/A')}</p>
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
    CoordinatorAvailableEmployees.init();
});
