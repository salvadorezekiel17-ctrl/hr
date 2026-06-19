<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$start_date = $data['start_date'] ?? null;
$end_date = $data['end_date'] ?? null;

if (!$start_date || !$end_date) {
    echo json_encode(['success' => false, 'message' => 'Start date and end date required']);
    exit;
}

$stmt = $pdo->query("SELECT id, name, daily_rate FROM employees");
$employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

$results = [];
foreach ($employees as $emp) {
    // Count days present in this period
    $stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT DATE(timestamp)) as days_present 
        FROM attendance 
        WHERE employee_id = ? AND DATE(timestamp) BETWEEN ? AND ?
    ");
    $stmt->execute([$emp['id'], $start_date, $end_date]);
    $days = $stmt->fetch(PDO::FETCH_ASSOC);
    $daysPresent = $days['days_present'] ?? 0;
    
    // Gross pay for this period = daily rate × days present
    $gross = $emp['daily_rate'] * $daysPresent;
    
    // SIMPLE DEDUCTIONS based on actual gross (not monthly)
    $sss = $gross * 0.05;           // 5% of gross
    $philhealth = $gross * 0.025;   // 2.5% of gross
    $pagibig = $gross * 0.02;       // 2% of gross (capped at 200 per month, so semi-monthly cap is 100)
    if ($pagibig > 100) $pagibig = 100;  // Cap at 100 per semi-monthly period
    
    // Simple withholding tax (0% if gross < 20000, 10% above)
    $wt = 0;
    if ($gross > 20000) {
        $wt = ($gross - 20000) * 0.10;
    }
    
    $net = $gross - ($sss + $philhealth + $pagibig + $wt);
    
    $results[] = [
        'employee_id' => $emp['id'],
        'name' => $emp['name'],
        'daily_rate' => (float)$emp['daily_rate'],
        'days_present' => $daysPresent,
        'gross' => round($gross, 2),
        'sss' => round($sss, 2),
        'philhealth' => round($philhealth, 2),
        'pagibig' => round($pagibig, 2),
        'withholding_tax' => round($wt, 2),
        'net' => round($net, 2)
    ];
}

echo json_encode(['success' => true, 'data' => $results]);
?>