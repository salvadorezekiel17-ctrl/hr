// Offboarding History – with localStorage fallback for onboard_date
document.addEventListener('DOMContentLoaded', function() {

    // ---- DROPDOWN ----
    const dropbtn = document.getElementById('dropbtn');
    if (dropbtn) {
        dropbtn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('dropdownMenu').classList.toggle('show');
        });
        window.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-content').forEach(m => m.classList.remove('show'));
        });
    }

    // ---- USER NAME ----
    const userName = localStorage.getItem('user_name');
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.innerText = userName || 'HR Administrator';

    const API_BASE = '/hrms/backend/api/';

    // ---- HELPERS ----
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, m => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function getStatusBadge(status) {
    if (status === 'Active') return '<span class="status-active">Active</span>';
    if (status === 'On Leave') return '<span class="status-onleave">On Leave</span>';
    if (status === 'Offboarded' || status === 'Inactive') return '<span class="status-inactive">Offboarded</span>';
    return status;
}

    // ---- Get onboard date from localStorage (if set) ----
    function getOnboardDate(empId) {
        const stored = localStorage.getItem('onboard_' + empId);
        if (stored) return stored;
        return null; // fallback to API
    }

    // ---- Save onboard date to localStorage ----
    function setOnboardDate(empId, date) {
        if (date) {
            localStorage.setItem('onboard_' + empId, date);
        } else {
            localStorage.removeItem('onboard_' + empId);
        }
    }

    // ---- MODAL FUNCTIONS ----
    window.openEditModal = function(id, name, position, department, status, onboardDate) {
        document.getElementById('editId').value = id;
        document.getElementById('editName').value = name;
        document.getElementById('editPosition').value = position || '';
        document.getElementById('editDepartment').value = department || '';
        // Pre-fill from localStorage if available
        const storedDate = getOnboardDate(id);
        const dateToShow = storedDate || onboardDate || '';
        if (dateToShow) {
            const dateObj = new Date(dateToShow);
            if (!isNaN(dateObj)) {
                document.getElementById('editOnboardDate').value = dateObj.toISOString().split('T')[0];
            } else {
                document.getElementById('editOnboardDate').value = dateToShow;
            }
        } else {
            document.getElementById('editOnboardDate').value = '';
        }
        document.getElementById('editStatus').value = status || 'Active';
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

    // ---- SAVE EDIT (with localStorage) ----
    document.getElementById('saveEditBtn')?.addEventListener('click', async function() {
        const id = document.getElementById('editId').value;
        const name = document.getElementById('editName').value;
        const position = document.getElementById('editPosition').value;
        const department = document.getElementById('editDepartment').value;
        const onboardDate = document.getElementById('editOnboardDate').value;
        const status = document.getElementById('editStatus').value;

        if (!name) return alert('Name is required.');
        if (!position) return alert('Position is required.');
        if (!department) return alert('Department is required.');

        try {
            // Send update to server
            const res = await fetch('/hrms/backend/api/update_employee.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    id, name, position, department, 
                    onboard_date: onboardDate, 
                    status 
                })
            });
            const data = await res.json();
            if (data.success) {
                // Save the date in localStorage so we can display it
                setOnboardDate(id, onboardDate);
                alert('Employee updated');
                closeEditModal();
                loadEmployees(); // reload tables
            } else {
                alert('Error: ' + data.message);
            }
        } catch (e) {
            alert('Request failed: ' + e.message);
        }
    });

    // ---- SAVE OFFBOARD (unchanged) ----
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
                loadEmployees();
            } else alert('Error: ' + data.message);
        } catch (e) { alert('Request failed: ' + e.message); }
    });

    // ---- LOAD EMPLOYEES (use localStorage for onboard date) ----
    async function loadEmployees() {
        const onboardTbody = document.getElementById('onboardedTableBody');
        const offboardTbody = document.getElementById('offboardedTableBody');

        if (!onboardTbody || !offboardTbody) {
            console.error('Table bodies not found.');
            return;
        }

        onboardTbody.innerHTML = '<tr><td colspan="5" class="no-data">Loading...</td></tr>';
        offboardTbody.innerHTML = '<tr><td colspan="5" class="no-data">Loading...</td></tr>';

        try {
            const res = await fetch(API_BASE + 'get_employees.php', { credentials: 'include' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'API error');

            const employees = data.data || [];
            const onboarded = employees.filter(emp => emp.status === 'Active' || emp.status === 'On Leave');
            const offboarded = employees.filter(emp => emp.status === 'Offboarded' || emp.status === 'Inactive');

            // Render Onboarded
            if (onboarded.length === 0) {
                onboardTbody.innerHTML = '<tr><td colspan="5" class="no-data">No onboarded employees.</td></tr>';
            } else {
                let html = '';
                for (let emp of onboarded) {
                    // Use localStorage date if available, else fallback to API (which is missing)
                    const storedDate = getOnboardDate(emp.id);
                    const displayDate = storedDate || emp.onboard_date || '-';
                    html += `<tr>
                        <td>${escapeHtml(emp.name)}</td>
                        <td>${escapeHtml(emp.position || '-')}</td>
                        <td>${escapeHtml(displayDate)}</td>
                        <td>${getStatusBadge(emp.status)}</td>
                        <td>
                            <button class="btn-edit" 
                                data-id="${emp.id}" 
                                data-name="${escapeHtml(emp.name)}" 
                                data-position="${escapeHtml(emp.position || '')}" 
                                data-department="${escapeHtml(emp.department || '')}" 
                                data-status="${escapeHtml(emp.status)}"
                                data-onboard="${displayDate}">Edit</button>
                            <button class="btn-delete" data-id="${emp.id}">Delete</button>
                        </td>
                    </tr>`;
                }
                onboardTbody.innerHTML = html;
            }

            // Render Offboarded (same logic, but offboarded may not have onboard date – we can still show it)
            if (offboarded.length === 0) {
                offboardTbody.innerHTML = '<tr><td colspan="5" class="no-data">No offboarded employees.</td></tr>';
            } else {
                let html = '';
                for (let emp of offboarded) {
                    const storedDate = getOnboardDate(emp.id);
                    const displayDate = storedDate || emp.onboard_date || '-';
                    html += `<tr>
                        <td>${escapeHtml(emp.name)}</td>
                        <td>${escapeHtml(emp.position || '-')}</td>
                        <td>${escapeHtml(emp.offboard_date || '-')}</td>
                        <td>${escapeHtml(emp.offboard_reason || '-')}</td>
                        <td>
                            <button class="btn-edit" 
                                data-id="${emp.id}" 
                                data-name="${escapeHtml(emp.name)}" 
                                data-position="${escapeHtml(emp.position || '')}" 
                                data-department="${escapeHtml(emp.department || '')}" 
                                data-status="${escapeHtml(emp.status)}"
                                data-onboard="${displayDate}">Edit</button>
                            <button class="btn-delete" data-id="${emp.id}">Delete</button>
                        </td>
                    </tr>`;
                }
                offboardTbody.innerHTML = html;
            }

            attachEvents(onboardTbody, offboardTbody);

        } catch (error) {
            console.error('Error loading employees:', error);
            const msg = 'Error: ' + error.message;
            onboardTbody.innerHTML = `<tr><td colspan="5" class="no-data" style="color:red;">${msg}</td></tr>`;
            offboardTbody.innerHTML = `<tr><td colspan="5" class="no-data" style="color:red;">${msg}</td></tr>`;
        }
    }

    // ---- ATTACH EVENTS ----
    function attachEvents(onboardTbody, offboardTbody) {
        // Edit buttons
        onboardTbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                openEditModal(
                    this.dataset.id,
                    this.dataset.name,
                    this.dataset.position,
                    this.dataset.department,
                    this.dataset.status,
                    this.dataset.onboard
                );
            });
        });
        offboardTbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                openEditModal(
                    this.dataset.id,
                    this.dataset.name,
                    this.dataset.position,
                    this.dataset.department,
                    this.dataset.status,
                    this.dataset.onboard
                );
            });
        });

        // Delete buttons (unchanged)
        onboardTbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async function() {
                if (!confirm('Delete this employee?')) return;
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
            });
        });
        offboardTbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async function() {
                if (!confirm('Delete this employee?')) return;
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
            });
        });
    }

    // ---- START ----
    loadEmployees();
});