# Teacher-Pupil Learning Experiment

This project implements an experiment that investigates how people learn decision-making rules and then teach them to others. Participants complete a learning task involving colored squares with different reward probabilities, followed by testing and teaching phases.

## Overview

In this experiment, participants:

1. Learn to associate rewards with colored squares in different contexts
2. Complete a transfer phase without feedback
3. Write instructions to "teach" future participants

The experiment is designed to study the strategies people use when learning from experience and how they transmit that knowledge to others.

## Dependencies

This project uses:

- [jsPsych 7.3.1](https://www.jspsych.org/) - JavaScript library for running behavioral experiments
- Various jsPsych plugins (html-button-response, instructions, preload)
- PHP 8.0+ (for server-side data handling)
- MySQL 8.0 (for database storage)

## File Structure

### Client-Side Files
- `index.html` - Main HTML file
- `styles.css` - CSS styling for the experiment interface
- `config.js` - Experiment configuration settings
- `utils.js` - Helper functions for trial sequence generation and reward calculations
- `trials.js` - Trial definitions and timeline construction
- `main.js` - Experiment initialization
- `DATA-DICT.md` - Data dictionary explaining all recorded experiment fields
- `README.md` - This documentation file
- `.gitignore` - Git ignore configuration
- `images/` - Contains visual assets (like instruction.gif)
- `dist/` - jsPsych distribution files

### Server-Side Files
- `db/create_tables.sql` - SQL script for creating database tables
- `db/save_data.php` - Endpoint for saving experiment data
- `db/log_visit.php` - Endpoint for logging participant visits
- `db/config.php` - Database connection configuration
- `db/check_db.php` - Script for checking database connection
- `db/export.php` - Script for exporting data in different formats
- `db/index.php` - Simple web interface for database management

### Docker Configuration
- `docker-compose.yml` - Docker configuration for local development
- `.env` - Environment variables for Docker setup

## Running Locally

### Client-Only Mode (No Data Saving)
1. Clone this repository
2. Open `index.html` in a web browser

### Full Setup with Database (Recommended)
1. Clone this repository
2. Make sure Docker and Docker Compose are installed
3. Configure the `.env` file with your database credentials
4. Run `docker-compose up -d` to start the containers
5. Access the experiment at `http://localhost`
6. Access the database admin panel at `http://localhost:8080` (phpMyAdmin)
7. Access the database management utilities at `http://localhost/db/`

## Configuration

### Experiment Parameters
You can modify the experiment parameters in `config.js`:

- `nb_trials` - Number of learning trials (default: 120)
- `colorPairs` - Array of color pairs used for the squares
- Trial type settings (proportions, reward values, etc.)

### Database Configuration
1. Edit `db/config.php` with your database connection details
2. Run the SQL script in `create_tables.sql` to set up the database tables
3. Ensure your web server has appropriate permissions for database files

## Data Flow
1. When participants start the experiment, `log_visit.php` records their initial visit
2. During the experiment, data is collected via jsPsych's built-in data object
3. On completion, `save_data.php` stores all trial data in the MySQL database
4. You can export collected data via the database management interface (`/db/`)

## Security Notes
Before deploying to production:
- Implement proper authentication for the admin interface
- Restrict access to sensitive files
- Update CORS headers to allow only your domain
- Set up HTTPS for secure data transmission

## Acknowledgements

This project was developed at École Normale Supérieure in the HRL lab.
