<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$employee_id = $data['employee_id'] ?? null;
$offboard_date = $data['offboard_date'] ?? null;
$reason = $data['reason'] ?? '';
$remarks = $data['remarks'] ?? '';

if (!$employee_id || !$offboard_date) {
    echo json_encode(['success' => false, 'message' => 'Employee ID and offboard date required']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO offboarding (employee_id, offboard_date, reason, remarks) VALUES (?, ?, ?, ?)");
    $stmt->execute([$employee_id, $offboard_date, $reason, $remarks]);
    echo json_encode(['success' => true, 'message' => 'Offboarding record saved']);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>