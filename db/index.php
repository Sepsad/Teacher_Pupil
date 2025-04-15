<?php
// Basic security check - remove in production or replace with proper authentication
// $allowed_ips = ['127.0.0.1', '::1']; // localhost IPs
// if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
//     die("Access denied");
// }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teacher-Pupil Database Management</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1, h2 {
            color: #2c3e50;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        .card {
            background: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .btn:hover {
            background: #2980b9;
        }
        .warning {
            background: #f39c12;
        }
        .danger {
            background: #e74c3c;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Teacher-Pupil Database Management</h1>
        
        <div class="card">
            <h2>Database Status</h2>
            <p>Use this page to check database status and manage experiment data.</p>
            <a href="check_db.php" class="btn">Check Database Connection</a>
        </div>
        
        <div class="card">
            <h2>Data Downloads</h2>
            <p>Download experiment data in various formats:</p>
            <a href="export.php?type=csv" class="btn">Export All Data (CSV)</a>
            <a href="export.php?type=json" class="btn">Export All Data (JSON)</a>
            <a href="export.php?type=teaching_only" class="btn">Export Teaching Texts Only</a>
        </div>
        
        <div class="card">
            <h2>Database Management</h2>
            <p>Warning: Use these functions with caution!</p>
            <a href="backup.php" class="btn warning">Backup Database</a>
            <a href="clear.php?confirm=0" class="btn danger">Clear Test Data</a>
        </div>
    </div>
</body>
</html>
