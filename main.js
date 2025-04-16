/* Initialize jsPsych and run the experiment */

// Initialize jsPsych
const jsPsych = initJsPsych({
    
    on_finish: function() {
        // Get all experiment data as JSON instead of CSV
        const experimentData = jsPsych.data.get().json();
        
        // Generate a unique prolific ID (or use one provided via URL parameters)
        const urlParams = new URLSearchParams(window.location.search);
        const prolificId = urlParams.get('prolific_id') || generateProlificId();
        
        // Send data to server
        saveDataToServer(prolificId, experimentData);
        
        // Display data in browser for debugging
        // jsPsych.data.displayData();
        
        // Show completion message with prolific ID for reference
        document.getElementById('jspsych-target').innerHTML += `
            <div style="position: fixed; top: 0; left: 0; right: 0; text-align: center; 
            padding: 15px; background-color: #f0f0f0; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <h2>Data Submission</h2>
            <p>Saving data to the remote database... Please wait.</p>
            <p>Your prolific ID is: <strong>${prolificId}</strong></p>
            <p>Please make a note of this ID in case you need to reference it later.</p>
            <button 
            onclick="window.location.href='https://www.prolific.com'" 
            style="background-color: #5cb85c; color: white; padding: 10px 20px; 
            border: none; border-radius: 4px; font-size: 16px; cursor: pointer; 
            margin-top: 15px;">
            Return to Prolific
            </button>
            </div>
        `;
    },
    display_element: 'jspsych-target' // Explicitly set the display element
});

// Function to generate a simple prolific ID if one isn't provided
function generateProlificId() {
    return 'prolific_' + Date.now();
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
function logVisit(prolificId) {
    const visitData = {
        prolific_id: prolificId,
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
function saveDataToServer(prolificId, experimentData) {
    try {
        console.log('Attempting to save JSON data to server for participant:', prolificId);
        
        // Create the data object to send
        const dataToSend = {
            prolific_id: prolificId,
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
                    <div style="text-align: center; margin-top: 5px; padding: 20px; background-color: #dff0d8; color: #3c763d; border: 1px solid #d6e9c6; border-radius: 4px;">
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
                prolific_id: prolificId,
                timestamp: new Date().toISOString(),
                experiment_data: experimentData
            }));
            jsPsych.data.get().localSave('csv', prolificId + '.csv');
            document.getElementById('jspsych-target').innerHTML += `
                <div style="text-align: center; margin-top: 10px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeeba;">
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
        <div style="text-align: center; margin-top: 10px; padding: 20px; background-color: #f2dede; color: #a94442; border: 1px solid #ebccd1; border-radius: 4px;">
            <p><strong>Error!</strong> There was a problem saving your data.</p>
            <p>${message}</p>
            <p>Please take a screenshot of this page including the error message above and contact the experimenter via hernan.anllo@learningplanetinstitute.org.</p>
            <p>Please also attach the backup data to your email.</p>


        </div>
    `;
}

// Global variable to hold the tab change detector
let tabChangeDetector;

// Run the experiment when the page loads
window.onload = function() {
    // Get prolific ID from URL or generate a new one
    const urlParams = new URLSearchParams(window.location.search);
    let prolificId = urlParams.get('prolific_id');
    
    // Check if we have a stored prolific ID
    if (!prolificId) {
        prolificId = localStorage.getItem('teacherPupilProlificId');
    }
    
    // If still no prolific ID, generate a new one
    if (!prolificId) {
        prolificId = generateProlificId();
        // Store in localStorage for session persistence
        localStorage.setItem('teacherPupilProlificId', prolificId);
    }
    
    // Update URL with prolific ID without reloading page
    if (!urlParams.has('prolific_id')) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('prolific_id', prolificId);
        window.history.replaceState({}, '', newUrl);
    }
    
    // Log the visit
    logVisit(prolificId);
    
    // Build the timeline
    const timeline = buildTimeline();
    
    // Initialize tab change detection with jsPsych instance
    tabChangeDetector = preventTabChange(jsPsych);
    tabChangeDetector.enable();
    
    // Run the experiment
    jsPsych.run(timeline);
};



/**
 * Prevents tab changing by displaying a warning when user switches tabs or windows
 * @param {Object} jsPsych - The jsPsych instance to control experiment flow
 * @returns {Object} Object with enable and disable functions
 */
function preventTabChange(jsPsych) {
    let warningDiv = null;
    let isEnabled = false;
    let visibilityHandler, focusHandler;
    
    // Function to show warning and pause experiment
    function showWarning() {
      if (warningDiv) return; // Don't create multiple warnings
      
      // Pause the experiment
      if (jsPsych) {
        jsPsych.pauseExperiment();
      }
      
      warningDiv = document.createElement('div');
      warningDiv.style.position = 'fixed';
      warningDiv.style.top = '50%';
      warningDiv.style.left = '50%';
      warningDiv.style.transform = 'translate(-50%, -50%)';
      warningDiv.style.width = '400px';
      warningDiv.style.maxWidth = '90%';
      warningDiv.style.padding = '25px';
      warningDiv.style.backgroundColor = '#f8d7da';
      warningDiv.style.color = '#721c24';
      warningDiv.style.border = '1px solid #f5c6cb';
      warningDiv.style.borderRadius = '8px';
      warningDiv.style.textAlign = 'center';
      warningDiv.style.zIndex = '9999';
      warningDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      
      // Create the warning message with a button
      warningDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
          <strong>Warning!</strong> You've switched tabs or windows during the experiment.
          <p>The experiment has been paused. Please remain on this tab for the duration of the experiment.</p>
        </div>
        <button id="resume-experiment" style="padding: 8px 16px; background-color: #dc3545; color: white; 
        border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          Resume Experiment
        </button>
      `;
      
      document.body.appendChild(warningDiv);
      
      // Add click event to the button
      document.getElementById('resume-experiment').addEventListener('click', function() {
        document.body.removeChild(warningDiv);
        warningDiv = null;
        
        // Resume the experiment
        if (jsPsych) {
          jsPsych.resumeExperiment();
        }
      });
    }
  
    // Setup visibility change detection
    function setupVisibilityDetection() {
      document.addEventListener('visibilitychange', function() {
        if (document.hidden && isEnabled) {
          // When tab becomes active again, show warning
          const handler = function() {
            if (!document.hidden) {
              showWarning();
              document.removeEventListener('visibilitychange', handler);
            }
          };
          visibilityHandler = handler;
          document.addEventListener('visibilitychange', handler);
        }
      });
      
      // Listen for window blur events
      window.addEventListener('blur', function() {
        if (isEnabled) {
          // When window regains focus, show warning
          const handler = function() {
            showWarning();
            window.removeEventListener('focus', handler);
          };
          focusHandler = handler;
          window.addEventListener('focus', handler);
        }
      });
    }
    
    return {
      enable: function() {
        isEnabled = true;
        setupVisibilityDetection();
        console.log("Tab change detection enabled");
      },
      
      disable: function() {
        isEnabled = false;
        if (warningDiv && warningDiv.parentNode) {
          warningDiv.parentNode.removeChild(warningDiv);
        }
        warningDiv = null;
        console.log("Tab change detection disabled");
      }
    };
  }