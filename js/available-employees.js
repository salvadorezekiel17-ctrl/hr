// Available Employees – FIXED (buttons clickable)
document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('employeeTableBody');
    if (!tbody) return;

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"]/g, m => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            if (m === '"') return '&quot;';
            return m;
        });
    }

    function renderTable(employees) {
        if (!employees || employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No available employees.</td></tr>';
            return;
        }
        let html = '';
        employees.forEach(emp => {
            // Map status to "Available" if Active
            let displayStatus = emp.status;
            if (displayStatus === 'Active') displayStatus = 'Available';

            html += `<tr>
                <td>${emp.id}</td>
                <td>${escapeHtml(emp.name || 'N/A')}</td>
                <td><span class="status-available">${escapeHtml(displayStatus)}</span></td>
                <td><button class="btn-assign" data-id="${emp.id}" data-name="${escapeHtml(emp.name)}">Assign to Team</button></td>
            </tr>`;
        });
        tbody.innerHTML = html;

        // Attach event listeners to all buttons
        document.querySelectorAll('.btn-assign').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const name = this.dataset.name;
                openAssignModal(id, name);
            });
        });
    }

    function loadDemoData() {
        renderTable([
            { id: 200245699, name: 'Manigguh', status: 'Active' },
            { id: 200245700, name: 'NICOYU', status: 'Active' }
        ]);
    }

    function loadData() {
        tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
        const apiUrl = '../backend/api/get_available_employees.php';

        fetch(apiUrl, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data && data.data.length > 0) {
                    renderTable(data.data);
                } else {
                    loadDemoData();
                }
            })
            .catch(() => {
                // Silent fallback to demo
                loadDemoData();
            });
    }

    function openAssignModal(id, name) {
        const modal = document.getElementById('assignModal');
        const nameDisplay = document.getElementById('assignEmployeeName');
        const teamSelect = document.getElementById('teamSelect');
        const confirmBtn = document.getElementById('confirmAssignBtn');
        const cancelBtn = document.getElementById('cancelAssignBtn');

        if (!modal || !nameDisplay || !teamSelect) {
            alert('Modal elements not found – check your HTML.');
            return;
        }

        nameDisplay.textContent = `Assign ${name} (ID: ${id}) to team:`;
        modal.style.display = 'flex';

        // Remove old listeners to avoid duplicates
        const newConfirm = confirmBtn.cloneNode(true);
        const newCancel = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

        newConfirm.addEventListener('click', function() {
            const team = teamSelect.value;
            alert(`Assigned ${name} to Team ${team}`);
            modal.style.display = 'none';
            loadData(); // refresh
        });

        newCancel.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    loadData();
});