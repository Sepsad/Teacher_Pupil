<?php
// Include database configuration
require_once 'config.php';

// Basic security check - remove in production or replace with proper authentication
// $allowed_ips = ['127.0.0.1', '::1']; // localhost IPs
// if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
//     die("Access denied");
// }

// Define export type from URL parameter
$type = isset($_GET['type']) ? $_GET['type'] : 'csv';

// Set appropriate headers based on export type
switch ($type) {
    case 'csv':
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="experiment_data_' . date('Y-m-d') . '.csv"');
        break;
        
    case 'json':
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="experiment_data_' . date('Y-m-d') . '.json"');
        break;
        
    case 'teaching_only':
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="teaching_texts_' . date('Y-m-d') . '.csv"');
        break;
        
    default:
        die("Invalid export type");
}

// Function to export data as CSV
function exportAsCSV($data, $headers) {
    $output = fopen('php://output', 'w');
    
    // Add headers
    fputcsv($output, $headers);
    
    // Add data rows
    foreach ($data as $row) {
        fputcsv($output, $row);
    }
    
    fclose($output);
}

// Function to extract trial data into a flat format
function flattenTrialData($trialData) {
    $flatData = [];
    
    foreach ($trialData as $trial) {
        // Skip trials without necessary data
        if (!isset($trial['trial_index'])) {
            continue;
        }
        
        $row = [];
        
        // Add all properties from the trial to the row
        foreach ($trial as $key => $value) {
            if (is_array($value) || is_object($value)) {
                $row[$key] = json_encode($value);
            } else {
                $row[$key] = $value;
            }
        }
        
        $flatData[] = $row;
    }
    
    return $flatData;
}

try {
    switch ($type) {
        case 'csv':
            // Get all participants and their trial data
            $sql = "SELECT p.prolific_id, p.date_completed, t.trial_data 
                   FROM SS_participants_TEACH p 
                   JOIN SS_trials_TEACH t ON p.id = t.participant_id";
            $result = mysqli_query($conn, $sql);
            
            if (!$result) {
                throw new Exception(mysqli_error($conn));
            }
            
            $data = [];
            // Include all fields from DATA-DICT
            $headers = [
                'prolific_id', 'date_completed', 'trial_index', 'condition_trial_index', 
                'task', 'trial_type_id', 'block_type', 'square_order', 'pair_id',
                'rewarding_option', 'reward_probability', 'response', 'chosen_option',
                'unchosen_option', 'chosen_color', 'unchosen_color', 'chosen_reward_probability',
                'unchosen_reward_probability', 'chosen_reward_points', 'unchosen_reward_points',
                'reward', 'total_reward', 'rt', 'accuracy', 'color_left', 'color_right',
                'color_mapping', 'teaching_text'
            ];
            
            while ($row = mysqli_fetch_assoc($result)) {
                $trialData = json_decode($row['trial_data'], true);
                $flatTrials = flattenTrialData($trialData);
                
                foreach ($flatTrials as $trial) {
                    $csvRow = [
                        'prolific_id' => $row['prolific_id'],
                        'date_completed' => $row['date_completed']
                    ];
                    
                    // Add trial data fields
                    foreach ($headers as $header) {
                        if ($header !== 'prolific_id' && $header !== 'date_completed') {
                            $csvRow[$header] = isset($trial[$header]) ? $trial[$header] : '';
                        }
                    }
                    
                    $data[] = $csvRow;
                }
            }
            
            exportAsCSV($data, $headers);
            break;
            
        case 'json':
            // Get all data as JSON
            $sql = "SELECT p.prolific_id, p.date_completed, t.trial_data 
                   FROM SS_participants_TEACH p 
                   JOIN SS_trials_TEACH t ON p.id = t.participant_id";
            $result = mysqli_query($conn, $sql);
            
            if (!$result) {
                throw new Exception(mysqli_error($conn));
            }
            
            $data = [];
            
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = [
                    'prolific_id' => $row['prolific_id'],
                    'date_completed' => $row['date_completed'],
                    'trials' => json_decode($row['trial_data'], true)
                ];
            }
            
            echo json_encode($data, JSON_PRETTY_PRINT);
            break;
            
        case 'teaching_only':
            // Get only teaching texts
            $sql = "SELECT p.prolific_id, p.date_completed, tt.teaching_text, tt.color_pair 
                   FROM SS_participants_TEACH p 
                   JOIN SS_teaching_texts_TEACH tt ON p.id = tt.participant_id";
            $result = mysqli_query($conn, $sql);
            
            if (!$result) {
                throw new Exception(mysqli_error($conn));
            }
            
            $data = [];
            $headers = ['prolific_id', 'date_completed', 'teaching_text', 'color_pair'];
            
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = [
                    $row['prolific_id'],
                    $row['date_completed'],
                    $row['teaching_text'],
                    $row['color_pair']
                ];
            }
            
            exportAsCSV($data, $headers);
            break;
    }
} catch (Exception $e) {
    die("Error exporting data: " . $e->getMessage());
}

// Close database connection
mysqli_close($conn);
?>
