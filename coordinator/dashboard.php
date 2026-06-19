<?php
require_once __DIR__ . '/../backend/auth_check.php';

// Coordinator-only access
if ($user_role !== 'coordinator') {
    header('Location: /hrms/login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coordinator Dashboard | CKL Construction</title>
    <link rel="icon" type="image/x-icon" href="../CKL-1.PNG">
    <link rel="stylesheet" href="../css/coordinator-dashboard.css">
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header"><h2>CKL HRMS</h2><p>Construction Services</p></div>
        <ul class="nav-menu">
            <li class="nav-item active"><a href="dashboard.php">Dashboard</a></li>
            <li class="nav-item"><a href="available-employees.html">Available Employees</a></li>
            <li class="nav-item"><a href="job-orders.html">Job Orders</a></li>
            <li class="nav-item"><a href="teams.html">Teams</a></li>
            <li class="nav-item"><a href="active-deployments.html">Active Deployments</a></li>
            <li class="nav-item"><a href="completed-job-orders.html">Completed Job Orders</a></li>
        </ul>
    </div>
    <div class="main-content">
        <div class="top-bar">
            <div class="page-title">Coordinator Dashboard</div>
            <div class="user-info">
                <!-- DROPDOWN (like HR) -->
                <div class="dropdown">
                    <button class="dropbtn" id="dropbtn">
                        <span id="userNameDisplay">Coordinator</span> <span style="font-size:0.8rem;">▼</span>
                    </button>
                    <div id="dropdownMenu" class="dropdown-content">
                        <a href="../change-password.html">Change Password</a>
                        <a href="../backend/api/logout.php">Logout</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="two-columns">
                <div class="column">
                    <div class="panel">
                        <h2>Available Employees</h2>
                        <div id="availableEmployeesList"></div>
                        <a href="available-employees.html" class="view-all">View All →</a>
                    </div>
                </div>
                <div class="column">
                    <div class="panel">
                        <h2>Teams & Assigned Members</h2>
                        <div id="teamsList"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Assign Modal -->
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
                <button class="cancel-btn" id="cancelAssignBtn">Cancel</button>
                <button class="confirm-btn" id="confirmAssignBtn">Assign</button>
            </div>
        </div>
    </div>

    <script src="../js/utils.js"></script>
    <script src="../js/auth.js"></script>
    <script src="../js/coordinator-dashboard.js"></script>
</body>
</html>