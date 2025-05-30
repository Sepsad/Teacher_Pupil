/* Define the trial types and create the timeline */

// Create task instructions
const taskInstructions = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
            <h2>Welcome!</h2>
            <p><strong>This is a demo version of the Teacher-Pupil experiment.</strong></p>
            <p>Let's jump right into it!</p>
        </div>`,
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

            <p>When you click on a square to select it, you will obtain the amount of points associated to it. Keep in mind that the squares come in pairs,  and one of the squares will always be better than the other  at winning you points.</p>
            <p><strong>Note:</strong> The squares in the actual task will be different from the ones in this example.</p>
        </div>`,
        `<div class="instructions">
            <h2>Example</h2>
            <p>Here is a slowed-down example of the kind of decisions you'll have to make:</p>

            <div class="example-animation">
                <img src="https://raw.githubusercontent.com/Sepsad/Teacher_Pupil/a0cc4fd16911c1c91c56ccc21c14eb2310a68b4a/images/Instruction.gif" alt="Task example" style="max-width: 60%; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            </div>
   
            <p>This is someone choosing the option on the left and winning +10 points.</p>
        </div>`,
        `<div class="instructions">
            <h2>READ CAREFULLY!</h2>
            <p>The value of the squares may change depending on features external to the squares. In the example below, the square has lost its value because the blue dot is positioned next to it.</p>
            <div class="squares-frame" style="margin: 30px auto; position: relative">
                <div style="width: 20px; height: 20px; background: blue; border-radius: 80%; position: absolute; left: 20px; top: 50%; transform: translateY(-50%)"></div>
                <div class="option-container">
                    <div class="option-wrapper">
                        <div class="square-option square-green selected" style="background-color: ${settings.instruction_colors[0]} !important;"></div>
                        <div class="reward-display">+0 points</div>
                    </div>
                    <div class="option-wrapper">
                        <div class="square-option square-purple" style="background-color: ${settings.instruction_colors[1]} !important;"></div>
                    </div>
                </div>
            </div>
            <p></p>
            <p>Make sure you identify all the rules that determine whether the square gives you points on a given trial.</p>
        </div>`
    ],
    show_clickable_nav: true
};

// Create teaching instructions separately
const teachingInstructions = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
            <h2>Instructions: Teaching (Demo Version)</h2>
            <p>Once you are done playing the game, we will ask you to write down a set of instructions for the next player.</p>
            <p>Unlike you, they won't have access to any instructions from us. <strong>ALL INSTRUCTIONS WILL COME FROM YOU</strong>.</p>
        </div>`,
        
        `<div class="instructions">
            <h2>Instructions: Teaching</h2>
            <p>You should try to transmit to future players any strategy you may have devised while you were doing the task. Your goal is to teach them how to gain as many points as possible.</p>
            <p>Keep in mind the game they will play <strong>will be exactly like yours</strong>, with the same rules, same values and even the same squares</p>
            <p>Note that the participants learning from you will be seeing the same squares. Focus on conveying the right strategy rather than talking about one square in particular.</p>
            <p><strong>Think of yourself as the teacher!</strong> Try to help your future student as much as you can!</p>
            <p>For reference, a good teaching text should be at least 250 characters long</p>
        </div>`,
        
        `<div class="instructions">
            <h2>Instructions: Teaching</h2>
            <p>At the end of the study, we will convert all collected points into pounds and add them to the fixed bonus provided by Prolific.</p>
            <p>The conversion rate is 1 point = 1.2 pence.</p>
            <p> <strong> But since you will be a teacher </strong>, your bonus earnings will not depend on the points you earn but rather on the points your pupil earns.</p>
            <p>It is therefore in your best interest to explain the task in the best possible way. If your pupil is good enough you could double your earnings!</p>
        </div>`
    ],
    show_clickable_nav: true
};

// Create teaching intro screen
const teachingIntro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Teaching Phase (Demo)</h2>
            <p>Thank you for going over the game. Now, the time has come for you to explain the game to your pupil, as clear as possible.</p>
        </div>
    `,
    choices: ["Continue"]
};

// Create teaching detailed instructions
const teachingDetails = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Teaching Instructions</h2>
            <p>Remember, they won't have access to any instructions from us. <strong>ALL INSTRUCTIONS WILL COME FROM YOU</strong>.</p>
            <p>Keep in mind the game they will play <strong>will be exactly like yours</strong>, with the same rules, same values and even the same squares.</p>
            <p>You really want your pupil to succeed! After all, remember your extra bonus depends on their performance.</p>
            <p>Also remember that a good teaching text is at least 250 characters, but of course you can extend yourself as much as you want. Don't hesitate to share tips, strategies, or any other piece of information that you think will help your pupil.</p>
        </div>
    `,
    choices: ["Continue to Write Instructions"]
};

// Create choice trial
function createChoiceTrial(trialType, trialIndex, squareOrder) {
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
            task: 'choice',
            square_order: squareOrder,
            trial_type_id: trialType.id,
            rewarding_option: trialType.rewardingOption,
            reward_probability: trialType.probability,
            block_type: 'learning'  // 16) Block type
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
            const unchosenOption = chosenOption === 0 ? 1 : 0;
            const reward = getReward(chosenOption, trialType);
            settings.totalReward += reward;
            
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

// Add test block instructions
const testBlockInstructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>First Part</h2>
            <p>Great job! You have completed the first part.</p>
            <p>We will now play Part 2 of the game. The game will remain the same as what you have seen before: everything you have learned about strategy and the point value of each square is still valid.</p>
            <p>The only difference is that now you will not see how many point you actually obtained after clicking on a square.</p>
        </div>
    `,
    choices: ["Start Test Block"]
};

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
    }
    
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

// Create teaching text entry screen
const teachingTextEntry = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Write Your Instructions</h2>
            <p>Please write your instructions for the next participant below:</p>
            <div class="text-entry-container">
                <textarea id="teaching-text" rows="10" cols="60" placeholder="Write your instructions here..."></textarea>
                <p id="char-count">0/250 characters</p>
            </div>
        </div>
    `,
    choices: ["Submit Instructions"],
    button_html: '<button class="jspsych-btn" id="submit-btn" disabled>%choice%</button>',
    data: {
        task: 'teaching_text'
    },
    on_load: function() {
        const textarea = document.getElementById('teaching-text');
        const charCount = document.getElementById('char-count');
        const submitBtn = document.getElementById('submit-btn');
        
        // Disable paste
        textarea.addEventListener('paste', function(e) {
            e.preventDefault();
            alert("Pasting text is not allowed. Please type your instructions.");
        });
        
        // Update character count on input
        textarea.addEventListener('input', function() {
            const count = textarea.value.length;
            charCount.textContent = count + '/250 characters';
            
            // Enable submit button if count >= 250
            if (count >= 250) {
                submitBtn.disabled = false;
                charCount.style.color = 'green';
            } else {
                submitBtn.disabled = true;
                charCount.style.color = 'red';
            }
        });
        
        // Store the teaching text in a global variable when the button is clicked
        submitBtn.addEventListener('click', function() {
            jsPsych.data.get().addToLast({
                teaching_text: textarea.value
            });
        });
    },
    on_finish: function(data) {
        // The teaching text is already saved via the button click event
    }
};

// Create a block break screen
function createBlockBreakScreen(phase, blockNumber, totalBlocks) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="instructions">
                <h2> Block ${blockNumber + 1} out of ${totalBlocks}</h2>
                <p>You've completed block ${blockNumber + 1} out of ${totalBlocks}.</p>

                <p>Take a short break if you need to. Click the button below when you're ready to continue.</p>
            </div>
        `,
        choices: ["Continue to Next Block"],
        data: {
            task: 'block_break',
            phase: phase,
            block_number: blockNumber
        }
    };
}

// Generate a sequence of trials for one learning block
function generateLearningBlockSequence() {
    let sequence = [];
    const trialsPerBlock = settings.blocks.learning.trialsPerBlock;
    
    // Create arrays for each trial type based on their proportions
    settings.trialTypes.forEach(type => {
        // Calculate trials for this block based on proportion
        const trialCount = Math.round(trialsPerBlock * type.proportion);
        for (let i = 0; i < trialCount; i++) {
            sequence.push({...type});
        }
    });
    
    // Adjust if the total doesn't match expected block size
    while (sequence.length > trialsPerBlock) {
        sequence.pop(); // Remove extra trials
    }
    while (sequence.length < trialsPerBlock) {
        // Add trials from the most common type
        const largestType = {...settings.trialTypes.reduce((a, b) => 
            (a.proportion > b.proportion) ? a : b)};
        sequence.push(largestType);
    }
    
    // Shuffle the sequence to interleave trial types
    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }
    
    return sequence;
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
    
    // Add demo notification
    // timeline.push({
    //     type: jsPsychHtmlButtonResponse,
    //     stimulus: `
    //         <div class="instructions">
    //             <h2>DEMO VERSION</h2>
    //             <p>You are running the demo version of this experiment.</p>
    //             <p>This version skips the quiz sections and is intended for testing and demonstration purposes only.</p>
    //         </div>
    //     `,
    //     choices: ["Continue to Instructions"]
    // });
    
    // Add the task instructions (no quiz)
    timeline.push(taskInstructions);
    
    // Add teaching instructions (no quiz)
    timeline.push(teachingInstructions);

    // Add learning blocks
    for (let blockIdx = 0; blockIdx < settings.blocks.learning.count; blockIdx++) {
        // Add block start instruction if it's not the first block
        if (blockIdx > 0) {
            timeline.push({
                type: jsPsychHtmlButtonResponse,
                stimulus: `
                    <div class="instructions">
                        <h2> Block ${blockIdx + 1}</h2>
                        <p>You are about to start block ${blockIdx + 1} of ${settings.blocks.learning.count}.</p>
                        <p>Remember, Your goal is to find the squares that will make you win the most points.</p>
                    </div>
                `,
                choices: ["Begin Block"],
                data: {
                    task: 'block_start',
                    phase: 'learning',
                    block_number: blockIdx
                }
            });
        }
        
        // Generate trial sequence for this block
        const blockSequence = generateLearningBlockSequence();
        
        // Calculate global trial index base for this block
        const blockTrialOffset = blockIdx * settings.blocks.learning.trialsPerBlock;
        
        // Add trials to the timeline
        for (let i = 0; i < blockSequence.length; i++) {
            // Get the trial type for this trial
            const trialType = blockSequence[i];
            
            // Calculate global trial index
            const globalTrialIndex = blockTrialOffset + i;
            
            // Generate random order for this trial pair
            const squareOrder = getRandomSquareOrder();
            
            // Add choice trial
            timeline.push(createChoiceTrial(trialType, globalTrialIndex, squareOrder));
            
            // Add feedback trial
            timeline.push(createFeedbackTrial(trialType, globalTrialIndex));
        }
        
        // Add block break if not the last block
        if (blockIdx < settings.blocks.learning.count - 1 && settings.blocks.learning.showBlockBreaks) {
            timeline.push(createBlockBreakScreen('learning', blockIdx, settings.blocks.learning.count));
        }
    }
    
    // Add test block instructions
    timeline.push(testBlockInstructions);
    
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
    
    // Add teaching phase trials
    timeline.push(teachingIntro);
    timeline.push(teachingDetails);
    timeline.push(teachingTextEntry);

    // Add final results
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            return `
                <div class="instructions">
                    <h2>Demo Complete!</h2>
                    <p>Thank you for participating in this demo.</p>
                    <p>You earned a total of ${settings.totalReward} points.</p>
                </div>
            `;
        },
        choices: ["Finish Demo"]
    });
    
    return timeline;
}
