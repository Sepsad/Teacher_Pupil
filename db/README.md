# Database Integration for Teacher-Pupil Experiment

This directory contains all the files needed for database integration with the Teacher-Pupil experiment.

## Files

- `config.php` - Database connection configuration
- `save_data.php` - Script for saving experiment data to database
- `check_db.php` - Script for checking database connection
- `create_tables.sql` - SQL script for creating database tables
- `export.php` - Script for exporting data in different formats
- `index.php` - Simple web interface for database management

## Setup Instructions

1. Edit `config.php` with your database connection details
2. Run the SQL script in `create_tables.sql` to set up the database tables
3. Access `check_db.php` in your browser to verify the database connection
4. Ensure your web server has appropriate permissions for these files

## Usage

The experiment sends data to `save_data.php` which stores it in the database.

To access the database management interface, navigate to the `/db/` directory in your browser.

## Security Notes

These scripts contain minimal security measures. Before deploying to production:

- Implement proper authentication for the admin interface
- Restrict access to sensitive files
- Update CORS headers to allow only your domain
- Set up HTTPS for secure data transmission
