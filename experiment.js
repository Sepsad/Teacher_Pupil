/* Initialize jsPsych */
const jsPsych = initJsPsych({
    on_finish: function() {
        jsPsych.data.displayData();
    }
});

// Add CSS styles to properly display the squares
document.head.insertAdjacentHTML('beforeend', `
    <style>
        /* Basic styling for the experiment container */
        body {
            font-family: Arial, sans-serif;
        }
        
        /* Styling for the squares */
        .square-option {
            width: 100px;
            height: 100px;
            border: 2px solid #333;
            cursor: pointer;
            margin: 10px;
            display: inline-block;
            transition: transform 0.2s, box-shadow 0.2s;
            position: relative; /* Added for text positioning */
            color: white; /* Text color for readability */
            font-weight: bold; /* Make text more visible */
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7); /* Add shadow for better contrast */
            display: flex; /* For centering text */
            align-items: center;
            justify-content: center;
        }
        
        .square-option:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        
        .square-option.selected {
            box-shadow: 0 0 15px gold, 0 0 5px rgba(0,0,0,0.5);
            border: 3px solid gold;
        }
        
        /* Adding !important to ensure colors are applied */
        .square-blue {
            background-color: #3498db !important;
        }
        
        .square-red {
            background-color: #e74c3c !important;
        }
        
        /* New styling for the background frame */
        .squares-frame {
            background-color: #f0f0f0;
            border: 3px solid #999;
            border-radius: 10px;
            padding: 20px;
            margin: 0 auto;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
            display: flex;
            justify-content: center;
            position: relative;
        }
        
        /* Hatched pattern frame */
        .squares-frame.hatched {
            background-image: repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #ddd 10px, #ddd 20px);
        }
        
        /* Triangle indicator for hatched with triangle frame */
        .triangle-indicator {
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-bottom: 35px solid #999;
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        /* Adjusted option-container for the new frame */
        .option-container {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            width: 100%;
        }
        
        .option-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 20px;
        }
        
        .reward-display {
            font-weight: bold;
            font-size: 1.2em;
            margin-top: 10px;
            color: #2ecc71;
        }
        
        /* Styling for general displays */
        .total-display {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .trial-info {
            margin-bottom: 20px;
        }
        
        /* Styling for instructions */
        .instructions {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        
        /* Button styling */
        .continue-btn {
            margin-top: 20px;
            padding: 10px 20px;
        }
    </style>
`);

/* Experiment parameters */
const settings = {
    nb_trials: 120,
    option_colors: ["#3498db", "#e74c3c"], // Blue and Red squares
    totalReward: 0,
    // Trial types configuration
    trialTypes: [
        {
            id: 'plain',      // Plain background, red rewarding
            count: 60,
            frameClass: '',
            rewardingOption: 1, // 1 is red
            reward: 5          // Fixed reward value
        },
        {
            id: 'hatched',    // Hatched background, blue rewarding
            count: 40,
            frameClass: 'hatched',
            rewardingOption: 0, // 0 is blue
            reward: 5          // Fixed reward value
        },
        {
            id: 'triangle',   // Hatched with triangle, red rewarding
            count: 20,
            frameClass: 'hatched',
            hasTriangle: true,
            rewardingOption: 1, // 1 is red
            reward: 5          // Fixed reward value
        }
    ]
};

/* Helper functions */
// Remove the normalRandom function as we're using deterministic rewards now

// Update the getReward function to use trial type information
function getReward(option, trialType) {
    if (option === trialType.rewardingOption) {
        return trialType.reward;
    }
    return 0;
}

// Function to shuffle the positions of the squares
function getRandomSquareOrder() {
    return Math.random() < 0.5 ? [0, 1] : [1, 0]; // 50% chance for each order
}

// Generate a randomized sequence of trial types
function generateTrialSequence() {
    let sequence = [];
    
    // Create arrays for each trial type based on their counts
    settings.trialTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            sequence.push({...type});
        }
    });
    
    // Shuffle the sequence to interleave trial types
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }
    
    return sequence;
}

/* Create instructions */
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

/* Define a simpler approach using standard plugins */

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
    
    // Choice trial - show the two colored squares to choose from
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            // Create triangle indicator HTML if needed
            const triangleHTML = trialType.hasTriangle ? '<div class="triangle-indicator"></div>' : '';
            
            return `
                <div class="total-display">Total Points: ${settings.totalReward}</div>
                <div class="trial-info">
                    <h2>Trial ${i + 1} of ${settings.nb_trials}</h2>
                    <p>Choose a square:</p>
                </div>
                <div class="squares-frame ${trialType.frameClass}">
                    ${triangleHTML}
                    <div class="option-container">
                        <div class="option-wrapper">
                            <div id="jspsych-html-button-response-button-${squareOrder[0]}" class="jspsych-html-button-response-button square-option ${squareOrder[0] === 0 ? 'square-blue' : 'square-red'}" style="background-color: ${settings.option_colors[squareOrder[0]]} !important;" data-choice="${squareOrder[0]}"></div>
                        </div>
                        <div class="option-wrapper">
                            <div id="jspsych-html-button-response-button-${squareOrder[1]}" class="jspsych-html-button-response-button square-option ${squareOrder[1] === 0 ? 'square-blue' : 'square-red'}" style="background-color: ${settings.option_colors[squareOrder[1]]} !important;" data-choice="${squareOrder[1]}"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        choices: [],  // Empty choices because we're using custom buttons
        button_html: null,  // No default button HTML
        margin_vertical: "80px",
        margin_horizontal: "40px",
        data: {
            trial_index: i,
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
    });
    
    // Feedback trial - show the selected square with reward
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            const lastTrial = jsPsych.data.get().last(1).values()[0];
            const chosenOption = lastTrial.chosen_option;
            const reward = lastTrial.reward;
            const squareOrder = lastTrial.square_order;
            
            // Create triangle indicator HTML if needed
            const triangleHTML = trialType.hasTriangle ? '<div class="triangle-indicator"></div>' : '';
            
            // Create HTML with a background frame containing both squares
            let html = `
                <div class="total-display">Total Points: ${settings.totalReward}</div>
                <div class="trial-info">
                    <h2>Trial ${i + 1} of ${settings.nb_trials}</h2>
                    <p>Your result:</p>
                </div>
                <div class="squares-frame ${trialType.frameClass}">
                    ${triangleHTML}
                    <div class="option-container">`;
            
            // Create both squares with the same order as in the choice trial
            html += `
                <div class="option-wrapper">
                    <div class="square-option ${squareOrder[0] === 0 ? 'square-blue' : 'square-red'} ${squareOrder[0] === chosenOption ? 'selected' : ''}" 
                         style="background-color: ${settings.option_colors[squareOrder[0]]} !important;"></div>
                    ${squareOrder[0] === chosenOption ? `<div class="reward-display">+${reward} points!</div>` : ''}
                </div>
                <div class="option-wrapper">
                    <div class="square-option ${squareOrder[1] === 0 ? 'square-blue' : 'square-red'} ${squareOrder[1] === chosenOption ? 'selected' : ''}" 
                         style="background-color: ${settings.option_colors[squareOrder[1]]} !important;"></div>
                    ${squareOrder[1] === chosenOption ? `<div class="reward-display">+${reward} points!</div>` : ''}
                </div>`;
            
            html += `</div>
                </div>`;
            return html;
        },
        choices: ["Continue"],
        button_html: '<button class="jspsych-btn continue-btn">%choice%</button>',
        data: {
            task: 'feedback',
            trial_index: i,
            trial_type_id: trialType.id
        }
    });
}

// Add final results
timeline.push({
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
});

/* Run the experiment when the page loads */
window.onload = function() {
    jsPsych.run(timeline);
};