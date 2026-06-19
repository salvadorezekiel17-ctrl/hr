<?php
header('Content-Type: application/json');

// Return dummy stats for now – replace with real DB queries later
echo json_encode([
    'success' => true,
    'available' => 4,
    'active' => 2,
    'teams' => 3
]);