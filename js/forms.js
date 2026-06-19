/* ========================================
   FORMS.JS - Form Handling & Validation
   Shared form utilities and helpers
   ======================================== */

// ========================================
// Message Display
// ========================================

/**
 * Show message (success or error)
 * @param {string} elementId - ID of message element
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(elementId, message, type = 'error') {
    const msgElement = document.getElementById(elementId);
    if (!msgElement) return;

    msgElement.textContent = message;
    msgElement.className = 'message ' + type;

    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            msgElement.className = 'message';
            msgElement.textContent = '';
        }, 5000);
    }
}

/**
 * Clear message
 * @param {string} elementId - ID of message element
 */
function clearMessage(elementId) {
    const msgElement = document.getElementById(elementId);
    if (msgElement) {
        msgElement.className = 'message';
        msgElement.textContent = '';
    }
}

// ========================================
// Field Validation
// ========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate required field
 * @param {string} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {object} - { valid: boolean, error: string }
 */
function validateRequired(value, fieldName = 'This field') {
    if (!value || !value.toString().trim()) {
        return {
            valid: false,
            error: fieldName + ' is required.'
        };
    }
    return { valid: true };
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
function validatePhone(phone) {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, strength: string }
 */
function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, strength: 'weak', error: 'Password must be at least 6 characters.' };
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const strength = (hasUpper + hasLower + hasNumber + hasSpecial);
    let strengthLevel = 'weak';
    if (strength >= 3) strengthLevel = 'strong';
    else if (strength >= 2) strengthLevel = 'medium';

    return { valid: true, strength: strengthLevel };
}

/**
 * Validate form fields
 * @param {object} fields - Object with field names and values
 * @returns {object} - { valid: boolean, errors: object }
 */
function validateForm(fields) {
    const errors = {};
    let valid = true;

    for (const [fieldName, fieldValue] of Object.entries(fields)) {
        if (!fieldValue || !fieldValue.toString().trim()) {
            errors[fieldName] = 'This field is required.';
            valid = false;
        }
    }

    return { valid, errors };
}

// ========================================
// Form Submission Handler
// ========================================

/**
 * Generic form submission handler
 * @param {string} formId - Form element ID
 * @param {string} endpoint - API endpoint
 * @param {function} onSuccess - Success callback
 * @param {function} onError - Error callback
 */
function handleFormSubmit(formId, endpoint, onSuccess, onError) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            const response = await apiCall(endpoint, {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (response.success) {
                if (onSuccess) onSuccess(response);
            } else {
                const error = response.message || 'Operation failed.';
                if (onError) {
                    onError(error);
                } else {
                    showMessage('message', error, 'error');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMsg = 'Connection error. Please try again.';
            if (onError) {
                onError(errorMsg);
            } else {
                showMessage('message', errorMsg, 'error');
            }
        }
    });
}

// ========================================
// Input Helpers
// ========================================

/**
 * Trim input value
 * @param {string} elementId - Input element ID
 */
function trimInput(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = element.value.trim();
    }
}

/**
 * Get form data as object
 * @param {string} formId - Form element ID
 * @returns {object} - Form data as object
 */
function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData) {
        if (data[key]) {
            // Handle multiple values with same name (checkboxes, radio)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    return data;
}

/**
 * Reset form to initial state
 * @param {string} formId - Form element ID
 */
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        clearMessage('message');
    }
}

/**
 * Disable form submission button
 * @param {string} formId - Form element ID
 * @param {boolean} disabled - True to disable
 */
function disableFormButton(formId, disabled = true) {
    const form = document.getElementById(formId);
    if (!form) return;

    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = disabled;
        if (disabled) {
            btn.textContent = btn.dataset.loadingText || 'Loading...';
        } else {
            btn.textContent = btn.dataset.originalText || 'Submit';
        }
    }
}

/**
 * Set form button loading state
 * @param {string} buttonId - Button element ID
 * @param {boolean} loading - True if loading
 * @param {string} loadingText - Text to show while loading
 */
function setButtonLoading(buttonId, loading = true, loadingText = 'Loading...') {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    if (loading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = loadingText;
        btn.disabled = true;
    } else {
        btn.textContent = btn.dataset.originalText || 'Submit';
        btn.disabled = false;
    }
}

// ========================================
// Form Data Helpers
// ========================================

/**
 * Populate form with data
 * @param {string} formId - Form element ID
 * @param {object} data - Data object to populate
 */
function populateForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return;

    for (const [key, value] of Object.entries(data)) {
        const input = form.elements[key];
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = value === true || value === '1' || value === 'on';
            } else if (input.type === 'radio') {
                const radio = form.querySelector(`input[name="${key}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else {
                input.value = value;
            }
        }
    }
}

/**
 * Clear form errors
 * @param {string} formId - Form element ID
 */
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());

    const errorInputs = form.querySelectorAll('.input-error');
    errorInputs.forEach(el => el.classList.remove('input-error'));
}

/**
 * Show field error
 * @param {string} fieldId - Input field ID
 * @param {string} errorMessage - Error message to show
 */
function showFieldError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('input-error');

    let errorEl = field.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('error-message')) {
        errorEl = document.createElement('small');
        errorEl.className = 'error-message';
        field.parentNode.insertBefore(errorEl, field.nextSibling);
    }

    errorEl.textContent = errorMessage;
}
