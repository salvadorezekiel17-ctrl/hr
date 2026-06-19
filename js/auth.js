/* ========================================
   AUTH.JS - Authentication & Session Management
   Handles user login, logout, and localStorage
   ======================================== */

// ========================================
// Storage Manager Class
// ========================================

/**
 * Manages localStorage for user session data
 */
class StorageManager {
    /**
     * Set user data in localStorage
     * @param {object} userData - User object from API
     */
    static setUser(userData) {
        if (!userData) return;
        localStorage.setItem('user_id', userData.id || '');
        localStorage.setItem('employee_id', userData.employee_id || '');
        localStorage.setItem('user_name', userData.name || '');
        localStorage.setItem('user_role', userData.role || '');
        localStorage.setItem('user_position', userData.position || '');
    }

    /**
     * Get complete user object from localStorage
     * @returns {object} - User object
     */
    static getUser() {
        return {
            id: localStorage.getItem('user_id'),
            employee_id: localStorage.getItem('employee_id'),
            name: localStorage.getItem('user_name'),
            role: localStorage.getItem('user_role'),
            position: localStorage.getItem('user_position')
        };
    }

    /**
     * Get user ID
     * @returns {string} - User ID
     */
    static getUserId() {
        return localStorage.getItem('user_id');
    }

    /**
     * Get employee ID
     * @returns {string} - Employee ID
     */
    static getEmployeeId() {
        return localStorage.getItem('employee_id');
    }

    /**
     * Get user name
     * @returns {string} - User name
     */
    static getUserName() {
        return localStorage.getItem('user_name');
    }

    /**
     * Get user role
     * @returns {string} - User role
     */
    static getUserRole() {
        return localStorage.getItem('user_role');
    }

    /**
     * Get user position
     * @returns {string} - User position
     */
    static getUserPosition() {
        return localStorage.getItem('user_position');
    }

    /**
     * Check if user is logged in
     * @returns {boolean} - True if logged in
     */
    static isLoggedIn() {
        return !!localStorage.getItem('user_id');
    }

    /**
     * Clear all user data from localStorage
     */
    static clear() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('employee_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_position');
        localStorage.removeItem('leave_history_cache');
        localStorage.removeItem('deployment_cache');
    }

    /**
     * Cache data with a key
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     */
    static setCache(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Get cached data
     * @param {string} key - Cache key
     * @returns {any} - Cached data or null
     */
    static getCache(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        try {
            return JSON.parse(cached);
        } catch {
            return null;
        }
    }

    /**
     * Clear cache for a specific key
     * @param {string} key - Cache key
     */
    static clearCache(key) {
        localStorage.removeItem(key);
    }
}

// ========================================
// User Display & Initialization
// ========================================

/**
 * Initialize and display user information in top bar
 */
function initializeUserDisplay() {
    const userName = StorageManager.getUserName();
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (userNameDisplay) {
        const empId = StorageManager.getEmployeeId();
        userNameDisplay.textContent = userName || ('Employee ' + empId) || 'User';
    }
}

/**
 * Check authentication and redirect if not logged in
 * @param {string} redirectUrl - URL to redirect if not logged in (default: login page)
 */
function requireAuth(redirectUrl = '/hrms/index.html') {
    if (!StorageManager.isLoggedIn()) {
        window.location.href = redirectUrl;
    }
}

/**
 * Redirect user based on their role
 * @param {string} userRole - The user's role
 */
function redirectByRole(userRole) {
    const redirectMap = {
        'hr': '/hrms/hr/dashboard.php',
        'coordinator': '/hrms/coordinator/dashboard.php',
        'team_leader': '/hrms/teamleader/tl-dashboard.php',
        'employee': '/hrms/employee/dashboard.php'
    };

    const url = redirectMap[userRole] || '/hrms/employee/dashboard.php';
    window.location.href = url;
}

// ========================================
// Logout Handler
// ========================================

/**
 * Handle user logout
 * @param {string} redirectUrl - URL to redirect after logout
 */
function handleLogout(redirectUrl = '/hrms/index.html') {
    // Clear localStorage
    StorageManager.clear();

    // Optional: Call logout API
    fetch(API_BASE + 'logout.php', { credentials: 'include' })
        .catch(err => console.log('Logout API error:', err));

    // Redirect to login page
    window.location.href = redirectUrl;
}

// ========================================
// Login Helper Functions
// ========================================

/**
 * Perform login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - API response
 */
async function performLogin(email, password) {
    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    const response = await apiCall('login_check.php', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (!response.success) {
        throw new Error(response.message || 'Login failed.');
    }

    // Store user data
    StorageManager.setUser(response.user);

    return response;
}

// ========================================
// Initialize on Page Load
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user display if page has the element
    if (document.getElementById('userNameDisplay')) {
        initializeUserDisplay();
    }

    // Setup logout buttons
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });
});
