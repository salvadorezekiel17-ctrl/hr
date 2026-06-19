// Job Orders – Separate JS
const API_BASE = (window.API_BASE !== undefined) ? window.API_BASE : '/hrms/backend/api/';

// Load and display job orders
async function fetchJobOrders() {
    try {
        const res = await fetch(API_BASE + 'get_job_orders.php', { credentials: 'include' });
        const data = await res.json();
        const tbody = document.getElementById('jobOrdersBody');
        if (data.success && data.data.length > 0) {
            let html = '';
            for (let job of data.data) {
                let statusClass = (job.status === 'pending' || job.status === 'Pending') ? 'status-pending' : 'status-active';
                html += '<tr>';
                html += '<td>' + escapeHtml(job.id || '-') + '</td>';
                html += '<td>' + escapeHtml(job.ticket_no || '-') + '</td>';
                html += '<td>' + escapeHtml(job.location || '-') + '</td>';
                html += '<td>' + escapeHtml(job.activity_type || '-') + '</td>';
                html += '<td><span class="status-badge ' + statusClass + '">' + escapeHtml(job.status || 'pending') + '</span></td>';
                html += '<td>' + escapeHtml(job.start_date || '-') + '</td>';
                html += '</tr>';
            }
            tbody.innerHTML = html;
        } else {
            tbody.innerHTML = '<tr><td colspan="6">No job orders found.</td></tr>';
        }
    } catch(e) {
        document.getElementById('jobOrdersBody').innerHTML = '<tr><td colspan="6">Error loading: ' + escapeHtml(e.message) + '</td></tr>';
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Modal controls
const modal = document.getElementById('createModal');
const createBtn = document.getElementById('createJobBtn');
const cancelBtn = document.getElementById('cancelCreateBtn');
const confirmBtn = document.getElementById('confirmCreateBtn');

createBtn.onclick = function() {
    modal.style.display = 'flex';
};
cancelBtn.onclick = function() {
    modal.style.display = 'none';
};
window.onclick = function(e) {
    if (e.target === modal) modal.style.display = 'none';
};

// Create job order
confirmBtn.onclick = async function() {
    // Get selected activity type (radio)
    let activityType = null;
    const radios = document.querySelectorAll('input[name="activityType"]');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            activityType = radios[i].value;
            break;
        }
    }
    if (!activityType) {
        alert('Please select a Type of Activity');
        return;
    }
    const othersText = document.getElementById('othersActivity').value.trim();
    if (activityType === 'Others' && !othersText) {
        alert('Please specify the activity type in the "Others" field');
        return;
    }
    if (activityType === 'Others') activityType = othersText;
    const startDate = document.getElementById('startDate').value;
    if (!startDate) {
        alert('Please select a valid start date');
        return;
    }
    const ticketNo = document.getElementById('ticketNo').value.trim();
    if (!ticketNo) {
        alert('Please enter Ticket No.');
        return;
    }

    const payload = {
        ticket_no: ticketNo,
        start_date: startDate,
        location: document.getElementById('activityLocation').value,
        location_reference: document.getElementById('locationReference').value,
        assigned_team: document.getElementById('assignedTeam').value,
        work_schedule: document.getElementById('workSchedule').value,
        service_vehicle: document.getElementById('serviceVehicle').value,
        plate_number: document.getElementById('plateNumber').value,
        activity_type: activityType,
        description_activity: document.getElementById('descriptionActivity').value,
        dispatcher: document.getElementById('dispatcher').value,
        endorsed_time: document.getElementById('endorsedTime').value,
        restored_time: document.getElementById('restoredTime').value,
        condition: document.getElementById('condition').value,
        materials: document.getElementById('materials').value,
        action_taken: document.getElementById('actionTaken').value,
        remarks: document.getElementById('remarks').value
    };

    try {
        const res = await fetch(API_BASE + 'create_job_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert('Job order created');
            modal.style.display = 'none';
            fetchJobOrders(); // refresh table
        } else {
            alert('Error: ' + data.message);
        }
    } catch(e) {
        alert('Request failed: ' + e.message);
    }
};

fetchJobOrders();