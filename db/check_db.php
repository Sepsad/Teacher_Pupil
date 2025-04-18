<?php
// Include database configuration - updated path
require_once 'config.php';

// If we got here, connection is successful
echo "<h2>Remote Database Connection Test</h2>";
echo "<p>Connection to <strong>{$db_host}</strong> successful!</p>";

// Try to get server info
$server_info = mysqli_get_server_info($conn);
echo "<p>Server Info: <strong>{$server_info}</strong></p>";

// Check if tables exist
$tables = ["SS_participants_TEACH", "SS_trials_TEACH", "SS_teaching_texts_TEACH", "SS_experiment_data_TEACH"];
echo "<h3>Table Status:</h3>";
echo "<ul>";
foreach ($tables as $table) {
    $result = mysqli_query($conn, "SHOW TABLES LIKE '$table'");
    if (mysqli_num_rows($result) > 0) {
        echo "<li style='color:green'>Table '$table' exists.</li>";
    } else {
        echo "<li style='color:red'>Table '$table' does not exist. Please run create_tables.sql script.</li>";
    }
}
echo "</ul>";

// Check connection latency
$start_time = microtime(true);
mysqli_query($conn, "SELECT 1");
$end_time = microtime(true);
$latency = round(($end_time - $start_time) * 1000, 2);
echo "<p>Connection latency: <strong>{$latency} ms</strong></p>";

// Close database connection
mysqli_close($conn);

echo "<p>Connection closed.</p>";
?>