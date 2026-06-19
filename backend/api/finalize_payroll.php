<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$periodStart = $data['period_start'] ?? null;
$periodEnd = $data['period_end'] ?? null;
$payrollData = $data['data'] ?? [];

if (!$periodStart || !$periodEnd || empty($payrollData)) {
    echo json_encode(['success' => false, 'message' => 'Missing required data']);
    exit;
}

try {
    // Delete existing payroll for this period
    $stmt = $pdo->prepare("DELETE FROM payroll WHERE period_start = ? AND period_end = ?");
    $stmt->execute([$periodStart, $periodEnd]);
    
    // Insert new payroll records
    foreach ($payrollData as $item) {
        $stmt = $pdo->prepare("
            INSERT INTO payroll (employee_id, period_start, period_end, days_present, gross_pay, sss, philhealth, pagibig, withholding_tax, net_pay, finalized)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ");
        $stmt->execute([
            $item['employee_id'],
            $periodStart,
            $periodEnd,
            $item['days_present'],
            $item['gross'],
            $item['sss'],
            $item['philhealth'],
            $item['pagibig'],
            $item['withholding_tax'],
            $item['net']
        ]);
    }
    
    echo json_encode(['success' => true, 'message' => 'Payroll finalized successfully']);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>