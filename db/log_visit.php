<?php
// Include database configuration
require_once 'config.php';

// Set headers to handle CORS and specify JSON response
header('Access-Control-Allow-Origin: *');  // Adjust this in production to your actual domain
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// For preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get raw POST data
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if ($data === null) {
            throw new Exception('Invalid JSON data');
        }
        
        // Extract prolific ID and browser info
        $prolific_id = isset($data['prolific_id']) ? mysqli_real_escape_string($conn, $data['prolific_id']) : '';
        $browser_info = isset($data['browser_info']) ? mysqli_real_escape_string($conn, json_encode($data['browser_info'])) : '';
        
        if (empty($prolific_id)) {
            throw new Exception('Missing required prolific ID');
        }
        
        // Check if this prolific ID already exists
        $check_sql = "SELECT id FROM participants WHERE prolific_id = ?";
        $check_stmt = mysqli_prepare($conn, $check_sql);
        mysqli_stmt_bind_param($check_stmt, "s", $prolific_id);
        mysqli_stmt_execute($check_stmt);
        mysqli_stmt_store_result($check_stmt);
        
        if (mysqli_stmt_num_rows($check_stmt) > 0) {
            // Participant exists, update their status if they're returning
            $update_sql = "UPDATE participants SET status = 'started' WHERE prolific_id = ? AND status = 'abandoned'";
            $update_stmt = mysqli_prepare($conn, $update_sql);
            mysqli_stmt_bind_param($update_stmt, "s", $prolific_id);
            mysqli_stmt_execute($update_stmt);
            
            echo json_encode(['success' => true, 'message' => 'Returning participant logged']);
        } else {
            // New participant, insert into database
            $sql = "INSERT INTO participants (prolific_id, first_visit_time, status, browser_info) VALUES (?, NOW(), 'started', ?)";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "ss", $prolific_id, $browser_info);
            
            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(['success' => true, 'message' => 'Visit logged successfully']);
            } else {
                throw new Exception('Error logging visit: ' . mysqli_error($conn));
            }
        }
        
    } catch (Exception $e) {
        // Log the error
        error_log('Visit logging error: ' . $e->getMessage());
        
        // Return error to client
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    // Not a POST request
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Close database connection
mysqli_close($conn);
?>
