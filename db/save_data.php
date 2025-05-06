<?php
// Start output buffering to prevent any unwanted output
ob_start();

// Enable error reporting only to log file, not to output
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Function to handle clean JSON responses
function send_json_response($data) {
    // Clear any previous output that might have been generated
    ob_clean();
    
    // Set proper JSON headers
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Output the JSON data
    echo json_encode($data);
    exit;
}

// Log function to track execution
function log_debug($message) {
    error_log('[Pupil-Task Debug] ' . $message);
}

log_debug('Script started');

// Include database configuration
require_once 'config.php';

// For preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    send_json_response(["status" => "ok"]);
    exit;
}

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get raw POST data
        $json_data = file_get_contents('php://input');
        log_debug('Received data: ' . substr($json_data, 0, 100) . '...');
        
        $data = json_decode($json_data, true);
        
        if ($data === null) {
            // Invalid JSON data
            $json_error = json_last_error_msg();
            log_debug('JSON decode error: ' . $json_error);
            throw new Exception('Invalid JSON data: ' . $json_error);
        }
        
        // Extract prolific ID, experiment data, and participant type
        $prolific_id = isset($data['prolific_id']) ? mysqli_real_escape_string($conn, $data['prolific_id']) : '';
        $experiment_data_json = isset($data['experiment_data']) ? $data['experiment_data'] : '';
        $browser_info = isset($data['browser_info']) ? mysqli_real_escape_string($conn, json_encode($data['browser_info'])) : '';
        
        // Assume pupil by default for this version, since it's the pupil-only version
        $is_pupil = true;
        
        log_debug('Processing JSON data for ' . ($is_pupil ? 'pupil' : 'teacher') . ' participant: ' . $prolific_id);
        
        if (empty($prolific_id) || empty($experiment_data_json)) {
            throw new Exception('Missing required data: ' . 
                                (empty($prolific_id) ? 'prolific_id ' : '') . 
                                (empty($experiment_data_json) ? 'experiment_data' : ''));
        }
        
        // Parse JSON data into an array of trials
        $parsed_trials = json_decode($experiment_data_json, true);
        
        if ($parsed_trials === null) {
            $json_error = json_last_error_msg();
            log_debug('Error parsing experiment data JSON: ' . $json_error);
            throw new Exception('Invalid experiment data JSON: ' . $json_error);
        }
        
        log_debug('Parsed ' . count($parsed_trials) . ' trials from JSON');
        
        // Calculate total score from trials
        $total_score = 0;
        $color_pair = '';
        
        foreach ($parsed_trials as $trial) {
            // Calculate total score
            if (isset($trial['reward']) && is_numeric($trial['reward'])) {
                $total_score += (int)$trial['reward'];
            }
            
            // Extract color pair information from any trial with color_mapping
            if (empty($color_pair) && isset($trial['color_mapping']) && !empty($trial['color_mapping'])) {
                if (is_string($trial['color_mapping'])) {
                    $color_pair = $trial['color_mapping'];
                } else if (is_array($trial['color_mapping']) || is_object($trial['color_mapping'])) {
                    $color_pair = json_encode($trial['color_mapping']);
                }
            }
        }
        
        log_debug('Total score: ' . $total_score);
        
        // Start transaction for data integrity
        log_debug('Starting transaction');
        mysqli_begin_transaction($conn);
        
        // Check if this prolific_id already exists in PUPIL table
        $check_sql = "SELECT id FROM SS_participants_Pupil WHERE prolific_id = ?";
        $check_stmt = mysqli_prepare($conn, $check_sql);
        
        if (!$check_stmt) {
            throw new Exception('Prepare statement failed: ' . mysqli_error($conn));
        }
        
        mysqli_stmt_bind_param($check_stmt, "s", $prolific_id);
        
        if (!mysqli_stmt_execute($check_stmt)) {
            throw new Exception('Check participant query failed: ' . mysqli_stmt_error($check_stmt));
        }
        
        mysqli_stmt_store_result($check_stmt);
        $participant_exists = mysqli_stmt_num_rows($check_stmt) > 0;
        log_debug('Pupil participant exists: ' . ($participant_exists ? 'yes' : 'no'));
        mysqli_stmt_close($check_stmt);
        
        // Insert or update pupil participant record
        if ($participant_exists) {
            // Update existing pupil participant record
            $update_sql = "UPDATE SS_participants_Pupil SET 
                          date_completed = NOW(), 
                          status = 'completed', 
                          total_score = ?, 
                          browser_info = COALESCE(NULLIF(?, ''), browser_info)
                          WHERE prolific_id = ?";
            $update_stmt = mysqli_prepare($conn, $update_sql);
            mysqli_stmt_bind_param($update_stmt, "iss", $total_score, $browser_info, $prolific_id);
            
            if (!mysqli_stmt_execute($update_stmt)) {
                throw new Exception('Error updating pupil participant data: ' . mysqli_error($conn));
            }
            mysqli_stmt_close($update_stmt);
            
            // Get the participant_db_id for foreign key references
            $id_sql = "SELECT id FROM SS_participants_Pupil WHERE prolific_id = ?";
            $id_stmt = mysqli_prepare($conn, $id_sql);
            mysqli_stmt_bind_param($id_stmt, "s", $prolific_id);
            mysqli_stmt_execute($id_stmt);
            mysqli_stmt_bind_result($id_stmt, $participant_db_id);
            mysqli_stmt_fetch($id_stmt);
            mysqli_stmt_close($id_stmt);
        } else {
            // Should not happen as pupil should be logged first, but handle it just in case
            throw new Exception('Pupil participant not found, must log visit first');
        }
        
        // Save the JSON data to experiment_data table
        $json_sql = "INSERT INTO SS_experiment_data_Pupil (participant_id, csv_data) VALUES (?, ?)";
        $json_stmt = mysqli_prepare($conn, $json_sql);
        mysqli_stmt_bind_param($json_stmt, "is", $participant_db_id, $experiment_data_json);
        
        if (!mysqli_stmt_execute($json_stmt)) {
            log_debug('Error saving JSON data for pupil: ' . mysqli_error($conn));
            // Don't throw exception, continue with individual trial data
        }
        mysqli_stmt_close($json_stmt);
        
        // Dynamically construct the SQL statement for inserting trials with all columns
        // Note: Using SS_trials_Pupil instead of SS_trials_TEACH for pupil data
        $trial_columns = [
            "participant_id", "trial_index", "condition_trial_index", "task", 
            "trial_type_id", "block_type", "rewarding_option", "response", 
            "chosen_option", "reward", "total_reward", "rt", "accuracy", "pair_id",
            "success", "timeout", "failed_images", "failed_audio", "failed_video",
            "trial_type", "time_elapsed", "internal_node_id", "view_history", "stimulus",
            "answers", "q1", "q2", "q3", "passed_quiz", "tq1", "tq2", "tq3",
            "passed_teaching_quiz", "unchosen_option", "chosen_color", "unchosen_color",
            "chosen_reward_probability", "unchosen_reward_probability", "chosen_reward_points",
            "unchosen_reward_points", "color_left", "color_right", "color_mapping",
            "phase", "reward_probability", "square_order", "trial_data"
        ];
        
        // Create placeholders for the SQL statement
        $placeholders = array_fill(0, count($trial_columns), "?");
        
        // Construct the SQL statement with correct table name for pupil
        $trial_insert_sql = "INSERT INTO SS_trials_Pupil (" . implode(", ", $trial_columns) . ") VALUES (" . implode(", ", $placeholders) . ")";
        
        $trial_stmt = mysqli_prepare($conn, $trial_insert_sql);
        
        if (!$trial_stmt) {
            throw new Exception('Failed to prepare trial statement: ' . mysqli_error($conn));
        }
        
        // Count successfully inserted trials
        $inserted_count = 0;
        
        foreach ($parsed_trials as $trial) {
            // Skip if not a valid trial with index
            if (!isset($trial['trial_index'])) continue;
            
            // Create an array of parameters for bind_param
            $params = array();
            $param_types = ""; // Will hold parameter types (i, s, d)
            
            // Define data types for columns
            $column_types = [
                "participant_id" => ["i", $participant_db_id], // Always use participant_db_id
                "trial_index" => ["i", null],
                "condition_trial_index" => ["i", null],
                "task" => ["s", null],
                "trial_type_id" => ["s", null],
                "block_type" => ["s", null],
                "rewarding_option" => ["i", null],
                "response" => ["i", null],
                "chosen_option" => ["i", null],
                "reward" => ["i", null],
                "total_reward" => ["i", null],
                "rt" => ["d", null],
                "accuracy" => ["i", null],
                "pair_id" => ["s", null],
                "success" => ["i", null],
                "timeout" => ["i", null],
                "failed_images" => ["s", null],
                "failed_audio" => ["s", null],
                "failed_video" => ["s", null],
                "trial_type" => ["s", null],
                "time_elapsed" => ["i", null],
                "internal_node_id" => ["s", null],
                "view_history" => ["s", null],
                "stimulus" => ["s", null],
                "answers" => ["s", null],
                "q1" => ["s", null],
                "q2" => ["s", null],
                "q3" => ["s", null],
                "passed_quiz" => ["i", null],
                "tq1" => ["s", null],
                "tq2" => ["s", null],
                "tq3" => ["s", null],
                "passed_teaching_quiz" => ["i", null],
                "unchosen_option" => ["i", null],
                "chosen_color" => ["s", null],
                "unchosen_color" => ["s", null],
                "chosen_reward_probability" => ["d", null],
                "unchosen_reward_probability" => ["d", null],
                "chosen_reward_points" => ["i", null],
                "unchosen_reward_points" => ["i", null],
                "color_left" => ["s", null],
                "color_right" => ["s", null],
                "color_mapping" => ["s", null],
                "phase" => ["s", null],
                "reward_probability" => ["d", null],
                "square_order" => ["s", null],
                "trial_data" => ["s", "{}"] // Default to empty JSON object
            ];
            
            // First add participant_id
            $param_types .= "i";
            $params[] = $participant_db_id;
            
            // Then add all other parameters
            foreach ($trial_columns as $column) {
                // Skip participant_id as we already added it
                if ($column === "participant_id") continue;
                
                if ($column === "trial_data") {
                    // Special case: serialize the entire trial as JSON
                    $param_types .= "s";
                    $params[] = json_encode($trial);
                } else {
                    // Get the data type for this column
                    $type = isset($column_types[$column]) ? $column_types[$column][0] : "s";
                    $default = isset($column_types[$column]) ? $column_types[$column][1] : null;
                    
                    $param_types .= $type;
                    
                    // Handle various data formats
                    if (isset($trial[$column])) {
                        $value = $trial[$column];
                        
                        // Handle array/object values
                        if (is_array($value) || is_object($value)) {
                            $params[] = json_encode($value);
                        } 
                        // Handle boolean values
                        else if (is_bool($value)) {
                            $params[] = $value ? 1 : 0;
                        }
                        // Handle string "true"/"false" values
                        else if ($value === "true") {
                            $params[] = 1;
                        }
                        else if ($value === "false") {
                            $params[] = 0;
                        }
                        // Handle other values
                        else {
                            $params[] = $value;
                        }
                    } else {
                        $params[] = $default;
                    }
                }
            }
            
            // Create a reference array for bind_param
            $ref_params = array();
            $ref_params[] = &$param_types;
            
            foreach ($params as $key => $value) {
                $ref_params[] = &$params[$key];
            }
            
            try {
                // Call bind_param with dynamic arguments
                call_user_func_array(array($trial_stmt, 'bind_param'), $ref_params);
                
                if (mysqli_stmt_execute($trial_stmt)) {
                    $inserted_count++;
                } else {
                    log_debug('Error inserting trial data: ' . mysqli_stmt_error($trial_stmt) . 
                              ' for trial index ' . ($trial['trial_index'] ?? 'unknown'));
                }
            } catch (Exception $stmt_ex) {
                log_debug('Statement binding error: ' . $stmt_ex->getMessage());
                // Continue with next trial
                continue;
            }
        }
        
        mysqli_stmt_close($trial_stmt);
        log_debug('Inserted ' . $inserted_count . ' trials into database');
        
        // Commit transaction
        mysqli_commit($conn);
        log_debug('Transaction committed');
        
        send_json_response([
            'success' => true, 
            'message' => 'Data saved successfully', 
            'trials_processed' => count($parsed_trials),
            'trials_inserted' => $inserted_count
        ]);
        
    } catch (Exception $e) {
        // Rollback transaction if active
        if (isset($conn) && mysqli_get_connection_stats($conn)['active_transactions'] > 0) {
            mysqli_rollback($conn);
            log_debug('Transaction rolled back');
        }
        
        // Log the error
        $error_msg = 'Database error: ' . $e->getMessage();
        error_log($error_msg);
        log_debug($error_msg);
        
        // Return error to client
        send_json_response(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    // Not a POST request
    log_debug('Invalid request method: ' . $_SERVER['REQUEST_METHOD']);
    send_json_response(['success' => false, 'message' => 'Invalid request method']);
}

// Close database connection
if (isset($conn)) {
    mysqli_close($conn);
    log_debug('Database connection closed');
}

// End and flush the output buffer
ob_end_flush();
?>