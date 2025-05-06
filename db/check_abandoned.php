<?php
// Include database configuration
require_once 'config.php';

// Function to log debug messages
function log_debug($message) {
    error_log('[Pupil-Task Debug] ' . $message);
}

try {
    // Set the timeout threshold (4 hours in seconds)
    $timeout_seconds = 4 * 60 * 60;
    
    // Calculate the cutoff time
    $cutoff_time = date('Y-m-d H:i:s', time() - $timeout_seconds);
    
    log_debug("Checking for abandoned sessions older than: " . $cutoff_time);
    
    // Find sessions that are still 'started' but haven't been completed within the timeout period
    $find_sql = "SELECT id, prolific_id, first_visit_time FROM SS_participants_Pupil 
                WHERE status = 'started' 
                AND first_visit_time < ?";
    
    $find_stmt = mysqli_prepare($conn, $find_sql);
    mysqli_stmt_bind_param($find_stmt, "s", $cutoff_time);
    mysqli_stmt_execute($find_stmt);
    $result = mysqli_stmt_get_result($find_stmt);
    
    $abandoned_count = 0;
    $abandoned_ids = [];
    
    // Process each abandoned session
    while ($row = mysqli_fetch_assoc($result)) {
        $participant_id = $row['id'];
        $prolific_id = $row['prolific_id'];
        $first_visit_time = $row['first_visit_time'];
        
        log_debug("Marking as abandoned: ID={$participant_id}, Prolific ID={$prolific_id}, Started at: {$first_visit_time}");
        
        // Update status to 'abandoned'
        $update_sql = "UPDATE SS_participants_Pupil SET status = 'abandoned' WHERE id = ?";
        $update_stmt = mysqli_prepare($conn, $update_sql);
        mysqli_stmt_bind_param($update_stmt, "i", $participant_id);
        
        if (mysqli_stmt_execute($update_stmt)) {
            $abandoned_count++;
            $abandoned_ids[] = $prolific_id;
        } else {
            log_debug("Failed to update status for participant ID: {$participant_id}");
        }
        
        mysqli_stmt_close($update_stmt);
    }
    
    mysqli_stmt_close($find_stmt);
    
    // Output results
    echo "Checked for abandoned sessions.\n";
    echo "Found and marked {$abandoned_count} abandoned sessions.\n";
    
    if ($abandoned_count > 0) {
        echo "Abandoned Prolific IDs: " . implode(", ", $abandoned_ids) . "\n";
        log_debug("Marked {$abandoned_count} sessions as abandoned: " . implode(", ", $abandoned_ids));
    } else {
        echo "No abandoned sessions found.\n";
        log_debug("No abandoned sessions found.");
    }
    
} catch (Exception $e) {
    $error_message = "Error checking for abandoned sessions: " . $e->getMessage();
    echo $error_message . "\n";
    log_debug($error_message);
}

// Close database connection
mysqli_close($conn);
?>