<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$employee_id = $data['employee_id'] ?? null;
$team = $data['team'] ?? null;

if (!$employee_id || !$team) {
    echo json_encode(['success' => false, 'message' => 'Missing employee_id or team']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE employees SET current_team = ? WHERE id = ?");
    $stmt->execute([$team, $employee_id]);
    echo json_encode(['success' => true, 'message' => 'Employee assigned successfully']);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>