-- Create database if not exists
CREATE DATABASE IF NOT EXISTS teacher_pupil_db;
USE teacher_pupil_db;

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id VARCHAR(255) NOT NULL,
    date_completed DATETIME NOT NULL,
    UNIQUE KEY (participant_id)
);

-- Create trials table to store all trial data
CREATE TABLE IF NOT EXISTS trials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    trial_data JSON NOT NULL,
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);

-- Optional: Create a teaching_texts table to easily query just the teaching texts
CREATE TABLE IF NOT EXISTS teaching_texts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    teaching_text TEXT NOT NULL,
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);
