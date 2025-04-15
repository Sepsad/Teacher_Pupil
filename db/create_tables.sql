-- Create database if not exists
CREATE DATABASE IF NOT EXISTS teacher_pupil_db;
USE teacher_pupil_db;

-- Create participants table with status tracking
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id VARCHAR(255) NOT NULL,
    first_visit_time DATETIME NOT NULL,
    date_completed DATETIME NULL,
    status ENUM('started', 'completed', 'abandoned') DEFAULT 'started',
    total_score INT DEFAULT 0,
    browser_info TEXT,
    UNIQUE KEY (participant_id)
);

-- Updated trials table with all the required columns
CREATE TABLE IF NOT EXISTS trials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    trial_index INT NOT NULL,
    condition_trial_index INT,
    task VARCHAR(20),
    trial_type_id VARCHAR(20),
    block_type VARCHAR(20),
    rewarding_option INT,
    response INT,
    chosen_option INT,
    reward INT,
    total_reward INT,
    rt FLOAT,
    accuracy TINYINT(1),
    pair_id VARCHAR(30),
    
    -- JSPsych-specific fields
    success TINYINT(1),
    timeout TINYINT(1),
    failed_images TEXT,
    failed_audio TEXT,
    failed_video TEXT,
    trial_type VARCHAR(50),
    time_elapsed INT,
    internal_node_id VARCHAR(50),
    view_history TEXT,
    stimulus TEXT,
    
    -- Quiz-related fields
    answers TEXT,
    q1 VARCHAR(10),
    q2 VARCHAR(10),
    q3 VARCHAR(10),
    passed_quiz TINYINT(1),
    tq1 VARCHAR(10),
    tq2 VARCHAR(10),
    tq3 VARCHAR(10),
    passed_teaching_quiz TINYINT(1),
    
    -- Choice-specific fields
    unchosen_option INT,
    chosen_color VARCHAR(20),
    unchosen_color VARCHAR(20),
    chosen_reward_probability FLOAT,
    unchosen_reward_probability FLOAT,
    chosen_reward_points INT,
    unchosen_reward_points INT,
    color_left VARCHAR(20),
    color_right VARCHAR(20),
    color_mapping TEXT,
    
    -- Other fields
    phase VARCHAR(20),
    reward_probability FLOAT,
    square_order TEXT,
    teaching_text TEXT,
    
    -- Complete trial data in JSON format
    trial_data JSON NOT NULL,
    
    FOREIGN KEY (participant_id) REFERENCES participants(id),
    INDEX idx_task (task),
    INDEX idx_trial_type (trial_type_id),
    INDEX idx_block_type (block_type)
);

-- Teaching texts table with additional metadata
CREATE TABLE IF NOT EXISTS teaching_texts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    teaching_text TEXT NOT NULL,
    character_count INT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);

-- Create table for storing CSV experiment data
CREATE TABLE IF NOT EXISTS experiment_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    csv_data MEDIUMTEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id)
);

-- Create a view for easy retrieval of aggregate data
CREATE VIEW participant_performance AS
SELECT 
    p.participant_id,
    p.date_completed,
    COUNT(CASE WHEN t.task = 'choice' OR t.task = 'test' THEN 1 END) as total_trials,
    AVG(CASE WHEN t.task = 'choice' OR t.task = 'test' THEN t.accuracy END) as avg_accuracy,
    SUM(CASE WHEN t.task = 'choice' OR t.task = 'test' THEN t.reward END) as total_reward,
    tt.character_count as teaching_length,
    tt.teaching_text
FROM 
    participants p
LEFT JOIN 
    trials t ON p.id = t.participant_id
LEFT JOIN 
    teaching_texts tt ON p.id = tt.participant_id
GROUP BY 
    p.id;
