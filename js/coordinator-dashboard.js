// Coordinator Dashboard – Separate JS (uses global API_BASE)
// API_BASE is already defined in utils.js – do NOT redeclare it here.

let allEmployees = [];
const teamNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf'];

async function fetchEmployees() {
    try {
        const res = await fetch(API_BASE + 'get_employees.php', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
            allEmployees = data.data;
            renderAvailable();
            renderTeams();
        }
    } catch (e) {
        console.error('Error loading employees:', e);
    }
}

function renderAvailable() {
    const container = document.getElementById('availableEmployeesList');
    if (!container) return;
    const available = allEmployees.filter(emp => !emp.current_team);
    if (available.length === 0) {
        container.innerHTML = '<div class="empty-message">No available employees.</div>';
        return;
    }
    let html = '';
    for (let emp of available) {
        html += `<div class="available-employee-item">
            <div><span class="employee-name">${emp.name}</span></div>
            <button class="btn-assign" data-id="${emp.id}" data-name="${emp.name}">Assign to Team</button>
        </div>`;
    }
    container.innerHTML = html;

    // Attach assign button events
    document.querySelectorAll('.btn-assign').forEach(btn => {
        btn.addEventListener('click', function() {
            openModal(this.dataset.id, this.dataset.name);
        });
    });
}

function renderTeams() {
    const container = document.getElementById('teamsList');
    if (!container) return;
    let teamMembers = {};
    for (let team of teamNames) { teamMembers[team] = []; }
    for (let emp of allEmployees) {
        if (emp.current_team && teamMembers[emp.current_team]) {
            teamMembers[emp.current_team].push(emp.name);
        }
    }
    let html = '';
    for (let team of teamNames) {
        const members = teamMembers[team];
        const memberNames = members.length > 0 ? members.join(', ') : 'No members';
        html += `<div class="team-card">
            <div class="team-header"><span>Team ${team}</span><span>${members.length} members</span></div>
            <div class="team-members-list">${memberNames}</div>
        </div>`;
    }
    container.innerHTML = html;
}

async function assignToDatabase(id, team) {
    const res = await fetch(API_BASE + 'assign_employee.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ employee_id: id, team: team })
    });
    return await res.json();
}

let currentId = null, currentName = null;

function openModal(id, name) {
    currentId = id;
    currentName = name;
    document.getElementById('assignEmployeeName').innerHTML = '<strong>' + name + '</strong>';
    document.getElementById('assignModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('assignModal').style.display = 'none';
    currentId = null;
}

document.getElementById('confirmAssignBtn')?.addEventListener('click', async function() {
    if (!currentId) return;
    const team = document.getElementById('teamSelect').value;
    const result = await assignToDatabase(currentId, team);
    if (result.success) {
        alert(currentName + ' assigned to Team ' + team);
        await fetchEmployees();
        closeModal();
    } else {
        alert('Error: ' + result.message);
    }
});

document.getElementById('cancelAssignBtn')?.addEventListener('click', closeModal);
window.onclick = function(e) {
    if (e.target === document.getElementById('assignModal')) closeModal();
};

// Start
fetchEmployees();