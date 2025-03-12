/* Define the trial types and create the timeline */

// Create task instructions
const taskInstructions = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
            <h2>Welcome!</h2>
            <p>Thank you for choosing to take part in this study. We're happy to have you!</p>
            <p>With your help, we will try to understand a bit better how people learn new things and make decisions.</p>
            <p>Let's jump right into it!</p>
        </div>`,
        `<div class="instructions">
            <h2>Task Instructions</h2>
            <p>This experiment is a point-and-click game where you will select one of two squares displayed on the screen. Your goal is to identify the square that offers a higher reward.</p>
            <p>For example, here is what these squares might look like:</p>
            <div class="option-container" style="margin: 30px 0">
                <div class="option-wrapper">
                    <div class="square-option square-green" style="background-color: ${settings.instruction_colors[0]} !important;"></div>
                </div>
                <div class="option-wrapper">
                    <div class="square-option square-purple" style="background-color: ${settings.instruction_colors[1]} !important;"></div>
                </div>

            </div>
            <p>When you click, each square may give you winning points or nothing.</p>
            <p>When you are choosing between the squares, keep in mind that one of the symbols will be overall better than others at winning you points.</p>
            <p><strong>Note:</strong> The squares in the actual task will have different colors than shown here.</p>
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
            <h2>Instructions: Teaching</h2>
            <p>Once you are done playing the game, we will ask you to write down a set of instructions for the next player.</p>
            <p>Unlike you, they won't have access to any instructions from us. <strong>ALL INSTRUCTIONS WILL COME FROM YOU</strong>.</p>
        </div>`,
        
        `<div class="instructions">
            <h2>Instructions: Teaching</h2>
            <p>You should try to transmit to them any strategy you may have devised while you were doing the task. Your goal is to teach them how to gain as many points as possible.</p>
            <p>Keep in mind that the games they'll play will be exactly like yours, with the same rules that define the value of squares.</p>
            <p>Note that the participants learning from you will be seeing the same squares. Focus on conveying the right strategy rather than talking about one square in particular.</p>
            <p><strong>Think of yourself as the teacher!</strong> Try to help your future student as much as you can!</p>
            <p>For reference, research shows a good teaching text is at least 250 characters long.</p>
        </div>`,
        
        `<div class="instructions">
            <h2>Instructions: Teaching</h2>
            <p>At the end of the study, we will convert all collected points into pounds and add them to the fixed bonus provided by Prolific.</p>
            <p>The conversion rate is 1 point = 1.2 pence.</p>
            <p>But since you will be a teacher, your bonus earnings will not depend on the points you earn but rather on the points your pupil earns.</p>
            <p>It is therefore in your best interest that you explain the task in the best possible way. If your pupil is good, you could double your earnings!</p>
        </div>`
    ],
    show_clickable_nav: true
};

// Quiz questions
const quizQuestions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Quiz</h2>
            <p>Please answer the following questions to confirm you understand the task:</p>
            
            <div class="quiz-question">
                <p>1. Some squares provide better rewards than others.</p>
                <div class="quiz-options">
                    <label><input type="radio" name="q1" value="true"> True</label>
                    <label><input type="radio" name="q1" value="false"> False</label>
                </div>
            </div>
            
            <div class="quiz-question">
                <p>2. You will see the outcome of the square you clicked on, but not the outcome of the square you did not click on.</p>
                <div class="quiz-options">
                    <label><input type="radio" name="q2" value="true"> True</label>
                    <label><input type="radio" name="q2" value="false"> False</label>
                </div>
            </div>
            
            <div class="quiz-question">
                <p>3. The value of each square remains the same regardless of visual cues.</p>
                <div class="quiz-options">
                    <label><input type="radio" name="q3" value="true"> True</label>
                    <label><input type="radio" name="q3" value="false"> False</label>
                </div>
            </div>
        </div>
    `,
    choices: ["Submit Answers"],
    data: {
        answers: {}
    },
    on_load: function() {
        // Add validation before continuing
        document.querySelector('.jspsych-btn').addEventListener('click', function(e) {
            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');
            const q3 = document.querySelector('input[name="q3"]:checked');

            if (!q1 || !q2 || !q3) {
                e.preventDefault();
                alert("Please answer all questions before continuing.");
                return false;
            }
            
            // Store answers in trial data when validation passes
            jsPsych.getCurrentTrial().data.answers = {
                q1: q1.value,
                q2: q2.value,
                q3: q3.value
            };
        });
    },
    on_finish: function(data) {
        // Use the answers saved during on_load
        const answers = data.answers;
        
        // Save individual answers to data
        data.q1 = answers.q1;
        data.q2 = answers.q2;
        data.q3 = answers.q3;
        
        // Check if answers are correct
        const correctAnswers = {
            q1: "true",
            q2: "true", 
            q3: "false"
        };
        
        data.passed_quiz = (
            data.q1 === correctAnswers.q1 &&
            data.q2 === correctAnswers.q2 &&
            data.q3 === correctAnswers.q3
        );
        console.log(data.passed_quiz);
    }
};

// Create a conditional node to check quiz results
const quizCheck = {
    timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="instructions">
                <h2>Quiz Results</h2>
                <p>You did not pass the quiz. Please review the instructions again.</p>
                <p>Pay careful attention to how the value of squares may change based on visual cues.</p>
            </div>
        `,
        choices: ["Review Instructions"]
    }],
    conditional_function: function() {
        // Get the last quiz data
        const lastQuizData = jsPsych.data.get().last(1).values()[0];
        // Return true to run the conditional timeline if they failed the quiz
        return !lastQuizData.passed_quiz;
    }
};

// Fix the quiz pass congratulation - make it a regular node, not conditional
const quizPassCongratulation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Fantastic!</h2>
            <p>You have passed the quiz successfully and understand the main task.</p>
            <p>Before we begin, you need to learn about your role as a teacher in this experiment.</p>
        </div>
    `,
    choices: ["Continue to Teaching Instructions"]
};

// Create teaching quiz questions
const teachingQuizQuestions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Teaching Quiz</h2>
            <p>Please answer the following questions to confirm you understand the teaching task:</p>
            
            <div class="quiz-question">
                <p>1. The final bonus payoff depends on the combined choices of you and your pupil.</p>
                <div class="quiz-options">
                    <label><input type="radio" name="tq1" value="true"> True</label>
                    <label><input type="radio" name="tq1" value="false"> False</label>
                </div>
            </div>
            
            <div class="quiz-question">
                <p>2. You will need to write a set of instructions and strategies to guide your future pupil. A good lesson must be at least 250 characters long.</p>
                <div class="quiz-options">
                    <label><input type="radio" name="tq2" value="true"> True</label>
                    <label><input type="radio" name="tq2" value="false"> False</label>
                </div>
            </div>
            
            <div class="quiz-question">
                <p>3. Your future pupil will see the same symbols as you, with the same rules and same reward points.</p>
                <div class="quiz-options">
                    <label><input type="radio" name="tq3" value="true"> True</label>
                    <label><input type="radio" name="tq3" value="false"> False</label>
                </div>
            </div>
        </div>
    `,
    choices: ["Submit Answers"],
    data: {
        answers: {}
    },
    on_load: function() {
        // Add validation before continuing
        document.querySelector('.jspsych-btn').addEventListener('click', function(e) {
            const q1 = document.querySelector('input[name="tq1"]:checked');
            const q2 = document.querySelector('input[name="tq2"]:checked');
            const q3 = document.querySelector('input[name="tq3"]:checked');

            if (!q1 || !q2 || !q3) {
                e.preventDefault();
                alert("Please answer all questions before continuing.");
                return false;
            }
            
            // Store answers in trial data when validation passes
            jsPsych.getCurrentTrial().data.answers = {
                q1: q1.value,
                q2: q2.value,
                q3: q3.value
            };
        });
    },
    on_finish: function(data) {
        // Use the answers saved during on_load
        const answers = data.answers;
        
        // Save individual answers to data
        data.tq1 = answers.q1;
        data.tq2 = answers.q2;
        data.tq3 = answers.q3;
        
        // Check if answers are correct
        const correctAnswers = {
            q1: "true",
            q2: "true", 
            q3: "true"
        };
        
        data.passed_teaching_quiz = (
            data.tq1 === correctAnswers.q1 &&
            data.tq2 === correctAnswers.q2 &&
            data.tq3 === correctAnswers.q3
        );
        console.log("Teaching quiz passed:", data.passed_teaching_quiz);
    }
};

// Create a conditional node to check teaching quiz results
const teachingQuizCheck = {
    timeline: [{
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div class="instructions">
                <h2>Teaching Quiz Results</h2>
                <p>You did not pass the teaching quiz. Please review the instructions again.</p>
                <p>Pay careful attention to how the teaching component works and your role as a teacher.</p>
            </div>
        `,
        choices: ["Review Instructions"]
    }],
    conditional_function: function() {
        // Get the last quiz data
        const lastQuizData = jsPsych.data.get().last(1).values()[0];
        // Return true to run the conditional timeline if they failed the quiz
        return !lastQuizData.passed_teaching_quiz;
    }
};

// Teaching quiz pass congratulation
const teachingQuizPassCongratulation = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Great Job!</h2>
            <p>You have passed the teaching quiz successfully and understand your role as a teacher.</p>
            <p>You are now ready to begin the experiment.</p>
        </div>
    `,
    choices: ["Begin Experiment"]
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
            <h2>Test Block</h2>
            <p>Great job! You have completed the learning phase.</p>
            <p>Now we will test what you have learned. You will see the same types of trials, but you will <strong>not receive feedback</strong> after your choices.</p>
            <p>This test consists of 30 trials. Try to apply what you learned to maximize your points!</p>
            <p>Your points will still be counted toward your final score, even though you won't see them immediately.</p>
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

// Create teaching intro screen
const teachingIntro = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
        <div class="instructions">
            <h2>Teaching Phase</h2>
            <p>Thank you for going over the game. Now, the time has come for you to transfer your strategies to your future pupil.</p>
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
            <p>Also important, the options they will have to choose from will have the same value as yours, but they will be represented by different symbols, so focus on the concepts and strategies rather than one concrete symbol's shape or color since they won't be the same anyway.</p>
            <p>You really want your pupil to succeed! After all, remember your extra bonus depends on their performance.</p>
            <p>Also remember that a good teaching text is at least 250 characters, but of course you can extend yourself as much as you want. Don't hesitate to share tips, strategies, or any other piece of information that you think will help your pupil.</p>
        </div>
    `,
    choices: ["Continue to Write Instructions"]
};

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
                <h2>${phase === 'learning' ? 'Learning' : 'Test'} Block ${blockNumber + 1} of ${totalBlocks} Complete</h2>
                <p>You've completed block ${blockNumber + 1} of ${totalBlocks}.</p>

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
    
    // Create a loop for task instructions and quiz
    const taskInstructionLoop = {
        timeline: [taskInstructions, quizQuestions, quizCheck],
        loop_function: function() {
            // Get the most recent quiz data
            const lastQuizData = jsPsych.data.get().last(1).values()[0];
            // If they failed the quiz, repeat the instructions and quiz
            return !lastQuizData.passed_quiz;
        }
    };
    
    // Add the task instruction loop to the timeline
    timeline.push(taskInstructionLoop);
    
    // Add task quiz congratulation message
    timeline.push(quizPassCongratulation);
    
    // Create a loop for teaching instructions and quiz
    const teachingInstructionLoop = {
        timeline: [teachingInstructions, teachingQuizQuestions, teachingQuizCheck],
        loop_function: function() {
            // Get the most recent quiz data
            const lastQuizData = jsPsych.data.get().last(1).values()[0];
            // If they failed the quiz, repeat the instructions and quiz
            return !lastQuizData.passed_teaching_quiz;
        }
    };
    
    // Add the teaching instruction loop to the timeline
    timeline.push(teachingInstructionLoop);
    
    // Add teaching quiz congratulation message
    timeline.push(teachingQuizPassCongratulation);

    // Add learning blocks
    for (let blockIdx = 0; blockIdx < settings.blocks.learning.count; blockIdx++) {
        // Add block start instruction if it's not the first block
        if (blockIdx > 0) {
            timeline.push({
                type: jsPsychHtmlButtonResponse,
                stimulus: `
                    <div class="instructions">
                        <h2>Learning Block ${blockIdx + 1}</h2>
                        <p>You are about to start learning block ${blockIdx + 1} of ${settings.blocks.learning.count}.</p>
                        <p>Remember, your goal is to identify which squares offer higher rewards in different contexts.</p>
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
    timeline.push(createFinalScreen());
    
    return timeline;
}
