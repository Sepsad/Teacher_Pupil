<?php
// Remote database configuration
$db_host = 'remote-database-server.com'; // Change this to your remote database server address
$db_username = 'remote_user';
$db_password = 'secure_password';
$db_name = 'teacher_pupil_db';
$db_port = 3306; // Add port if needed (default is 3306)

// Create a connection to remote database
$conn = mysqli_connect($db_host, $db_username, $db_password, $db_name, $db_port);

// Check connection
if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
    die("Connection failed: " . mysqli_connect_error());
}

// Set charset to ensure proper encoding of data
mysqli_set_charset($conn, "utf8mb4");
?>
