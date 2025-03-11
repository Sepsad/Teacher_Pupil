/* Define the trial types and create the timeline */

// Create instructions
const instructions = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
            <h2>Welcome to the "Click and Earn" Task</h2>
            <p>In this task, you will choose between two colored squares to earn points.</p>
            <p>Each time you select a square, you will get some points.</p>
            <p>Your goal is to earn as many points as possible.</p>
            <p>You will make ${settings.nb_trials} choices in total.</p>
        </div>`,
        `<div class="instructions">
            <h2>Task Details</h2>
            <p>The squares will appear on different backgrounds:</p>
            <p>- Plain background</p>
            <p>- Hatched pattern background</p>
            <p>- Hatched pattern with a triangle on top</p>
            <p>The background might give you clues about which square gives more points!</p>
            <p>Let's begin.</p>
        </div>`
    ],
    show_clickable_nav: true
};

// Create final screen
function createFinalScreen() {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            return `
                <div class="instructions">
                    <h2>Task Complete!</h2>
                    <p>You earned a total of ${settings.totalReward} points.</p>
                    <p>Thank you for participating.</p>
                </div>
            `;
        },
        choices: ["Finish"]
    };
}

// Create choice trial
function createChoiceTrial(trialType, trialIndex, squareOrder) {
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
            trial_index: trialIndex,
            task: 'choice',
            square_order: squareOrder,
            trial_type_id: trialType.id,
            rewarding_option: trialType.rewardingOption
        },
        on_start: function(trial) {
            // Add event listeners after the trial renders
            setTimeout(function() {
                document.querySelectorAll('.jspsych-html-button-response-button').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        const choice = parseInt(this.getAttribute('data-choice'));
                        // End trial with the selected option
                        jsPsych.finishTrial({
                            response: choice,
                            rt: performance.now() - trial.startTime
                        });
                    });
                });
            }, 0);
        },
        on_load: function() {
            this.startTime = performance.now();
        },
        on_finish: function(data) {
            const chosenOption = data.response;
            const reward = getReward(chosenOption, trialType);
            settings.totalReward += reward;
            
            // Store these for the next trial
            data.chosen_option = chosenOption;
            data.reward = reward;
            data.total_reward = settings.totalReward;
        }
    };
}

// Create feedback trial
function createFeedbackTrial(trialType, trialIndex) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            const lastTrial = jsPsych.data.get().last(1).values()[0];
            const chosenOption = lastTrial.chosen_option;
            const reward = lastTrial.reward;
            const squareOrder = lastTrial.square_order;
            
            // Return only the trial display HTML, let the plugin handle the button
            return createTrialHTML(trialType, squareOrder, trialIndex, true, chosenOption, reward);
        },
        choices: ["Continue"],
        button_html: '<button class="jspsych-btn continue-btn">%choice%</button>',
        // The plugin needs these options to ensure the button renders properly
        margin_vertical: "20px",
        margin_horizontal: "0px",
        response_ends_trial: true, // Explicitly set this to ensure the trial ends when button is clicked
        post_trial_gap: 0, // Make sure there's no delay between trials
        data: {
            task: 'feedback',
            trial_index: trialIndex,
            trial_type_id: trialType.id
        }
    };
}

// Build the experiment timeline
function buildTimeline() {
    // Create the timeline
    const timeline = [
        {
            type: jsPsychPreload,
            auto_preload: true
        },
        instructions
    ];

    // Generate trial sequence
    const trialSequence = generateTrialSequence();

    // Add trials to the timeline
    for (let i = 0; i < settings.nb_trials; i++) {
        // Get the trial type for this trial
        const trialType = trialSequence[i];
        
        // Generate random order for this trial pair
        const squareOrder = getRandomSquareOrder();
        
        // Add choice trial
        timeline.push(createChoiceTrial(trialType, i, squareOrder));
        
        // Add feedback trial
        timeline.push(createFeedbackTrial(trialType, i));
    }

    // Add final results
    timeline.push(createFinalScreen());
    
    return timeline;
}
