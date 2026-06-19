// ===== REPORTS PAGE =====
let allJobs = [];
let currentEditingId = null;

// Helper to convert image URL to absolute (if needed) and add cache buster
function getImageUrl(url) {
    if (!url) return null;
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url + '?t=' + Date.now();
    if (url.startsWith('/')) return window.location.origin + url + '?t=' + Date.now();
    return window.location.origin + '/' + url + '?t=' + Date.now();
}

// Convert image to base64 for PDF (guaranteed to embed)
async function imageToBase64(url) {
    if (!url) return null;
    try {
        const absoluteUrl = getImageUrl(url).split('?')[0];
        const response = await fetch(absoluteUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch(e) {
        console.error('Failed to convert image to base64:', e);
        return null;
    }
}

async function loadCompletedJobs() {
    const container = document.getElementById('jobList');
    container.innerHTML = '<p>Loading...</p>';
    try {
        const res = await fetch(API_BASE + 'get_completed_job_orders.php', { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.data.length) {
            allJobs = data.data;
            renderJobList();
        } else {
            container.innerHTML = '<p>No completed job orders found.</p>';
        }
    } catch(e) {
        console.error(e);
        container.innerHTML = '<p>Error loading data.</p>';
    }
}

function renderJobList() {
    const container = document.getElementById('jobList');
    let html = '';
    for (let job of allJobs) {
        html += `
            <div class="job-card">
                <div class="job-info">
                    <strong>${escapeHtml(job.ticket_no || job.id)}</strong><br>
                    Location: ${escapeHtml(job.location || '-')}<br>
                    Activity: ${escapeHtml(job.activity_type || '-')}<br>
                    Status: ${escapeHtml(job.status)} | Start: ${escapeHtml(job.start_date || '-')}
                </div>
                <div class="btn-group">
                    <button class="btn-edit" data-id="${job.id}">Edit</button>
                    <button class="btn-print" data-id="${job.id}">Print Report</button>
                    <button class="btn-pdf" data-id="${job.id}">Download PDF</button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.btn-print').forEach(btn => {
        btn.addEventListener('click', () => showReportForPrint(allJobs.find(j => j.id == btn.getAttribute('data-id'))));
    });
    document.querySelectorAll('.btn-pdf').forEach(btn => {
        btn.addEventListener('click', () => downloadPDF(allJobs.find(j => j.id == btn.getAttribute('data-id'))));
    });
}

function openEditModal(id) {
    const job = allJobs.find(j => j.id == id);
    if (!job) return;
    currentEditingId = id;
    document.getElementById('edit_ticket_no').value = job.ticket_no || '';
    document.getElementById('edit_start_date').value = job.start_date || '';
    document.getElementById('edit_activity_location').value = job.location || '';
    document.getElementById('edit_assigned_team').value = job.assigned_team || '';
    document.getElementById('edit_activity_type').value = job.activity_type || '';
    document.getElementById('edit_description_activity').value = job.description_activity || '';
    document.getElementById('edit_dispatcher').value = job.dispatcher || '';
    document.getElementById('edit_restored_time').value = job.restored_time || '';
    document.getElementById('edit_condition_facility').value = job.condition_facility || '';
    document.getElementById('edit_materials').value = job.materials || '';
    document.getElementById('edit_action_taken').value = job.action_taken || '';
    document.getElementById('edit_remarks').value = job.remarks || '';
    document.getElementById('editModal').style.display = 'flex';
}

document.getElementById('closeEditModalBtn').onclick = () => {
    document.getElementById('editModal').style.display = 'none';
};
document.getElementById('saveEditBtn').onclick = async () => {
    const id = currentEditingId;
    if (!id) return;
    const updatedData = {
        id: id,
        ticket_no: document.getElementById('edit_ticket_no').value,
        start_date: document.getElementById('edit_start_date').value,
        activity_location: document.getElementById('edit_activity_location').value,
        assigned_team: document.getElementById('edit_assigned_team').value,
        activity_type: document.getElementById('edit_activity_type').value,
        description_activity: document.getElementById('edit_description_activity').value,
        dispatcher: document.getElementById('edit_dispatcher').value,
        restored_time: document.getElementById('edit_restored_time').value,
        condition_facility: document.getElementById('edit_condition_facility').value,
        materials: document.getElementById('edit_materials').value,
        action_taken: document.getElementById('edit_action_taken').value,
        remarks: document.getElementById('edit_remarks').value
    };
    try {
        const res = await fetch(API_BASE + 'update_job_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updatedData)
        });
        const result = await res.json();
        if (result.success) {
            alert('Job order updated');
            document.getElementById('editModal').style.display = 'none';
            loadCompletedJobs();
        } else {
            alert('Error: ' + result.message);
        }
    } catch(e) {
        alert('Update failed');
    }
};

async function generateReportHTMLForPDF(job) {
    const beforeBase64 = await imageToBase64(job.before_photo);
    const afterBase64 = await imageToBase64(job.after_photo);
    return `
        <div class="report-container">
            <div class="report-header">
                <h2>CKL CONSTRUCTION SERVICES</h2>
                <h3>JOB ORDER REPORT</h3>
                <h3>(Deficient / Defective / Substandard Working Network Facility Inspection Report & Daily CQM Attendance Sheet)</h3>
            </div>
            <div class="report-section">
                <h4>Job Details</h4>
                <table>
                    <tr><td class="label">Reference Number (Ticket No.)</td><td>${escapeHtml(job.ticket_no || '-')}</td></tr>
                    <tr><td class="label">Start Date</td><td>${escapeHtml(job.start_date || '-')}</td></tr>
                    <tr><td class="label">Location of Activity</td><td>${escapeHtml(job.location || '-')}</td></tr>
                    <tr><td class="label">Assigned Team</td><td>${escapeHtml(job.assigned_team || '-')}</td></tr>
                    <tr><td class="label">Work Schedule</td><td>${escapeHtml(job.work_schedule || '-')}</td></tr>
                    <tr><td class="label">Service Vehicle</td><td>${escapeHtml(job.service_vehicle || '-')}</td></tr>
                    <tr><td class="label">Plate Number</td><td>${escapeHtml(job.plate_number || '-')}</td></tr>
                    <tr><td class="label">Type of Activity</td><td>${escapeHtml(job.activity_type || '-')}</td></tr>
                    <tr><td class="label">Description of Activity</td><td>${escapeHtml(job.description_activity || '-')}</td></tr>
                    <tr><td class="label">Dispatcher</td><td>${escapeHtml(job.dispatcher || '-')}</td></tr>
                    <tr><td class="label">Endorsed Time</td><td>${escapeHtml(job.endorsed_time || '-')}</td></tr>
                    <tr><td class="label">Restored Time (estimated)</td><td>${escapeHtml(job.restored_time || '-')}</td></tr>
                    <tr><td class="label">Condition of Facility</td><td>${escapeHtml(job.condition_facility || '-')}</td></tr>
                    <tr><td class="label">Materials Used</td><td>${escapeHtml(job.materials || '-')}</td></tr>
                    <tr><td class="label">Action Taken</td><td>${escapeHtml(job.action_taken || '-')}</td></tr>
                    <tr><td class="label">Remarks</td><td>${escapeHtml(job.remarks || '-')}</td></tr>
                </table>
            </div>
            <div class="report-section">
                <h4>Before and After Photos</h4>
                <div class="photo-grid">
                    <div class="photo-box"><strong>BEFORE</strong><br>${beforeBase64 ? `<img src="${beforeBase64}" alt="Before">` : '<p>No photo uploaded</p>'}</div>
                    <div class="photo-box"><strong>AFTER</strong><br>${afterBase64 ? `<img src="${afterBase64}" alt="After">` : '<p>No photo uploaded</p>'}</div>
                </div>
            </div>
            <p style="text-align:center; margin-top:2rem;">Generated by CKL HRMS • ${new Date().toLocaleString()}</p>
        </div>
    `;
}

function generateReportHTMLForPrint(job) {
    const beforeUrl = getImageUrl(job.before_photo);
    const afterUrl = getImageUrl(job.after_photo);
    return `
        <div class="report-container">
            <div class="report-header">
                <h2>CKL CONSTRUCTION SERVICES</h2>
                <h3>JOB ORDER REPORT</h3>
                <h3>(Deficient / Defective / Substandard Working Network Facility Inspection Report & Daily CQM Attendance Sheet)</h3>
            </div>
            <div class="report-section">
                <h4>Job Details</h4>
                <table>
                    <tr><td class="label">Reference Number (Ticket No.)</td><td>${escapeHtml(job.ticket_no || '-')}</td></tr>
                    <tr><td class="label">Start Date</td><td>${escapeHtml(job.start_date || '-')}</td></tr>
                    <tr><td class="label">Location of Activity</td><td>${escapeHtml(job.location || '-')}</td></tr>
                    <tr><td class="label">Assigned Team</td><td>${escapeHtml(job.assigned_team || '-')}</td></tr>
                    <tr><td class="label">Work Schedule</td><td>${escapeHtml(job.work_schedule || '-')}</td></tr>
                    <tr><td class="label">Service Vehicle</td><td>${escapeHtml(job.service_vehicle || '-')}</td></tr>
                    <tr><td class="label">Plate Number</td><td>${escapeHtml(job.plate_number || '-')}</td></tr>
                    <tr><td class="label">Type of Activity</td><td>${escapeHtml(job.activity_type || '-')}</td></tr>
                    <tr><td class="label">Description of Activity</td><td>${escapeHtml(job.description_activity || '-')}</td></tr>
                    <tr><td class="label">Dispatcher</td><td>${escapeHtml(job.dispatcher || '-')}</td></tr>
                    <tr><td class="label">Endorsed Time</td><td>${escapeHtml(job.endorsed_time || '-')}</td></tr>
                    <tr><td class="label">Restored Time (estimated)</td><td>${escapeHtml(job.restored_time || '-')}</td></tr>
                    <tr><td class="label">Condition of Facility</td><td>${escapeHtml(job.condition_facility || '-')}</td></tr>
                    <tr><td class="label">Materials Used</td><td>${escapeHtml(job.materials || '-')}</td></tr>
                    <tr><td class="label">Action Taken</td><td>${escapeHtml(job.action_taken || '-')}</td></tr>
                    <tr><td class="label">Remarks</td><td>${escapeHtml(job.remarks || '-')}</td></tr>
                </table>
            </div>
            <div class="report-section">
                <h4>Before and After Photos</h4>
                <div class="photo-grid">
                    <div class="photo-box"><strong>BEFORE</strong><br>${beforeUrl ? `<img src="${beforeUrl}" alt="Before">` : '<p>No photo uploaded</p>'}</div>
                    <div class="photo-box"><strong>AFTER</strong><br>${afterUrl ? `<img src="${afterUrl}" alt="After">` : '<p>No photo uploaded</p>'}</div>
                </div>
            </div>
            <p style="text-align:center; margin-top:2rem;">Generated by CKL HRMS • ${new Date().toLocaleString()}</p>
        </div>
    `;
}

async function showReportForPrint(job) {
    const win = window.open('', '_blank');
    win.document.write(`
        <html><head><title>Job Report ${job.ticket_no || job.id}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            .report-container { max-width: 1000px; margin: 0 auto; }
            .report-header { text-align: center; margin-bottom: 1.5rem; }
            .photo-grid { display: flex; gap: 1rem; margin-top: 1rem; }
            .photo-box { flex: 1; text-align: center; }
            .photo-box img { max-width: 100%; max-height: 200px; border: 1px solid #ccc; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 0.5rem 0; }
            td, th { border: 1px solid #ddd; padding: 6px; vertical-align: top; }
            .label { font-weight: bold; width: 35%; background: #f5f5f5; }
        </style>
        </head><body>${generateReportHTMLForPrint(job)}</body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
}

async function downloadPDF(job) {
    const container = document.createElement('div');
    container.innerHTML = await generateReportHTMLForPDF(job);
    document.body.appendChild(container);
    html2pdf().from(container).set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `Job_Report_${job.ticket_no || job.id}.pdf`,
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save().then(() => {
        document.body.removeChild(container);
    }).catch(err => {
        console.error(err);
        alert('PDF generation failed. Use Print Report instead.');
        document.body.removeChild(container);
    });
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

// ---- Set user name ----
const userName = localStorage.getItem('user_name');
if (document.getElementById('userNameDisplay')) {
    document.getElementById('userNameDisplay').innerText = userName || 'HR Administrator';
}

// ---- Initial load ----
loadCompletedJobs();