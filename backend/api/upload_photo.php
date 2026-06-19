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
$jobId = $_POST['job_id'] ?? null;
$photoType = $_POST['photo_type'] ?? null;
if (!$jobId || !$photoType || !isset($_FILES['photo'])) {
    echo json_encode(['success'=>false, 'message'=>'Missing parameters']);
    exit;
}
$uploadDir = dirname(__DIR__) . '/uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
$ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
$allowed = ['jpg','jpeg','png','gif'];
if (!in_array($ext, $allowed)) {
    echo json_encode(['success'=>false, 'message'=>'Only JPG, PNG, GIF allowed']);
    exit;
}
$filename = 'job_' . $jobId . '_' . $photoType . '_' . time() . '.' . $ext;
$targetPath = $uploadDir . $filename;
if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetPath)) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
    $serverHost = $_SERVER['HTTP_HOST'];
    $fileUrl = $protocol . "://" . $serverHost . '/hrms/backend/uploads/' . $filename;
    $column = ($photoType === 'before') ? 'before_photo' : 'after_photo';
    $stmt = $conn->prepare("UPDATE job_orders SET $column = ? WHERE id = ?");
    $stmt->bind_param("ss", $fileUrl, $jobId);
    if ($stmt->execute()) {
        echo json_encode(['success'=>true, 'message'=>'Photo uploaded', 'url'=>$fileUrl]);
    } else {
        echo json_encode(['success'=>false, 'message'=>'DB update failed: '.$stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['success'=>false, 'message'=>'Failed to move file']);
}
$conn->close();
?>