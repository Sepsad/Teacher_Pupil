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

## File Structure

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

## Running Locally

1. Clone this repository
2. Open `index.html` in a web browser

No server is required as this is a purely client-side application.

## Configuration

You can modify the experiment parameters in `config.js`:

- `nb_trials` - Number of learning trials (default: 120)
- `colorPairs` - Array of color pairs used for the squares
- Trial type settings (proportions, reward values, etc.)

## Data Collection

Data is collected via jsPsych's built-in data object. In a real experiment setting, you would need to add a server component to save the data or use a service like Prolific or Mechanical Turk.

## Acknowledgements

This project was developed at École Normale Supérieure in the HRL lab.
