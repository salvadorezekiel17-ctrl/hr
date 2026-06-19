<?php
header('Content-Type: application/json');
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'hrms_db';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection failed']);
    exit;
}
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'No input']);
    exit;
}
// Accept both 'id' and 'job_id'
$id = $input['id'] ?? $input['job_id'] ?? null;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Missing id or job_id', 'received' => $input]);
    exit;
}
$updates = [];
$params = [];
$types = '';
if (isset($input['status'])) {
    $updates[] = "status = ?";
    $params[] = $input['status'];
    $types .= 's';
}
if (isset($input['morning_team'])) {
    $updates[] = "morning_team = ?";
    $params[] = $input['morning_team'];
    $types .= 's';
}
if (isset($input['night_team'])) {
    $updates[] = "night_team = ?";
    $params[] = $input['night_team'];
    $types .= 's';
}
if (empty($updates)) {
    echo json_encode(['success' => false, 'message' => 'Nothing to update']);
    exit;
}
$params[] = $id;
$types .= 's';
$sql = "UPDATE job_orders SET " . implode(', ', $updates) . " WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare error: ' . $conn->error]);
    exit;
}
$stmt->bind_param($types, ...$params);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Updated']);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>