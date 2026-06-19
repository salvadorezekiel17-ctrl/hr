/* ========================================
   UTILS.JS - Core Utility Functions
   Shared across all HRMS pages
   ======================================== */

// API Configuration
const API_BASE = '/hrms/backend/api/';

// ========================================
// HTML/Attribute Escaping (XSS Prevention)
// ========================================

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

/**
 * Escape HTML special characters for use in attributes
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;');
}

// ========================================
// Fetch/API Wrapper
// ========================================

/**
 * Wrapper for fetch with common settings
 * @param {string} endpoint - API endpoint path (without API_BASE)
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - Fetch response promise
 */
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options
    };

    try {
        const res = await fetch(API_BASE + endpoint, defaultOptions);
        return await res.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// ========================================
// Status Badge Class Helper
// ========================================

/**
 * Get CSS class for a given status
 * @param {string} status - The status text
 * @returns {string} - CSS class name
 */
function getStatusClass(status) {
    const statusMap = {
        'present': 'status-present',
        'late': 'status-late',
        'absent': 'status-absent',
        'pending': 'status-pending',
        'active': 'status-active',
        'available': 'status-available',
        'completed': 'status-completed',
        'approved': 'status-approved',
        'rejected': 'status-rejected',
        'progress': 'status-progress',
        'in progress': 'status-progress',
        'dispatched': 'status-dispatched',
        'for validation': 'status-validation',
        'validation': 'status-validation'
    };

    const lowerStatus = String(status || '').toLowerCase();
    return statusMap[lowerStatus] || 'status-pending';
}

// ========================================
// Currency Formatting
// ========================================

/**
 * Format amount as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'PHP')
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount, currency = 'PHP') {
    const num = parseFloat(amount) || 0;
    return currency + ' ' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ========================================
// Modal Manager Class
// ========================================

/**
 * Manages modal open/close behavior
 */
class ModalManager {
    constructor(modalId, openBtnId = null, closeBtnId = null) {
        this.modal = document.getElementById(modalId);
        this.openBtn = openBtnId ? document.getElementById(openBtnId) : null;
        this.closeBtn = closeBtnId ? document.getElementById(closeBtnId) : null;
        this.init();
    }

    init() {
        // Open button click
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.open());
        }

        // Close button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Backdrop click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }

    /**
     * Open the modal
     */
    open() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.modal.classList.add('show');
        }
    }

    /**
     * Close the modal
     */
    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.modal.classList.remove('show');
        }
    }

    /**
     * Check if modal is open
     */
    isOpen() {
        return this.modal && this.modal.style.display === 'flex';
    }

    /**
     * Toggle modal visibility
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }
}

// ========================================
// Utility Helpers
// ========================================

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} - Parameter value or null
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Format date to readable format
 * @param {string} dateStr - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format time to readable format
 * @param {string} timeStr - Time string (HH:MM)
 * @returns {string} - Formatted time
 */
function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sleep/delay utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// Dropdown Toggle
// ========================================

/**
 * Initialize dropdown menu toggle
 */
function initializeDropdown() {
    const dropbtn = document.getElementById('dropbtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (dropbtn && dropdownMenu) {
        dropbtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeDropdown);

