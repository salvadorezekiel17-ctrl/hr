/* ========================================
   JOB-ORDERS.JS - Job Orders Management
   Coordinator module
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    const jobOrdersBody = document.getElementById('jobOrdersBody');
    if (!jobOrdersBody) return;

    // Setup modal manager
    const modalManager = new ModalManager('createModal', 'createJobBtn', 'cancelCreateBtn');

    // Load job orders on page load
    fetchJobOrders();

    // Setup create job order handler
    setupCreateJobOrderHandler(modalManager);

    /**
     * Fetch and display job orders
     */
    async function fetchJobOrders() {
        try {
            jobOrdersBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

            const response = await apiCall('get_job_orders.php', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.success || !response.data || response.data.length === 0) {
                jobOrdersBody.innerHTML = '<tr><td colspan="6">No job orders found.</td></tr>';
                return;
            }

            let html = '';
            for (let job of response.data) {
                const statusClass = getStatusClass(job.status);
                html += `<tr>
                    <td>${escapeHtml(job.id || '-')}</td>
                    <td>${escapeHtml(job.ticket_no || '-')}</td>
                    <td>${escapeHtml(job.location || '-')}</td>
                    <td>${escapeHtml(job.activity_type || '-')}</td>
                    <td><span class="status-badge ${statusClass}">${escapeHtml(job.status || 'Pending')}</span></td>
                    <td>${escapeHtml(job.start_date || '-')}</td>
                </tr>`;
            }
            jobOrdersBody.innerHTML = html;

        } catch (error) {
            console.error('Error loading job orders:', error);
            jobOrdersBody.innerHTML = '<tr><td colspan="6">Error loading job orders. Please try again.</td></tr>';
        }
    }

    /**
     * Setup create job order handler
     */
    function setupCreateJobOrderHandler(modalManager) {
        const confirmBtn = document.getElementById('confirmCreateBtn');
        if (!confirmBtn) return;

        confirmBtn.addEventListener('click', async function() {
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

            // Handle "Others" activity type
            const othersText = document.getElementById('othersActivity').value.trim();
            if (activityType === 'Others' && !othersText) {
                alert('Please specify the activity type in the "Others" field');
                return;
            }
            if (activityType === 'Others') {
                activityType = othersText;
            }

            // Get and validate start date
            const startDate = document.getElementById('startDate').value;
            if (!startDate) {
                alert('Please select a valid start date');
                return;
            }

            // Get and validate ticket number
            const ticketNo = document.getElementById('ticketNo').value.trim();
            if (!ticketNo) {
                alert('Please enter Ticket No.');
                return;
            }

            // Build payload
            const payload = {
                ticket_no: ticketNo,
                start_date: startDate,
                location: document.getElementById('activityLocation').value.trim(),
                location_reference: document.getElementById('locationReference').value.trim(),
                assigned_team: document.getElementById('assignedTeam').value,
                work_schedule: document.getElementById('workSchedule').value.trim(),
                service_vehicle: document.getElementById('serviceVehicle').value.trim(),
                plate_number: document.getElementById('plateNumber').value.trim(),
                activity_type: activityType,
                description_activity: document.getElementById('descriptionActivity').value.trim(),
                dispatcher: document.getElementById('dispatcher').value,
                endorsed_time: document.getElementById('endorsedTime').value,
                restored_time: document.getElementById('restoredTime').value,
                condition: document.getElementById('condition').value,
                materials: document.getElementById('materials').value.trim(),
                action_taken: document.getElementById('actionTaken').value.trim(),
                remarks: document.getElementById('remarks').value.trim()
            };

            try {
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Creating...';

                const response = await apiCall('create_job_order.php', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    credentials: 'include'
                });

                if (response.success) {
                    alert('Job order created successfully');
                    modalManager.close();
                    fetchJobOrders(); // Refresh table
                    // Reset form
                    document.querySelector('.form-grid').querySelectorAll('input, select, textarea').forEach(el => {
                        el.value = '';
                    });
                } else {
                    alert('Error: ' + (response.message || 'Failed to create job order'));
                }

            } catch (error) {
                console.error('Create job order error:', error);
                alert('Request failed: ' + error.message);
            } finally {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Create Job Order';
            }
        });
    }
});
