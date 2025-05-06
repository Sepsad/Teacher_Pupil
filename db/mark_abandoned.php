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

// Function to log debug messages
function log_debug($message) {
    error_log('[Pupil-Task Debug] ' . $message);
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
        
        // Extract prolific ID and reason for abandonment
        $prolific_id = isset($data['prolific_id']) ? mysqli_real_escape_string($conn, $data['prolific_id']) : '';
        $reason = isset($data['reason']) ? mysqli_real_escape_string($conn, $data['reason']) : 'unknown';
        
        if (empty($prolific_id)) {
            throw new Exception('Missing required prolific ID');
        }

        log_debug("Marking participant as abandoned: {$prolific_id}, reason: {$reason}");
        
        // Update participant status to abandoned
        $update_sql = "UPDATE SS_participants_Pupil SET status = 'abandoned' WHERE prolific_id = ? AND status = 'started'";
        $update_stmt = mysqli_prepare($conn, $update_sql);
        mysqli_stmt_bind_param($update_stmt, "s", $prolific_id);
        
        if (mysqli_stmt_execute($update_stmt)) {
            $affected_rows = mysqli_stmt_affected_rows($update_stmt);
            log_debug("Updated {$affected_rows} rows for participant: {$prolific_id}");
            
            echo json_encode([
                'success' => true, 
                'message' => 'Participant marked as abandoned',
                'affected_rows' => $affected_rows
            ]);
        } else {
            throw new Exception('Error marking participant as abandoned: ' . mysqli_error($conn));
        }
        
        mysqli_stmt_close($update_stmt);
    } catch (Exception $e) {
        // Log the error
        log_debug('Error marking participant as abandoned: ' . $e->getMessage());
        
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