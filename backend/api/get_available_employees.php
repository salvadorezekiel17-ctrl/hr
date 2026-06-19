<?php
header('Content-Type: application/json');
require_once '../config/db.php';

// Assuming you have a `employees` table with `status` column
$stmt = $pdo->query("SELECT id, name, status FROM employees WHERE status = 'Active' AND current_team IS NULL");
$employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'data' => $employees]);
?>