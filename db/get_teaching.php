<?php
// Include database configuration
require_once 'config.php';

// Set headers to handle CORS and specify JSON response
header('Access-Control-Allow-Origin: *');  // Adjust this in production
header('Content-Type: application/json');

// For debugging
error_log('get_teaching.php: Request received');

try {
    // Query to get a random teaching text from the database - FIXED TABLE NAME
    $sql = "SELECT tt.teaching_text, tt.color_pair, p.prolific_id 
           FROM SS_teaching_texts_TEACH tt
           JOIN SS_participants_TEACH p ON tt.participant_id = p.id
           ORDER BY RAND() 
           LIMIT 1";
    
    error_log('get_teaching.php: Executing query: ' . $sql);
    $result = mysqli_query($conn, $sql);
    
    if (!$result) {
        error_log('get_teaching.php: Query failed: ' . mysqli_error($conn));
        throw new Exception('Query failed: ' . mysqli_error($conn));
    }
    
    // Check if any teaching text was found
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        error_log('get_teaching.php: Teaching text found for teacher ID: ' . $row['prolific_id']);
        echo json_encode([
            'success' => true,
            'teaching_text' => $row['teaching_text'],
            'color_pair' => $row['color_pair'],
            'teacher_id' => $row['prolific_id']
        ]);
    } else {
        // No teaching text found, return default message
        error_log('get_teaching.php: No teaching texts available in the database');
        echo json_encode([
            'success' => false,
            'message' => 'No teaching texts available in the database',
            'teaching_text' => 'No teacher instructions available at this time.'
        ]);
    }
} catch (Exception $e) {
    error_log('get_teaching.php: Exception: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'teaching_text' => 'An error occurred while retrieving teacher instructions.'
    ]);
}

// Close database connection
mysqli_close($conn);
error_log('get_teaching.php: Request completed');
?>
