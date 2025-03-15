<?php
// Include database configuration - updated path
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
            // Invalid JSON data
            throw new Exception('Invalid JSON data');
        }
        
        // Extract participant ID and experiment data
        $participant_id = isset($data['participant_id']) ? mysqli_real_escape_string($conn, $data['participant_id']) : '';
        $experiment_data = isset($data['experiment_data']) ? json_encode($data['experiment_data']) : '';
        
        if (empty($participant_id) || empty($experiment_data)) {
            throw new Exception('Missing required data');
        }
        
        // Start transaction for data integrity
        mysqli_begin_transaction($conn);
        
        // Insert metadata into participants table
        $sql = "INSERT INTO participants (participant_id, date_completed) VALUES (?, NOW())";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $participant_id);
        
        if (mysqli_stmt_execute($stmt)) {
            $participant_db_id = mysqli_insert_id($conn);
            
            // Extract teaching text if available
            $teaching_text = '';
            foreach ($data['experiment_data'] as $trial) {
                if (isset($trial['task']) && $trial['task'] === 'teaching_text' && isset($trial['teaching_text'])) {
                    $teaching_text = $trial['teaching_text'];
                    break;
                }
            }
            
            // Insert trial data into trials table
            $sql = "INSERT INTO trials (participant_id, trial_data) VALUES (?, ?)";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "is", $participant_db_id, $experiment_data);
            
            if (mysqli_stmt_execute($stmt)) {
                // If teaching text exists, also save it to the teaching_texts table
                if (!empty($teaching_text)) {
                    $sql = "INSERT INTO teaching_texts (participant_id, teaching_text) VALUES (?, ?)";
                    $stmt = mysqli_prepare($conn, $sql);
                    mysqli_stmt_bind_param($stmt, "is", $participant_db_id, $teaching_text);
                    mysqli_stmt_execute($stmt);
                }
                
                // Commit transaction
                mysqli_commit($conn);
                echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
            } else {
                // Rollback on error
                mysqli_rollback($conn);
                throw new Exception('Error saving trial data: ' . mysqli_error($conn));
            }
        } else {
            throw new Exception('Error saving participant data: ' . mysqli_error($conn));
        }
    } catch (Exception $e) {
        // Rollback transaction if active
        if (mysqli_get_connection_stats($conn)['active_transactions'] > 0) {
            mysqli_rollback($conn);
        }
        
        // Log the error
        error_log('Database error: ' . $e->getMessage());
        
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