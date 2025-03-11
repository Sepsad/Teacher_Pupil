/* Define the trial types and create the timeline */

// Create instructions
const instructions = {
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
                <div class="option-wrapper">
                    <div class="square-option" style="background-color: #f1c40f !important;"></div>
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
                <img src="images/instruction.gif" alt="Task example" style="max-width: 60%; border: 1px solid #ccc; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
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
            <h2>Congratulations!</h2>
            <p>You have passed the quiz successfully and understand the task.</p>
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
        }
    ];
    
    // Create a loop for instructions and quiz
    const instructionLoop = {
        timeline: [instructions, quizQuestions, quizCheck],
        loop_function: function() {
            // Get the most recent quiz data
            const lastQuizData = jsPsych.data.get().last(1).values()[0]; // Skip the quizCheck trial
            console.log(lastQuizData);
            // If they failed the quiz, repeat the instructions and quiz
            return !lastQuizData.passed_quiz;
        }
    };
    
    // Add the instruction loop to the timeline
    timeline.push(instructionLoop);
    
    // Add congratulation message directly (not conditional)
    // This will show after they've passed the quiz and exited the instruction loop
    timeline.push(quizPassCongratulation);

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
