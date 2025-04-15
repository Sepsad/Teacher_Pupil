<?php
// Database configuration - Get settings from environment variables for Docker
$db_host = getenv('MYSQL_HOST') ?: 'database';
$db_username = getenv('MYSQL_USER') ?: 'teacher_pupil_user';
$db_password = getenv('MYSQL_PASSWORD') ?: 'secure_password';
$db_name = getenv('MYSQL_DATABASE') ?: 'teacher_pupil_db';
$db_port = getenv('MYSQL_PORT') ?: 3306;

// Create a connection to the database
// $conn = mysqli_connect($db_host, $db_username, $db_password, $db_name, $db_port);
$conn = mysqli_connect($db_host, $db_username, $db_password, $db_name);


// Check connection
if (!$conn) {
    error_log("Database connection failed: " . mysqli_connect_error());
    die("Connection failed: " . mysqli_connect_error());
}

// Set charset to ensure proper encoding of data
mysqli_set_charset($conn, "utf8mb4");
?>
