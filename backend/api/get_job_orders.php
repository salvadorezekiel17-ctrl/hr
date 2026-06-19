<?php
header('Content-Type: application/json');
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'hrms_db';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success'=>false, 'message'=>'DB connection failed']);
    exit;
}
$sql = "SELECT id, ticket_no, location, start_date, assigned_team, status, project_name, activity_type FROM job_orders WHERE status != 'Completed' ORDER BY created_at DESC";
$result = $conn->query($sql);
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode(['success'=>true, 'data'=>$data]);
$conn->close();
?>