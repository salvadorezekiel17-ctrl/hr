// HR Employees Management Module
const HREmployees = (() => {
    const API_ENDPOINT = `${API_BASE}hr/employees`;

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
            console.error('Error loading employees:', error);
            showMessage('message', 'Failed to load employees.', 'error');
        }
    };

    const setupEventListeners = () => {
        const createBtn = document.getElementById('createEmployeeBtn');
        const editBtn = document.getElementById('editEmployeeBtn');
        const deleteBtn = document.getElementById('deleteEmployeeBtn');
        const viewBtn = document.getElementById('viewEmployeeBtn');

        if (createBtn) createBtn.addEventListener('click', handleCreate);
        if (editBtn) editBtn.addEventListener('click', handleEdit);
        if (deleteBtn) deleteBtn.addEventListener('click', handleDelete);
        if (viewBtn) viewBtn.addEventListener('click', handleView);
    };

    const displayData = (data) => {
        const container = document.getElementById('employeesContainer');
        if (!container) return;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No employees found.</p>';
            return;
        }

        const html = data.map(item => `
            <div class="employee-item" data-id="${item.id}">
                <h3>${escapeHtml(item.firstName || 'Employee')} ${escapeHtml(item.lastName || '')}</h3>
                <p><strong>Email:</strong> ${escapeHtml(item.email || 'N/A')}</p>
                <p><strong>Position:</strong> ${escapeHtml(item.position || 'N/A')}</p>
                <p><strong>Department:</strong> ${escapeHtml(item.department || 'N/A')}</p>
                <p><strong>Status:</strong> <span class="status">${escapeHtml(item.status || 'Active')}</span></p>
                <div class="actions">
                    <button class="view-btn" data-id="${item.id}">View</button>
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
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
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDelete(e.target.dataset.id));
        });
    };

    const handleCreate = async () => {
        const form = document.getElementById('employeeForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(API_ENDPOINT, 'POST', payload);
            showMessage('message', 'Employee created successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error creating employee:', error);
            showMessage('message', 'Failed to create employee.', 'error');
        }
    };

    const handleEdit = async (id) => {
        if (!id) return;

        const form = document.getElementById('employeeForm');
        if (!form) return;

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`, 'PUT', payload);
            showMessage('message', 'Employee updated successfully.', 'success');
            loadData();
            form.reset();
        } catch (error) {
            console.error('Error updating employee:', error);
            showMessage('message', 'Failed to update employee.', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!id || !confirm('Are you sure you want to delete this employee?')) return;

        try {
            await apiCall(`${API_ENDPOINT}/${id}`, 'DELETE');
            showMessage('message', 'Employee deleted successfully.', 'success');
            loadData();
        } catch (error) {
            console.error('Error deleting employee:', error);
            showMessage('message', 'Failed to delete employee.', 'error');
        }
    };

    const handleView = async (id) => {
        if (!id) return;

        try {
            const response = await apiCall(`${API_ENDPOINT}/${id}`);
            const data = response.data;
            displayEmployeeDetails(data);
        } catch (error) {
            console.error('Error loading employee details:', error);
            showMessage('message', 'Failed to load employee details.', 'error');
        }
    };

    const displayEmployeeDetails = (data) => {
        const modalContent = document.getElementById('employeeDetailsModal');
        if (!modalContent) return;

        const html = `
            <div class="modal-content">
                <h2>${escapeHtml(data.firstName || '')} ${escapeHtml(data.lastName || '')}</h2>
                <p><strong>Email:</strong> ${escapeHtml(data.email || 'N/A')}</p>
                <p><strong>Phone:</strong> ${escapeHtml(data.phone || 'N/A')}</p>
                <p><strong>Position:</strong> ${escapeHtml(data.position || 'N/A')}</p>
                <p><strong>Department:</strong> ${escapeHtml(data.department || 'N/A')}</p>
                <p><strong>Join Date:</strong> ${escapeHtml(data.joinDate || 'N/A')}</p>
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
    HREmployees.init();
});
