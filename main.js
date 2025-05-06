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
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            width: 90%; max-width: 600px; text-align: center; background-color: white; 
            padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000; font-family: Arial, sans-serif;">
                <div style="margin-bottom: 10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#5cb85c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Data Submission</h2>
                <p style="color: #666; font-size: 16px; margin-bottom: 15px;">Saving data to the remote database... Please wait.</p>
                <div style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; margin: 15px 0;">
                    <p style="margin: 0; color: #333;">Your prolific ID is: <strong>${prolificId}</strong></p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Please make a note of this ID in case you need to reference it later.</p>
                </div>
                <button 
                onclick="window.location.href='https://www.prolific.com/'" 
                style="background-color: #5cb85c; color: white; padding: 12px 24px; 
                border: none; border-radius: 6px; font-size: 16px; cursor: pointer; 
                margin-top: 20px; transition: background-color 0.2s; font-weight: 500;">
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
            
            // Store teacher data for use in the experiment
            if (data.teaching_text) {
                console.log('Received teacher data');
                window.teacherData = {
                    teachingText: data.teaching_text,
                    colorPair: data.color_pair,
                    teacherId: data.teacher_prolific_id,
                    teacherTextId: data.teacher_text_id
                };
                // Also store in localStorage as backup
                localStorage.setItem('teacherPupilTeacherData', JSON.stringify(window.teacherData));
                
                // Now that we have teacher data, set the color pair
                if (typeof setTeacherColorPair === 'function') {
                    setTeacherColorPair();
                    console.log('Set color pair based on teacher data');
                } else {
                    console.warn('setTeacherColorPair function not available');
                }
            }
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
            experiment_data: experimentData,
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
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    width: 90%; max-width: 600px; text-align: center; background-color: white;
                    padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 1001; font-family: Arial, sans-serif;">
                        <div style="margin-bottom: 15px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h2 style="color: #28a745; margin-bottom: 15px; font-size: 24px;">Success!</h2>
                        <p style="color: #333; font-size: 18px; margin-bottom: 20px;">Your data has been saved.</p>
                        <p style="color: #666; font-size: 16px; margin-bottom: 5px;">Thank you for participating!</p>
                        <div style="background-color: #f8f9fa; margin: 20px 0; padding: 15px; border-radius: 6px; display: inline-block;">
                            <p style="margin: 0; color: #333;">Trials processed: ${data.trials_processed}</p>
                            <p style="margin: 5px 0 0; color: #333;">Trials inserted: ${data.trials_inserted}</p>
                        </div>
                        <button 
                        onclick="window.location.href='https://www.prolific.com'" 
                        style="background-color: #28a745; color: white; padding: 12px 24px; 
                        border: none; border-radius: 6px; font-size: 16px; cursor: pointer; 
                        margin-top: 20px; transition: background-color 0.2s; font-weight: 500;">
                        Return to Prolific
                        </button>
                    </div>
                `;
            } else {
                console.error('Error saving data:', data.message);
                showErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
            
            // Save data locally as backup FIRST
            localStorage.setItem('teacher_pupil_backup_data', JSON.stringify({
                prolific_id: prolificId,
                timestamp: new Date().toISOString(),
                experiment_data: experimentData
            }));
            jsPsych.data.get().localSave('csv', prolificId + '.csv');
            
            // Then show a combined error message with backup information
            showErrorMessage('Network or server error: ' + error.message, true);
        });
    } catch (error) {
        console.error('Error processing experiment data:', error);
        showErrorMessage('Failed to process experiment data: ' + error.message);
    }
}

// Function to show error message to user with optional backup info
function showErrorMessage(message, backupCreated = false) {
    document.getElementById('jspsych-target').innerHTML += `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; max-width: 600px; text-align: center; background-color: white;
        padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1001; font-family: Arial, sans-serif;">
            <div style="margin-bottom: 15px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </div>
            <h2 style="color: #dc3545; margin-bottom: 15px; font-size: 24px;">Error!</h2>
            <p style="color: #333; font-size: 18px; margin-bottom: 15px;">There was a problem saving your data.</p>
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 6px; margin: 15px 0; color: #721c24;">
                ${message}
            </div>
            ${backupCreated ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#856404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
                        <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                    <h3 style="color: #856404; margin: 0; font-size: 18px;">Backup Created</h3>
                </div>
                <p style="color: #856404; margin: 0; text-align: left;">A backup of your data has been saved to your browser's local storage and downloaded as CSV.</p>
            </div>
            ` : ''}
            <div style="margin: 20px 0; padding: 15px; border-radius: 6px; background-color: #f8f9fa;">
                <p style="margin: 0; font-weight: 500; color: #333;">Please take a screenshot of this page including the error message above.</p>
                <p style="margin: 10px 0 0; color: #666;">Contact the experimenter via hernan.anllo@learningplanetinstitute.org</p>
                <p style="margin: 5px 0 0; color: #666;">Please also attach the backup data to your email.</p>
            </div>
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