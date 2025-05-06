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
        
        // Extract prolific ID and browser info
        $prolific_id = isset($data['prolific_id']) ? mysqli_real_escape_string($conn, $data['prolific_id']) : '';
        $browser_info = isset($data['browser_info']) ? mysqli_real_escape_string($conn, json_encode($data['browser_info'])) : '';
        
        if (empty($prolific_id)) {
            throw new Exception('Missing required prolific ID');
        }

        log_debug("Processing visit for participant: {$prolific_id}");
        
        // Try to get a random teaching text from the database - FIXED TABLE NAME HERE
        $random_teaching_sql = "SELECT tt.id, tt.participant_id, tt.teaching_text, tt.color_pair, p.prolific_id as teacher_prolific_id
                               FROM SS_teaching_texts_TEACH tt
                               JOIN SS_participants_TEACH p ON tt.participant_id = p.id
                               ORDER BY RAND() LIMIT 1";
        $random_teaching_result = mysqli_query($conn, $random_teaching_sql);
        
        if (!$random_teaching_result || mysqli_num_rows($random_teaching_result) == 0) {
            throw new Exception('No teaching texts available for pupil assignment');
        }
        
        $teaching_row = mysqli_fetch_assoc($random_teaching_result);
        $teacher_text_id = $teaching_row['id'];
        $teacher_participant_id = $teaching_row['participant_id'];
        $teaching_text = $teaching_row['teaching_text'];
        $color_pair = $teaching_row['color_pair'];
        $teacher_prolific_id = $teaching_row['teacher_prolific_id'];
        
        log_debug("Assigned teacher text ID: {$teacher_text_id} from teacher ID: {$teacher_participant_id}");
        
        // Check if this pupil prolific ID already exists
        $check_sql = "SELECT id FROM SS_participants_Pupil WHERE prolific_id = ?";
        $check_stmt = mysqli_prepare($conn, $check_sql);
        mysqli_stmt_bind_param($check_stmt, "s", $prolific_id);
        mysqli_stmt_execute($check_stmt);
        mysqli_stmt_store_result($check_stmt);
        
        if (mysqli_stmt_num_rows($check_stmt) > 0) {
            // Participant exists, update their status if they're returning
            mysqli_stmt_bind_result($check_stmt, $participant_id);
            mysqli_stmt_fetch($check_stmt);
            
            $update_sql = "UPDATE SS_participants_Pupil SET status = 'started' WHERE prolific_id = ? AND status = 'abandoned'";
            $update_stmt = mysqli_prepare($conn, $update_sql);
            mysqli_stmt_bind_param($update_stmt, "s", $prolific_id);
            mysqli_stmt_execute($update_stmt);
            
            log_debug("Returning participant: {$prolific_id}, participant_id: {$participant_id}");
            
            echo json_encode([
                'success' => true, 
                'message' => 'Returning participant logged',
                'teacher_text_id' => $teacher_text_id,
                'teacher_participant_id' => $teacher_participant_id,
                'teaching_text' => $teaching_text,
                'color_pair' => $color_pair,
                'teacher_prolific_id' => $teacher_prolific_id
            ]);
        } else {
            // New participant, insert into database with teacher reference
            $sql = "INSERT INTO SS_participants_Pupil (prolific_id, first_visit_time, status, browser_info, teacher_text_id, teacher_participant_id) 
                   VALUES (?, NOW(), 'started', ?, ?, ?)";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "ssii", $prolific_id, $browser_info, $teacher_text_id, $teacher_participant_id);
            
            if (mysqli_stmt_execute($stmt)) {
                $participant_id = mysqli_insert_id($conn);
                log_debug("New participant created: {$prolific_id}, participant_id: {$participant_id}");
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Participant visit logged successfully',
                    'teacher_text_id' => $teacher_text_id,
                    'teacher_participant_id' => $teacher_participant_id,
                    'teaching_text' => $teaching_text,
                    'color_pair' => $color_pair,
                    'teacher_prolific_id' => $teacher_prolific_id
                ]);
            } else {
                throw new Exception('Error logging visit: ' . mysqli_error($conn));
            }
        }
    } catch (Exception $e) {
        // Log the error
        log_debug('Visit logging error: ' . $e->getMessage());
        
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
