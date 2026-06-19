<?php
require_once __DIR__ . '/../backend/auth_check.php';

// Employee-only access
if ($user_role !== 'employee') {
    header('Location: /hrms/login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Dashboard</title>
    <link rel="icon" type="image/x-icon" href="../CKL-1.PNG">
    <link rel="stylesheet" href="../css/employee-dashboard.css">
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header"><h2>CKL HRMS</h2><p>Construction Services</p></div>
        <ul class="nav-menu">
            <li class="nav-item active"><a href="dashboard.php">Dashboard</a></li>
            <li class="nav-item"><a href="attendance.html">My Attendance</a></li>
            <li class="nav-item"><a href="payslips.html">My Payslip</a></li>
            <li class="nav-item"><a href="deployment-history.html">Deployment</a></li>
            <li class="nav-item"><a href="leave-requests.html">File a Leave</a></li>
        </ul>
    </div>
    <div class="main-content">
        <div class="top-bar">
            <div class="page-title">Dashboard</div>
            <div class="user-info">
                <div class="dropdown">
                    <button class="dropbtn" onclick="toggleDropdown()">
                        <span id="userNameDisplay">Employee</span> <span style="font-size:0.8rem;">▼</span>
                    </button>
                    <div id="dropdownMenu" class="dropdown-content">
                        <a href="/hrms/change-password.html">Change Password</a>
                        <a href="/hrms/backend/api/logout.php">Logout</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="cards">
                <div class="card">
                    <h3>Days Present (this month)</h3>
                    <div class="number" id="daysPresent">0</div>
                    <div class="sub">This month</div>
                </div>
                <div class="card">
                    <h3>Pending Leave Requests</h3>
                    <div class="number pending-count" id="pendingCount">0</div>
                    <div class="sub">Awaiting approval</div>
                </div>
                <div class="card">
                    <h3>Total Leaves Taken</h3>
                    <div class="number" id="totalLeaves">0</div>
                    <div class="sub">All time</div>
                </div>
            </div>

            <div class="panel">
                <h2>Recent Leave History</h2>
                <div style="overflow-x: auto;">
                    <table>
                        <thead><tr><th>Type</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
                        <tbody id="recentHistoryBody">
                            <tr><td colspan="4">No leave history found.</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/employee-dashboard.js"></script>
</body>
</html>