/* Define the trial types and create the timeline */

// Create welcome page
const welcomePage = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Welcome!</h2>
            <p>Thank you for participating in this study. We're happy to have you!</p>
            <p>With your help, we will try to understand how people learn new things and make decisions.</p>
            <p>Let's jump right into it!</p>
        </div>
    `,
    choices: ["Continue"]
};

// Create consent form
const consentForm = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions consent-container" style="max-width: 800px; margin: 0 auto; font-size: 14px;">
            <h2 style="text-align: center; color: #2c3e50; margin-top: 0;">Consent Form</h2>
            
            <div class="consent-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="consent-col">
                    <div class="consent-section" style="margin-bottom: 15px;">
                        <h3 style="color: #3498db; margin: 0 0 8px 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Aim of the Study</h3>
                        <p style="margin: 0; line-height: 1.4;">This is a study titled 'Knowledge transfer', led by Professor Stefano PALMINTERI. The primary goal of this research is to understand the learning processes involved in decision-making, focusing on the role of reinforcement learning in short-term and long-term cognition in groups of individuals. We want to emphasize that this study has no immediate application or clinical value, but it will contribute to deepen our understanding of human behavior.</p>
                    </div>
                    
                    <div class="consent-section" style="margin-bottom: 15px;">
                        <h3 style="color: #3498db; margin: 0 0 8px 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Procedure</h3>
                        <p style="margin: 0; line-height: 1.4;">You will be asked to complete two cognitive tasks, that do not require any particular skill or knowledge. The estimated duration to complete the study is approximately 20 minutes. Depending on your performance, you might earn between £2.5 - £5.</p>
                    </div>
                    
                    <div class="consent-section" style="margin-bottom: 15px;">
                        <h3 style="color: #3498db; margin: 0 0 8px 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Research Results And Publication</h3>
                        <p style="margin: 0; line-height: 1.4;">You will be able to check the publications resulting from this study on the following website.</p>
                    </div>
                </div>
                
                <div class="consent-col">
                    <div class="consent-section" style="margin-bottom: 15px;">
                        <h3 style="color: #3498db; margin: 0 0 8px 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Participation and Confidentiality</h3>
                        <p style="margin: 0; line-height: 1.4;">Your participation in this research study is voluntary. You may stop and withdraw your participation at any time. In addition to your responses in the study, we will also collect these demographic data that you provided to Prolific when you signed up. The collected data will only be used for research purposes. Any shared or published dataset will not contain your name or Prolific ID.</p>
                    </div>
                    
                    <div class="consent-section" style="margin-bottom: 15px;">
                        <h3 style="color: #3498db; margin: 0 0 8px 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Contact And Additional Information</h3>
                        <p style="margin: 0; line-height: 1.4;">For any questions or additional information, you can contact our research team via email at the following address: humanreinforcementlearning@gmail.com</p>
                        
                        <p style="margin: 10px 0 0 0; line-height: 1.4;">This research has been approved by the PSE Ethical Review Committee (IRB), call 2023-040, on October 11th, 2023</p>
                    </div>
                </div>
            </div>
            
            <div class="consent-checkbox-section" style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0 20px; border-left: 4px solid #3498db;">
                <h3 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 16px; text-align: center;">Consent</h3>
                <p style="margin: 0 0 15px 0; text-align: center; line-height: 1.4;">Your participation in this study confirms that you have read this information, and wish to take part on it freely. Please check all boxes to continue:</p>
                
                <div class="consent-checkboxes" style="display: flex; flex-direction: column; gap: 10px;">
                    <div class="consent-item" style="display: flex; align-items: flex-start; gap: 10px;">
                        <input type="checkbox" id="age-consent" class="consent-check" style="margin-top: 3px;">
                        <label for="age-consent" style="color: #2c3e50;">I am 18 years old or more</label>
                    </div>
                    <div class="consent-item" style="display: flex; align-items: flex-start; gap: 10px;">
                        <input type="checkbox" id="voluntary-consent" class="consent-check" style="margin-top: 3px;">
                        <label for="voluntary-consent" style="color: #2c3e50;">My participation in this experiment is voluntary</label>
                    </div>
                    <div class="consent-item" style="display: flex; align-items: flex-start; gap: 10px;">
                        <input type="checkbox" id="data-consent" class="consent-check" style="margin-top: 3px;">
                        <label for="data-consent" style="color: #2c3e50;">I understand that my collected data will remain confidential and I can stop at any time without justification</label>
                    </div>
                </div>
            </div>
            
            <div class="consent-warning" id="consent-warning" style="color: #e74c3c; margin-top: 10px; text-align: center; display: none; font-weight: bold;">
                Please check all consent boxes to continue.
            </div>
        </div>
    `,
    choices: ["I Consent"],
    button_html: '<button class="jspsych-btn" id="consent-btn" disabled style="background-color: #3498db; color: white; padding: 10px 25px; border: none; border-radius: 4px; font-weight: bold; cursor: not-allowed; opacity: 0.7; transition: all 0.3s;">%choice%</button>',
    on_load: function() {
        const consentBtn = document.getElementById('consent-btn');
        const checkboxes = document.querySelectorAll('.consent-check');
        const warningElement = document.getElementById('consent-warning');
        
        // Check if all boxes are checked on any checkbox change
        function updateConsentButton() {
            let allChecked = true;
            checkboxes.forEach(function(checkbox) {
                if (!checkbox.checked) {
                    allChecked = false;
                }
            });
            
            if (allChecked) {
                consentBtn.disabled = false;
                consentBtn.style.opacity = '1';
                consentBtn.style.cursor = 'pointer';
                warningElement.style.display = 'none';
            } else {
                consentBtn.disabled = true;
                consentBtn.style.opacity = '0.7';
                consentBtn.style.cursor = 'not-allowed';
            }
        }
        
        // Add event listeners to all checkboxes
        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', updateConsentButton);
        });
        
        // Add event listener to the button to show warning if clicked while disabled
        consentBtn.addEventListener('click', function(e) {
            if (this.disabled) {
                warningElement.style.display = 'block';
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    },
    data: {
        task: 'consent'
    }
};

// Create task instructions (now without the welcome page)
const taskInstructions = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
            <h2>Task Instructions</h2>
            <p>This is a point-and-click game where you will select one of two squares displayed on the screen. Your goal is to find the squares that will make you win the most points</p>
            <p>Here is an example of what the squares may look like:</p>
            <div class="option-container" style="margin: 30px 0">
                <div class="option-wrapper">
                    <div class="square-option square-green" style="background-color: ${settings.instruction_colors[0]} !important;"></div>
                </div>
                <div class="option-wrapper">
                    <div class="square-option square-purple" style="background-color: ${settings.instruction_colors[1]} !important;"></div>
                </div>

            </div>

            <p>When you click on a square to select it, you will obtain the amount of points associated to it.</p>
            <p><strong>Note:</strong> The squares in the actual task will be different from the ones in this example.</p>
        </div>`,
        `<div class="instructions">
            <h2>Example</h2>
            <p>Here is a slowed-down example of the kind of decisions you'll have to make:</p>

            <div class="example-animation">
                <img src="https://raw.githubusercontent.com/Sepsad/Teacher_Pupil/a0cc4fd16911c1c91c56ccc21c14eb2310a68b4a/images/Instruction.gif" alt="Task example" style="max-width: 60%; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            </div>
        </div>`
    ],
    show_clickable_nav: true
};

// Prepare participant for teacher instructions

const teachingInstructions = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
            <h2>Here's the catch!!! READ CAREFULLY </h2>
            <p>A person with experience in this task has writen down a set of instructions <b>specifically to help you</b>. </p>
            <p><b>Keep in mind that this "teacher" knows the task, and wants you to win as many points as possible!!</b></strong>.</p>
            '<img src="images/instructions/Pupil_board.png" style="padding: 1rem; text-align: center" class = "img-fluid">'
        </div>`,
        `<div class="instructions">
            <h2>Remember</h2>
            <p>At the end of the study, we will convert all collected points into pounds and add them to the fixed bonus provided by Prolific.</p>
            <p>The conversion rate is 1 point = 1.2 pence.</p>
            <p> <strong> It is therefore in your best interest to pay attention to clues and instructions </strong>, as winning enough points could lead you to double your earnings!</p>
         </div>`
    ],
    show_clickable_nav: true
};

// Default teaching instructions as fallback
const defaultTeachingInstructions = [
    "Pay attention to the background of the squares. The plain background and hatched background with triangle follow the same rule, while the hatched background follows a different rule.",
    "For plain backgrounds, always choose the second color. For hatched backgrounds, always choose the first color. For hatched backgrounds with a triangle, choose the second color again.",
    "The background matters more than the colors themselves. Look for patterns in which option gives rewards based on the background type."
];

//DISPLAY TEACHER INSTRUCTIONS HERE. 
const displayTeacherInstr = {
    type: jsPsychInstructions,
    pages: [`<div class="instructions">
        <h2>Teacher instructions</h2>
        <p>Loading instructions from a previous participant...</p>
        <div class="loader"></div>
    </div>`],
    show_clickable_nav: true,
    allow_backward: false,
    button_label_next: "Continue",

    on_start: function(trial) {
        console.log('[displayTeacherInstr] Starting component and checking for teacherData');
        
        // Use window.teacherData instead of making a fetch request
        if (window.teacherData && window.teacherData.teachingText) {
            // We already have the teacher data from logVisit
            console.log('[displayTeacherInstr] Using teacher data from window.teacherData');
            let teachingText = window.teacherData.teachingText;
            
            // Format the teaching text with proper styling
            const newContent = `<div class="instructions">
                <h2>Teacher Instructions</h2>
                <p>A previous participant who mastered this task left these instructions to help you:</p>
                
                <div class="teacher-message" style="background-color: #f5f5f5; border: 2px solid #3498db; padding: 20px; margin: 20px auto; border-radius: 8px; text-align: left; max-width: 400px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; overflow-x: hidden;">
                    <p style="white-space: normal; margin: 0; font-size: 16px; line-height: 1.5; overflow-wrap: break-word; hyphens: auto;">${teachingText}</p>
                </div>
            </div>`;
            
            // Replace the current page with the teaching instructions
            trial.pages = [newContent];
            
            // Store for cases where we need it later
            window.teacherInstructions = newContent;
        } else {
            // Fallback: If window.teacherData is not available, try to fetch from server
            console.log('[displayTeacherInstr] No teacher data found in window.teacherData, trying server fetch');
            
            fetch('db/get_teaching.php')
                .then(response => {
                    console.log('[displayTeacherInstr] Server response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('[displayTeacherInstr] Teaching data received:', data);
                    let teachingText = 'No instructions available.';
                    
                    if (data.success && data.teaching_text) {
                        console.log('[displayTeacherInstr] Using teaching text from database');
                        teachingText = data.teaching_text;
                        
                        // Store the data for future use
                        if (!window.teacherData) {
                            window.teacherData = {
                                teachingText: data.teaching_text,
                                colorPair: data.color_pair,
                                teacherId: data.teacher_id
                            };
                            // Also store in localStorage as backup
                            localStorage.setItem('teacherPupilTeacherData', JSON.stringify(window.teacherData));
                            
                            // Now that we have teacher data, set the color pair
                            if (typeof setTeacherColorPair === 'function') {
                                setTeacherColorPair();
                                console.log('[displayTeacherInstr] Set color pair based on fetched teacher data');
                            }
                        }
                    } else if (data.teaching_text) {
                        console.log('[displayTeacherInstr] Using fallback teaching text from response');
                        teachingText = data.teaching_text;
                    } else {
                        // Use a random default instruction if none available from database
                        const randomIndex = Math.floor(Math.random() * defaultTeachingInstructions.length);
                        teachingText = defaultTeachingInstructions[randomIndex];
                        console.log('[displayTeacherInstr] Using random default teaching text:', randomIndex);
                    }
                    
                    // Format the teaching text with proper styling
                    const newContent = `<div class="instructions">
                        <h2>Teacher Instructions</h2>
                        <p>A previous participant who mastered this task left these instructions to help you:</p>
                        
                        <div class="teacher-message" style="background-color: #f5f5f5; border: 2px solid #3498db; padding: 20px; margin: 20px auto; border-radius: 8px; text-align: left; max-width: 400px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; overflow-x: hidden;">
                            <p style="white-space: normal; margin: 0; font-size: 16px; line-height: 1.5; overflow-wrap: break-word; hyphens: auto;">${teachingText}</p>
                        </div>
                    </div>`;
                    
                    // Replace the current page with the teaching instructions
                    trial.pages = [newContent];
                    
                    // Try all possible selectors to find the content area
                    const targetElement = document.querySelector('#jspsych-target') || document.querySelector('.jspsych-display-element');
                    if (targetElement) {
                        console.log('[displayTeacherInstr] Found display element, updating content');
                        
                        // Try multiple potential selectors for the actual content area
                        const potentialSelectors = [
                            '.jspsych-instructions-page', 
                            '.jspsych-content div:not(.jspsych-instructions-nav)',
                            '.jspsych-content > div',
                            '#jspsych-instructions-page-0'
                        ];
                        
                        let contentFound = false;
                        
                        // Try direct DOM traversal to find the content area
                        const contentElements = targetElement.querySelectorAll('.jspsych-content > *');
                        for (const element of contentElements) {
                            if (element.classList && !element.classList.contains('jspsych-instructions-nav')) {
                                console.log('[displayTeacherInstr] Found content via DOM traversal');
                                element.innerHTML = newContent;
                                contentFound = true;
                                break;
                            }
                        }
                        
                        // If not found via traversal, try the selectors
                        if (!contentFound) {
                            for (const selector of potentialSelectors) {
                                const element = targetElement.querySelector(selector);
                                if (element) {
                                    console.log('[displayTeacherInstr] Found content with selector:', selector);
                                    element.innerHTML = newContent;
                                    contentFound = true;
                                    break;
                                }
                            }
                        }
                        
                        // Last resort - find any element that contains the loader
                        if (!contentFound) {
                            const loaderElement = targetElement.querySelector('.loader');
                            if (loaderElement) {
                                console.log('[displayTeacherInstr] Found content via loader');
                                // Go up to find the container of the loader
                                let container = loaderElement.parentElement;
                                while (container && container !== targetElement) {
                                    if (container.classList.contains('instructions') || 
                                        !container.className.includes('jspsych')) {
                                        container.innerHTML = newContent;
                                        contentFound = true;
                                        break;
                                    }
                                    container = container.parentElement;
                                }
                            }
                        }
                        
                        if (contentFound) {
                            console.log('[displayTeacherInstr] Successfully updated instructions content');
                        } else {
                            console.warn('[displayTeacherInstr] Content area not found using any selector method');
                            
                            // Store the content for later use
                            window.teacherInstructions = newContent;
                        }
                    } else {
                        console.warn('[displayTeacherInstr] Display element not found');
                        // Store for later
                        window.teacherInstructions = newContent;
                    }
                })
                .catch(error => {
                    console.error('[displayTeacherInstr] Error fetching teaching instructions:', error);
                    // Use a random default instruction if fetch fails
                    const randomIndex = Math.floor(Math.random() * defaultTeachingInstructions.length);
                    const teachingText = defaultTeachingInstructions[randomIndex];
                    console.log('[displayTeacherInstr] Error occurred, using random default teaching text:', randomIndex);
                    
                    const newContent = `<div class="instructions">
                        <h2>Teacher Instructions</h2>
                        <p>A previous participant who mastered this task left these instructions to help you:</p>
                        
                        <div class="teacher-message" style="background-color: #f5f5f5; border: 2px solid #3498db; padding: 20px; margin: 20px auto; border-radius: 8px; text-align: left; max-width: 400px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; overflow-x: hidden;">
                            <p style="white-space: normal; margin: 0; font-size: 16px; line-height: 1.5; overflow-wrap: break-word; hyphens: auto;">${teachingText}</p>
                        </div>
                    </div>`;
                    
                    // Update the pages property
                    trial.pages = [newContent];
                });
        }
    },
    on_load: function() {
        console.log('[displayTeacherInstr] Component loaded and visible');
        
        // If we have window.teacherData, update the content immediately
        if (window.teacherData && window.teacherData.teachingText && window.teacherInstructions) {
            // Find the instruction page element now that it's definitely in the DOM
            const contentElement = document.querySelector('.jspsych-instructions-page') || 
                                   document.querySelector('.jspsych-content > div:not(.jspsych-instructions-nav)');
            
            if (contentElement) {
                contentElement.innerHTML = window.teacherInstructions;
                console.log('[displayTeacherInstr] Successfully applied stored instructions on load');
            }
            return;
        }
        
        // Check if we have stored instructions content from fetch before DOM was ready
        if (window.teacherInstructions) {
            console.log('[displayTeacherInstr] Found stored instructions, applying now that DOM is ready');
            
            // Find the instruction page element now that it's definitely in the DOM
            const contentElement = document.querySelector('.jspsych-instructions-page') || 
                                   document.querySelector('.jspsych-content > div:not(.jspsych-instructions-nav)');
            
            if (contentElement) {
                contentElement.innerHTML = window.teacherInstructions;
                console.log('[displayTeacherInstr] Successfully applied stored instructions');
            }
        }
        
        // Add a check after a delay to make sure content loaded
        setTimeout(() => {
            const anyContentArea = document.querySelector('.jspsych-content > div:not(.jspsych-instructions-nav)');
            if (anyContentArea) {
                const loadingElement = anyContentArea.querySelector('.loader');
                if (loadingElement) {
                    console.log('[displayTeacherInstr] Instructions still loading after timeout');
                    
                    // If we still have a loader, but have stored teacher instructions, apply them now
                    if (window.teacherInstructions) {
                        anyContentArea.innerHTML = window.teacherInstructions;
                        console.log('[displayTeacherInstr] Applied stored instructions after timeout');
                    }
                } else {
                    console.log('[displayTeacherInstr] Instructions successfully loaded and displayed');
                }
            }
        }, 2000);
    }
};

// Create an instruction review loop to handle going back to instructions
const instructionReviewLoop = {
    timeline: [
        displayTeacherInstr,  // Show teacher instructions
        {
            type: jsPsychHtmlButtonResponse,
            stimulus: `
                <div class="instructions">
                    <h2>Are you ready?</h2>
                    <p>You can now decide whether you want to read the instructions again, or start the game.</p>
                </div>
            `,
            choices: ["Read Instructions Again", "Begin Game"],
            data: {
                task: 'instruction_choice'
            },
            on_finish: function(data) {
                console.log('Instruction choice made:', data.response === 0 ? 'Read Again' : 'Begin Game');
                
                // Make sure we have the teacher's color pair before starting the game
                if (data.response === 1 && window.teacherData && window.teacherData.colorPair && typeof setTeacherColorPair === 'function') {
                    console.log('Ensuring color pair is set correctly before starting game');
                    setTeacherColorPair();
                }
            }
        }
    ],
    loop_function: function(data) {
        // Get the most recent response
        const lastTrialData = data.values().slice(-1)[0];
        const shouldLoop = lastTrialData.response === 0;
        console.log('instructionReviewLoop decision:', shouldLoop ? 'Looping back to instructions' : 'Proceeding to game');
        
        // If they chose "Read Instructions Again" (option 0), loop again
        return shouldLoop;
    }
};

// Create final screen
function createFinalScreen() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            return `
                <div class="instructions">
                    <h2>Task Complete!</h2>
                    <p>Thank you for participating.</p>
                </div>
            `;
        },
        choices: ["Finish"]
    };
}


// Function to generate a test trial sequence
function generateTestTrialSequence() {
    let sequence = [];
    
    // Create exactly 10 trials of each type
    settings.trialTypes.forEach(type => {
        for (let i = 0; i < 10; i++) {
            sequence.push({...type});
        }
    });
    
    // Shuffle the sequence to interleave trial types
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    };
    
    return sequence;
}

// Create test choice trial (no feedback)
function createTestTrial(trialType, trialIndex, squareOrder) {
    // Calculate condition-specific trial index
    const conditionTrialCounts = {};
    
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            return createTrialHTML(trialType, squareOrder, trialIndex);
        },
        choices: [],  // Empty choices because we're using custom buttons
        button_html: null,  // No default button HTML
        margin_vertical: "80px",
        margin_horizontal: "40px",
        data: {
            trial_index: trialIndex,  // 1) Trial number (whole experiment)
            task: 'test',
            square_order: squareOrder,
            trial_type_id: trialType.id,
            rewarding_option: trialType.rewardingOption,
            reward_probability: trialType.probability,
            phase: 'test',
            block_type: 'test'  // 16) Block type
        },
        on_start: function(trial) {
            // Add event listeners after the trial renders
            setTimeout(function() {
                document.querySelectorAll('.jspsych-html-button-response-button').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        const choice = parseInt(this.getAttribute('data-choice'));
                        
                        // Highlight the selected option
                        this.classList.add('selected');
                        
                        // Store response data
                        const response_data = {
                            response: choice,
                            rt: performance.now() - trial.startTime
                        };
                        
                        // Wait 500ms before ending the trial
                        setTimeout(() => {
                            jsPsych.finishTrial(response_data);
                        }, 500);
                    });
                });
            }, 0);
        },
        on_load: function() {
            this.startTime = performance.now();
        },
        on_finish: function(data) {
            const chosenOption = data.response;
            const unchosenOption = chosenOption === 0 ? 1 : 0;
            const reward = getReward(chosenOption, trialType);
            settings.totalReward += reward;  // Still accumulate rewards, just don't show them
            
            // Get condition-specific trial index
            if (!conditionTrialCounts[trialType.id]) {
                conditionTrialCounts[trialType.id] = 0;
            }
            const conditionTrialIndex = conditionTrialCounts[trialType.id]++;
            
            // Store all required data fields
            data.chosen_option = chosenOption;                       // 8) Chosen square ID
            data.unchosen_option = unchosenOption;                   // 9) Unchosen square ID
            data.condition_trial_index = conditionTrialIndex;        // 2) Trial number for this condition
            data.chosen_color = settings.option_colors[squareOrder[data.response]]; // 3) Color of chosen square
            data.unchosen_color = settings.option_colors[squareOrder[unchosenOption]]; // 4) Color of unchosen square
            data.pair_id = settings.option_colors.join('-');         // 5) Pair ID
            data.chosen_reward_probability = trialType.rewardingOption === chosenOption ? trialType.probability : 0; // 6) Reward probs of chosen
            data.unchosen_reward_probability = trialType.rewardingOption === unchosenOption ? trialType.probability : 0; // 7) Reward probs of unchosen
            data.chosen_reward_points = trialType.rewardingOption === chosenOption ? trialType.reward : 0; // 10) Reward points of chosen
            data.unchosen_reward_points = trialType.rewardingOption === unchosenOption ? trialType.reward : 0; // 11) Reward points of unchosen
            data.reward = reward;                                    // 12) Actual reward obtained
            data.total_reward = settings.totalReward;                // 13) Cumulative reward
            data.accuracy = chosenOption === trialType.rewardingOption ? 1 : 0; // 14) Accuracy
            // 15) Response time (rt) is already stored by jsPsych
            
            // Store color information
            data.color_left = settings.option_colors[squareOrder[0]];
            data.color_right = settings.option_colors[squareOrder[1]];
            data.color_mapping = {
                0: settings.option_colors[0],
                1: settings.option_colors[1]
            };
        }
    };
}

// Generate a test block sequence with equal distribution of trial types
function generateTestBlockSequence() {
    let sequence = [];
    const trialsPerBlock = settings.blocks.test.trialsPerBlock;
    const trialsPerType = Math.floor(trialsPerBlock / settings.trialTypes.length);
    
    // Create arrays for each trial type
    settings.trialTypes.forEach(type => {
        for (let i = 0; i < trialsPerType; i++) {
            sequence.push({...type});
        }
    });
    
    // Add remaining trials if needed
    const remaining = trialsPerBlock - (trialsPerType * settings.trialTypes.length);
    for (let i = 0; i < remaining; i++) {
        sequence.push({...settings.trialTypes[i]});
    }
    
    // Shuffle the sequence to interleave trial types
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }
    
    return sequence;
}

// Build the experiment timeline
function buildTimeline() {
    // Create the timeline
    const timeline = [
        {
            type: jsPsychPreload,
            auto_preload: true
        }
    ];
    
    // Add welcome page
    timeline.push(welcomePage);
    
    // Add consent form
    timeline.push(consentForm);

    // Add task instructions for pupil
    timeline.push(taskInstructions);
    
    // Add intro to teacher instructions 
    timeline.push(teachingInstructions);

    // Add instruction review loop
    timeline.push(instructionReviewLoop);

    // Add test blocks
    for (let blockIdx = 0; blockIdx < settings.blocks.test.count; blockIdx++) {
        // Add block start instruction if it's not the first block
        if (blockIdx > 0) {
            timeline.push({
                type: jsPsychHtmlButtonResponse,
                stimulus: `
                    <div class="instructions">
                        <h2>Test Block ${blockIdx + 1}</h2>
                        <p>You are about to start test block ${blockIdx + 1} of ${settings.blocks.test.count}.</p>
                        <p>Remember, you won't receive feedback after your choices in the test phase.</p>
                    </div>
                `,
                choices: ["Begin Block"],
                data: {
                    task: 'block_start',
                    phase: 'test',
                    block_number: blockIdx
                }
            });
        }
        
        // Generate test trial sequence for this block
        const testBlockSequence = generateTestBlockSequence();
        
        // Calculate global trial index base for this block
        const blockTrialOffset = blockIdx * settings.blocks.test.trialsPerBlock;
        
        // Add test trials to the timeline
        for (let i = 0; i < testBlockSequence.length; i++) {
            // Get the trial type for this test trial
            const trialType = testBlockSequence[i];
            
            // Calculate global trial index
            const globalTrialIndex = blockTrialOffset + i;
            
            // Generate random order for this trial pair
            const squareOrder = getRandomSquareOrder();
            
            // Add test trial (no feedback)
            timeline.push(createTestTrial(trialType, globalTrialIndex, squareOrder));
        }
        
        // Add block break if not the last block
        if (blockIdx < settings.blocks.test.count - 1 && settings.blocks.test.showBlockBreaks) {
            timeline.push(createBlockBreakScreen('test', blockIdx, settings.blocks.test.count));
        }
    }
    
    // Add final results
    timeline.push(createFinalScreen());
    
    return timeline;
}
