<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'hrms_db';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success'=>false, 'message'=>'DB connection failed']);
    exit;
}
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success'=>false, 'message'=>'No input data. Raw: '.file_get_contents('php://input')]);
    exit;
}
$employee_name = trim($input['employee_name'] ?? '');
$employee_id = trim($input['employee_id'] ?? '');
$position = trim($input['position'] ?? '');
$type = trim($input['type'] ?? '');
$start_date = $input['start_date'] ?? '';
$end_date = $input['end_date'] ?? '';
$reason = trim($input['reason'] ?? '');

if (!$employee_name || !$employee_id || !$position || !$type || !$start_date || !$end_date) {
    echo json_encode(['success'=>false, 'message'=>"Missing fields: name=$employee_name, id=$employee_id, pos=$position, type=$type, start=$start_date, end=$end_date"]);
    exit;
}
// Ensure columns exist
$conn->query("ALTER TABLE `leave_requests` ADD COLUMN IF NOT EXISTS `employee_name` VARCHAR(100) NULL");
$conn->query("ALTER TABLE `leave_requests` ADD COLUMN IF NOT EXISTS `position` VARCHAR(100) NULL");
$stmt = $conn->prepare("INSERT INTO leave_requests (employee_name, employee_id, position, type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");
if (!$stmt) {
    echo json_encode(['success'=>false, 'message'=>'Prepare error: '.$conn->error]);
    exit;
}
$stmt->bind_param("sssssss", $employee_name, $employee_id, $position, $type, $start_date, $end_date, $reason);
if ($stmt->execute()) {
    echo json_encode(['success'=>true, 'message'=>'Leave request submitted']);
} else {
    echo json_encode(['success'=>false, 'message'=>'Execute error: '.$stmt->error]);
}
$stmt->close();
$conn->close();
?>