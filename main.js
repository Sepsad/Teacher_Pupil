/* Initialize jsPsych and run the experiment */

// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        // Get all experiment data
        const experimentData = jsPsych.data.get().json();
        
        // Generate a unique participant ID (or use one provided via URL parameters)
        const urlParams = new URLSearchParams(window.location.search);
        const participantId = urlParams.get('participant_id') || generateParticipantId();
        
        // Send data to server
        saveDataToServer(participantId, experimentData);
        
        // Display data in browser for debugging
        jsPsych.data.displayData();
        
        // Show completion message with participant ID for reference
        document.getElementById('jspsych-target').innerHTML += `
            <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f0f0f0;">
                <h2>Data Submission</h2>
                <p>Saving data to the remote database... Please wait.</p>
                <p>Your participant ID is: <strong>${participantId}</strong></p>
                <p>Please make a note of this ID in case you need to reference it later.</p>
            </div>
        `;
    },
    display_element: 'jspsych-target' // Explicitly set the display element
});

// Function to generate a simple participant ID if one isn't provided
function generateParticipantId() {
    return 'participant_' + Date.now();
}

// Function to save data to server
function saveDataToServer(participantId, experimentData) {
    // Create the data object to send
    const dataToSend = {
        participant_id: participantId,
        experiment_data: JSON.parse(experimentData)
    };
    
    // Send the data using fetch - updated path to db folder
    fetch('db/save_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Data successfully saved to remote server!');
            
            // Update the completion message
            document.getElementById('jspsych-target').innerHTML += `
                <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #dff0d8; color: #3c763d; border: 1px solid #d6e9c6; border-radius: 4px;">
                    <p><strong>Success!</strong> Your data has been saved.</p>
                    <p>Thank you for participating!</p>
                </div>
            `;
        } else {
            console.error('Error saving data:', data.message);
            showErrorMessage(data.message);
        }
    })
    .catch(error => {
        console.error('Error saving data:', error);
        showErrorMessage('Network or server error occurred. Please contact the experimenter.');
    });
}

// Function to show error message to user
function showErrorMessage(message) {
    document.getElementById('jspsych-target').innerHTML += `
        <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #f2dede; color: #a94442; border: 1px solid #ebccd1; border-radius: 4px;">
            <p><strong>Error!</strong> There was a problem saving your data.</p>
            <p>${message}</p>
            <p>Please take a screenshot of this page and contact the experimenter.</p>
        </div>
    `;
}

// Run the experiment when the page loads
window.onload = function() {
    // Build the timeline
    const timeline = buildTimeline();
    
    // Run the experiment
    jsPsych.run(timeline);
};
