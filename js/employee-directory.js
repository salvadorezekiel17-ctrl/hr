// Employee Directory - Load Data (FIXED)
const HREmployees = (() => {
    const API_URL = '/hrms/backend/api/get_employees.php';

    const init = () => {
        loadEmployees();
        setupSearch();
        setupAddButton();
    };

    const loadEmployees = async () => {
        const tbody = document.getElementById('employeeTableBody');
        try {
            const response = await fetch(API_URL, { credentials: 'include' });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            const employees = data.data || [];
            if (employees.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No employees found</td></tr>';
                return;
            }
            let html = '';
            for (let emp of employees) {
                const dailyRate = emp.daily_rate || 0;
                html += `<tr>
                    <td>${emp.id}</td>
                    <td>${escapeHtml(emp.name)}</td>
                    <td>${escapeHtml(emp.position || '-')}</td>
                    <td>${escapeHtml(emp.department || '-')}</td>
                    <td>₱${parseFloat(dailyRate).toFixed(2)}</td>
                    <td>${escapeHtml(emp.status || 'Active')}</td>
                    <td>
                        <button class="btn-edit" data-id="${emp.id}" data-name="${escapeHtml(emp.name)}" data-position="${escapeHtml(emp.position || '')}" data-department="${escapeHtml(emp.department || '')}" data-daily="${dailyRate}" data-status="${escapeHtml(emp.status || 'Active')}">Edit</button>
                        ${emp.status !== 'Inactive' ? `<button class="btn-offboard" data-id="${emp.id}" data-name="${escapeHtml(emp.name)}">Offboard</button>` : ''}
                        <button class="btn-delete" data-id="${emp.id}">Delete</button>
                    </td>
                </tr>`;
            }
            tbody.innerHTML = html;
            attachEvents();  // <-- CRITICAL: attach after rendering
        } catch (error) {
            console.error('Error loading employees:', error);
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Error loading employees. Please try again.</td></tr>';
        }
    };

    const attachEvents = () => {
        // Edit
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                openEditModal(this.dataset.id, this.dataset.name, this.dataset.position, this.dataset.department, this.dataset.daily, this.dataset.status);
            });
        });
        // Delete
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async function() {
                if (confirm('Delete this employee?')) {
                    const id = this.dataset.id;
                    try {
                        const res = await fetch('/hrms/backend/api/delete_employee.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({ id })
                        });
                        const data = await res.json();
                        if (data.success) {
                            alert('Employee deleted');
                            loadEmployees();
                        } else {
                            alert('Error: ' + data.message);
                        }
                    } catch (e) {
                        alert('Request failed: ' + e.message);
                    }
                }
            });
        });
        // Offboard
        document.querySelectorAll('.btn-offboard').forEach(btn => {
            btn.addEventListener('click', function() {
                openOffboardModal(this.dataset.id, this.dataset.name);
            });
        });
    };

    // ---- Modal functions (global) ----
    window.openEditModal = function(id, name, position, department, dailyRate, status) {
        document.getElementById('editId').value = id;
        document.getElementById('editName').value = name;
        document.getElementById('editPosition').value = position;
        document.getElementById('editDepartment').value = department;
        document.getElementById('editDailyRate').value = dailyRate;
        document.getElementById('editStatus').value = status;
        document.getElementById('editModal').style.display = 'flex';
    };

    window.closeEditModal = function() {
        document.getElementById('editModal').style.display = 'none';
    };

    window.openOffboardModal = function(id, name) {
        document.getElementById('offboardId').value = id;
        document.getElementById('offboardName').innerHTML = '<strong>' + escapeHtml(name) + '</strong>';
        document.getElementById('offboardDate').value = '';
        document.getElementById('offboardReason').value = 'Resigned';
        document.getElementById('offboardRemarks').value = '';
        document.getElementById('offboardModal').style.display = 'flex';
    };

    window.closeOffboardModal = function() {
        document.getElementById('offboardModal').style.display = 'none';
    };

    // ---- Other functions ----
    const setupSearch = () => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const term = this.value.toLowerCase();
                document.querySelectorAll('#employeeTableBody tr').forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
                });
            });
        }
    };

    const setupAddButton = () => {
        const addBtn = document.getElementById('addEmployeeBtn');
        if (addBtn) addBtn.addEventListener('click', () => document.getElementById('addModal').style.display = 'flex');
    };

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>"]/g, m => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            if (m === '"') return '&quot;';
            return m;
        });
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => HREmployees.init());

// ---- Save buttons for modals (must be outside) ----
document.getElementById('saveEditBtn')?.addEventListener('click', async function() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const position = document.getElementById('editPosition').value;
    const department = document.getElementById('editDepartment').value;
    const dailyRate = document.getElementById('editDailyRate').value;
    const status = document.getElementById('editStatus').value;
    try {
        const res = await fetch('/hrms/backend/api/update_employee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, name, position, department, daily_rate: dailyRate, status })
        });
        const data = await res.json();
        if (data.success) {
            alert('Employee updated');
            closeEditModal();
            HREmployees.init(); // reload
        } else alert('Error: ' + data.message);
    } catch (e) { alert('Request failed: ' + e.message); }
});

document.getElementById('saveAddBtn')?.addEventListener('click', async function() {
    const name = document.getElementById('addName').value;
    const position = document.getElementById('addPosition').value;
    const department = document.getElementById('addDepartment').value;
    const dailyRate = document.getElementById('addDailyRate').value;
    const status = document.getElementById('addStatus').value;
    if (!name || !position || !department) return alert('Fill all required fields');
    try {
        const res = await fetch('/hrms/backend/api/add_employee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, position, department, daily_rate: dailyRate, status })
        });
        const data = await res.json();
        if (data.success) {
            alert('Employee added');
            closeAddModal();
            HREmployees.init();
        } else alert('Error: ' + data.message);
    } catch (e) { alert('Request failed: ' + e.message); }
});

document.getElementById('saveOffboardBtn')?.addEventListener('click', async function() {
    const id = document.getElementById('offboardId').value;
    const offboardDate = document.getElementById('offboardDate').value;
    const reason = document.getElementById('offboardReason').value;
    const remarks = document.getElementById('offboardRemarks').value;
    if (!offboardDate) return alert('Enter offboarding date');
    try {
        await fetch('/hrms/backend/api/add_offboarding.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ employee_id: id, offboard_date: offboardDate, reason, remarks })
        });
        const res = await fetch('/hrms/backend/api/update_employee.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, status: 'Inactive' })
        });
        const data = await res.json();
        if (data.success) {
            alert('Employee offboarded');
            closeOffboardModal();
            HREmployees.init();
        } else alert('Error: ' + data.message);
    } catch (e) { alert('Request failed: ' + e.message); }
});

window.closeAddModal = function() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addName').value = '';
    document.getElementById('addPosition').value = '';
    document.getElementById('addDepartment').value = '';
    document.getElementById('addDailyRate').value = '';
    document.getElementById('addStatus').value = 'Active';
};