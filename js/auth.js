/* ========================================
   AUTH.JS - Authentication & Session Management
   ======================================== */

class StorageManager {
    static setUser(userData) {
        if (!userData) return;
        localStorage.setItem('user_id', userData.id || '');
        localStorage.setItem('employee_id', userData.employee_id || '');
        localStorage.setItem('user_name', userData.name || '');
        localStorage.setItem('user_role', userData.role || '');
        localStorage.setItem('user_position', userData.position || '');
    }

    static getUser() {
        return {
            id: localStorage.getItem('user_id'),
            employee_id: localStorage.getItem('employee_id'),
            name: localStorage.getItem('user_name'),
            role: localStorage.getItem('user_role'),
            position: localStorage.getItem('user_position')
        };
    }

    static getUserId() { return localStorage.getItem('user_id'); }
    static getEmployeeId() { return localStorage.getItem('employee_id'); }
    static getUserName() { return localStorage.getItem('user_name'); }
    static getUserRole() { return localStorage.getItem('user_role'); }
    static getUserPosition() { return localStorage.getItem('user_position'); }
    static isLoggedIn() { return !!localStorage.getItem('user_id'); }

    static clear() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('employee_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_position');
        localStorage.removeItem('leave_history_cache');
        localStorage.removeItem('deployment_cache');
    }

    static setCache(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static getCache(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        try { return JSON.parse(cached); } catch { return null; }
    }
}

function initializeUserDisplay() {
    const userName = StorageManager.getUserName();
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = userName || 'User';
    }
}

function requireAuth(redirectUrl = '/hrms/index.html') {
    if (!StorageManager.isLoggedIn()) {
        window.location.href = redirectUrl;
    }
}

function redirectByRole(userRole) {
    const redirectMap = {
        'hr': '/hrms/hr/dashboard.php',
        'coordinator': '/hrms/coordinator/dashboard.php',
        'team_leader': '/hrms/teamleader/tl-dashboard.php',
        'employee': '/hrms/employee/dashboard.php'
    };
    window.location.href = redirectMap[userRole] || '/hrms/employee/dashboard.php';
}

function handleLogout(redirectUrl = '/hrms/index.html') {
    StorageManager.clear();
    fetch(API_BASE + 'logout.php', { credentials: 'include' }).catch(() => {});
    window.location.href = redirectUrl;
}

async function performLogin(email, password) {
    if (!email || !password) throw new Error('Email and password are required.');
    const response = await apiCall('login_check.php', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    if (!response.success) throw new Error(response.message || 'Login failed.');
    StorageManager.setUser(response.user);
    return response;
}

// ========================================
// DROPDOWN TOGGLE – FIXED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Display user name
    if (document.getElementById('userNameDisplay')) {
        initializeUserDisplay();
    }

    // Toggle dropdown on button click
    const dropbtn = document.getElementById('dropbtn');
    if (dropbtn) {
        dropbtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = document.getElementById('dropdownMenu');
            menu.classList.toggle('show');
        });
    }

    // ---- CLOSE DROPDOWN ONLY WHEN CLICKING OUTSIDE ----
    window.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                // If click is on the dropdown button or inside the dropdown itself, do NOT close
                if (e.target.id === 'dropbtn' || dropdown.contains(e.target)) {
                    return;
                }
                dropdown.classList.remove('show');
            }
        });
    });

    // ---- SET USER NAME ----
    const userName = localStorage.getItem('user_name') || 'User';
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.innerText = userName;

    // ---- HANDLE LOGOUT LINK DIRECTLY (to prevent any interference) ----
    const logoutLink = document.querySelector('#dropdownMenu a[href*="logout.php"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
});

// Make handleLogout globally available
window.handleLogout = handleLogout;