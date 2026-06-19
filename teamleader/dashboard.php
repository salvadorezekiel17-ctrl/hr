<?php
require_once __DIR__ . '/../backend/auth_check.php';

// Team Leader-only access
if ($user_role !== 'team_leader') {
    header('Location: /hrms/login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TL Dashboard | CKL Construction</title>
    <link rel="icon" type="image/x-icon" href="../CKL-1.PNG">
    <link rel="stylesheet" href="../css/teamleader-dashboard.css">
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header"><h2>CKL HRMS</h2><p>Construction Services</p></div>
        <ul class="nav-menu">
            <li class="nav-item active"><a href="tl-dashboard.php">Dashboard</a></li>
            <li class="nav-item"><a href="attendance-history.html">My Attendance</a></li>
            <li class="nav-item"><a href="for-validation.html">For Validation</a></li>
            <li class="nav-item"><a href="deployment-history.html">Past Deployments</a></li>
            <li class="nav-item"><a href="file-leave.html">File a Leave</a></li>
            <li class="nav-item"><a href="payslips.html">My Payslips</a></li>
        </ul>
    </div>
    <div class="main-content">
        <div class="top-bar">
            <div class="page-title">Team Leader Dashboard</div>
            <div class="user-info">
                <span>Team Leader (Alpha)</span>
                <a href="/hrms/change-password.html" class="change-password-btn">Change Password</a>
                <a href="/hrms/backend/api/logout.php" class="logout-btn">Logout</a>
            </div>
        </div>
        <div class="container">
            <!-- Team Members Summary -->
            <div class="panel">
                <h2>My Team (Alpha) – Attendance Summary (Last 30 days)
                    <button class="view-more" id="viewMoreAttendanceBtn">View more</button>
                </h2>
                <div id="teamMembersList" class="team-grid"></div>
            </div>
            <!-- Active Deployments (Needs Validation) -->
            <div class="panel">
                <h2>Active Deployments (Needs Validation)
                    <button class="view-more" id="viewAllDeploymentsBtn">View all</button>
                </h2>
                <div id="deploymentsList"></div>
            </div>
            <!-- Pending Leave Requests (read-only) -->
            <div class="panel">
                <h2>Pending Leave Requests (Team Members)</h2>
                <div id="pendingLeaves"></div>
                <div class="info-note">Leave approval is handled by HR. Team Leaders can only view pending requests.</div>
            </div>
        </div>
    </div>

    <!-- Modal for detailed attendance view -->
    <div id="attendanceModal" class="modal">
        <div class="modal-content">
            <h3>Detailed Attendance Report</h3>
            <div id="attendanceDetail"></div>
            <div class="modal-buttons">
                <button class="confirm-btn" onclick="closeAttendanceModal()">Close</button>
            </div>
        </div>
    </div>

    <script src="../js/teamleader-dashboard.js"></script>
</body>
</html>