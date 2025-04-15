/* Initialize jsPsych and run the experiment */

// Initialize jsPsych
const jsPsych = initJsPsych({
    
    on_finish: function() {
        // Get all experiment data as JSON instead of CSV
        const experimentData = jsPsych.data.get().json();
        
        // Generate a unique participant ID (or use one provided via URL parameters)
        const urlParams = new URLSearchParams(window.location.search);
        const participantId = urlParams.get('participant_id') || generateParticipantId();
        
        // Send data to server
        saveDataToServer(participantId, experimentData);
        
        // Display data in browser for debugging
        // jsPsych.data.displayData();
        
        // Show completion message with participant ID for reference
        document.getElementById('jspsych-target').innerHTML += `
            <div style="text-align: center; margin-top: 10px; padding: 10px; background-color: #f0f0f0;">
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

// Function to get browser information
function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        timestamp: new Date().toISOString()
    };
}

// Function to log the initial visit
function logVisit(participantId) {
    const visitData = {
        participant_id: participantId,
        browser_info: getBrowserInfo()
    };
    
    fetch('db/log_visit.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Visit logged successfully');
        } else {
            console.error('Error logging visit:', data.message);
        }
    })
    .catch(error => {
        console.error('Error logging visit:', error);
    });
}

// Function to save data to server
function saveDataToServer(participantId, experimentData) {
    try {
        console.log('Attempting to save JSON data to server for participant:', participantId);
        
        // Create the data object to send
        const dataToSend = {
            participant_id: participantId,
            experiment_data: experimentData, // JSON data as string
            browser_info: getBrowserInfo()
        };
        
        // Send the data using fetch
        fetch(window.location.origin + '/db/save_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => {
            console.log('Server response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // First try to parse as JSON
            return response.text().then(text => {
                if (!text) {
                    throw new Error('Empty response from server');
                }
                
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Invalid JSON in response:', text);
                    throw new Error('Invalid JSON response: ' + text.substring(0, 100));
                }
            });
        })
        .then(data => {
            if (data.success) {
                console.log('Data successfully saved to remote server!');
                
                // Update the completion message
                document.getElementById('jspsych-target').innerHTML += `
                    <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #dff0d8; color: #3c763d; border: 1px solid #d6e9c6; border-radius: 4px;">
                        <p><strong>Success!</strong> Your data has been saved.</p>
                        <p>Thank you for participating!</p>
                        <p>Trials processed: ${data.trials_processed}</p>
                        <p>Trials inserted: ${data.trials_inserted}</p>
                    </div>
                `;
            } else {
                console.error('Error saving data:', data.message);
                showErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
            showErrorMessage('Network or server error: ' + error.message);
            
            // Save data locally as backup
            localStorage.setItem('teacher_pupil_backup_data', JSON.stringify({
                participant_id: participantId,
                timestamp: new Date().toISOString(),
                experiment_data: experimentData
            }));
            
            document.getElementById('jspsych-target').innerHTML += `
                <div style="text-align: center; margin-top: 20px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeeba;">
                    <p>A backup of your data has been saved to your browser's local storage.</p>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error processing experiment data:', error);
        showErrorMessage('Failed to process experiment data: ' + error.message);
    }
}

// Function to show error message to user
function showErrorMessage(message) {
    document.getElementById('jspsych-target').innerHTML += `
        <div style="text-align: center; margin-top: 20px; padding: 20px; background-color: #f2dede; color: #a94442; border: 1px solid #ebccd1; border-radius: 4px;">
            <p><strong>Error!</strong> There was a problem saving your data.</p>
            <p>${message}</p>
            <p>Please take a screenshot of this page including the error message above and contact the experimenter via hernan.anllo@learningplanetinstitute.org.</p>

        </div>
    `;
}

// Run the experiment when the page loads
window.onload = function() {
    // Get participant ID from URL or generate a new one
    const urlParams = new URLSearchParams(window.location.search);
    let participantId = urlParams.get('participant_id');
    
    // Check if we have a stored participant ID
    if (!participantId) {
        participantId = localStorage.getItem('teacherPupilParticipantId');
    }
    
    // If still no participant ID, generate a new one
    if (!participantId) {
        participantId = generateParticipantId();
        // Store in localStorage for session persistence
        localStorage.setItem('teacherPupilParticipantId', participantId);
    }
    
    // Update URL with participant ID without reloading page
    if (!urlParams.has('participant_id')) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('participant_id', participantId);
        window.history.replaceState({}, '', newUrl);
    }
    
    // Log the visit
    logVisit(participantId);
    
    // Build the timeline
    const timeline = buildTimeline();
    
    // Run the experiment
    jsPsych.run(timeline);
};
