/* ========================================
   APPLY.JS - Application Form Handling
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const applyForm = document.getElementById('applyForm');
    if (!applyForm) return;

    applyForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const position = document.getElementById('position').value;
        const experience = document.getElementById('experience').value.trim();
        const date_of_birth = document.getElementById('date_of_birth').value;
        const address = document.getElementById('address').value.trim();
        const years_experience = parseInt(document.getElementById('years_experience').value) || 0;
        const skills = document.getElementById('skills').value.trim();
        const emergency_contact = document.getElementById('emergency_contact').value.trim();
        const emergency_phone = document.getElementById('emergency_phone').value.trim();

        // Validate required fields
        if (!name || !email) {
            showMessage('message', 'Name and email are required.', 'error');
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            showMessage('message', 'Please enter a valid email address.', 'error');
            return;
        }

        // Show loading message
        showMessage('message', 'Submitting...', 'error');
        setButtonLoading('applyForm', true);

        try {
            const response = await apiCall('submit_application.php', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    position,
                    experience,
                    date_of_birth,
                    address,
                    years_experience,
                    skills,
                    emergency_contact,
                    emergency_phone
                })
            });

            if (response.success) {
                showMessage('message', 'Application submitted! HR will review it soon.', 'success');
                applyForm.reset();
                setButtonLoading('applyForm', false);
            } else {
                showMessage('message', 'Error: ' + (response.message || 'Failed to submit application.'), 'error');
                setButtonLoading('applyForm', false);
            }
        } catch (error) {
            console.error('Application submission error:', error);
            showMessage('message', 'Connection error. Please try again.', 'error');
            setButtonLoading('applyForm', false);
        }
    });
});
