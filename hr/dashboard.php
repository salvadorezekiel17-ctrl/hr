<?php
require_once __DIR__ . '/../backend/auth_check.php';

// HR-only access
if ($user_role !== 'hr') {
    header('Location: /hrms/login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HR Dashboard | CKL Construction</title>
    <link rel="icon" type="image/x-icon" href="../CKL-1.PNG">
    <link rel="stylesheet" href="../css/hr-dashboard.css">
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header"><h2>CKL HRMS</h2><p>Construction Services</p></div>
        <ul class="nav-menu">
            <li class="nav-item active"><a href="dashboard.php">Dashboard</a></li>
            <li class="nav-item"><a href="employees.html">Employee Directory</a></li>
            <li class="nav-item"><a href="biometric-logs.html">Biometric Logs</a></li>
            <li class="nav-item"><a href="field-deployments.html">Field Deployments</a></li>
            <li class="nav-item"><a href="leave-requests.html">Leave Requests</a></li>
            <li class="nav-item"><a href="payroll.html">Payroll</a></li>
            <li class="nav-item"><a href="reports.html">Reports</a></li>
            <li class="nav-item"><a href="hiring.html">Hiring</a></li>
            <li class="nav-item"><a href="create-account.html">Create New Account</a></li>
            <li class="nav-item"><a href="offboarding-history.html">Offboarding History</a></li>
        </ul>
    </div>
    <div class="main-content">
        <div class="top-bar">
            <div class="page-title">Dashboard</div>
            <div class="user-info">
                <button class="reset-btn" id="resetAssignmentsBtn">Reset Daily Assignments</button>
                <div class="dropdown">
                    <button class="dropbtn" id="dropbtn">
                        <span id="userNameDisplay">HR Administrator</span> <span style="font-size:0.8rem;">▼</span>
                    </button>
                    <div id="dropdownMenu" class="dropdown-content">
                        <a href="../change-password.html">Change Password</a>
                        <a href="../backend/api/logout.php">Logout</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="metrics">
                <div class="card" id="totalEmployeesCard"><h3>Total Employees</h3><div class="number" id="totalEmployees">--</div></div>
                <div class="card" id="presentTodayCard"><h3>Present Today</h3><div class="number" id="presentToday">--</div></div>
                <div class="card" id="onLeaveCard"><h3>On Leave</h3><div class="number" id="onLeaveCount">--</div></div>
                <div class="card" id="activeDeploymentsCard"><h3>Active Deployments</h3><div class="number" id="activeDeployments">0</div></div>
            </div>
            <div class="dashboard-row">
                <div class="panel">
                    <h2>Resource Pool – Available Employees</h2>
                    <div id="availableEmployeesList"></div>
                    <a href="employees.html" class="view-all">View All →</a>
                </div>
                <div class="panel">
                    <h2>Leave Requests</h2>
                    <div id="leaveRequestsContainer"></div>
                    <a href="leave-requests.html" class="view-all">View All →</a>
                </div>
            </div>
        </div>
    </div>

    <div id="assignModal" class="modal">
        <div class="modal-content">
            <h3>Assign to Team</h3>
            <p id="assignEmployeeName"></p>
            <select id="teamSelect">
                <option value="Alpha">Team Alpha</option>
                <option value="Bravo">Team Bravo</option>
                <option value="Charlie">Team Charlie</option>
                <option value="Delta">Team Delta</option>
                <option value="Echo">Team Echo</option>
                <option value="Foxtrot">Team Foxtrot</option>
                <option value="Golf">Team Golf</option>
            </select>
            <div class="modal-buttons">
                <button class="cancel-btn" onclick="closeAssignModal()">Cancel</button>
                <button class="confirm-btn" id="confirmAssignBtn">Assign</button>
            </div>
        </div>
    </div>

    <script src="../js/hr-dashboard.js"></script>
</body>
</html>