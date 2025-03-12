/* Helper functions */

// Get reward based on chosen option and trial type
function getReward(option, trialType) {
    // If the chosen option is the rewarding one
    if (option === trialType.rewardingOption) {
        // Apply probability - generate random number between 0 and 1
        const randomValue = Math.random();
        // If random number is less than probability, give reward
        if (randomValue < trialType.probability) {
            return trialType.reward;
        }
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

// Generate HTML for a trial display
function createTrialHTML(trialType, squareOrder, trialIndex, showReward = false, chosenOption = null, reward = 0) {
    // Create triangle indicator HTML if needed
    const triangleHTML = trialType.hasTriangle ? '<div class="triangle-indicator"></div>' : '';
    
    // Create HTML with a background frame containing both squares
    let html = 
    // `
    //     <div class="total-display">Total Points: ${settings.totalReward}</div>
    //     <div class="trial-info">
    //         <h2>Trial ${trialIndex + 1} of ${settings.nb_trials}</h2>
    //         <p>${showReward ? 'Your result:' : 'Choose a square:'}</p>
    //     </div>` +
        
       ` <div class="squares-frame ${trialType.frameClass}">
            ${triangleHTML}
            <div class="option-container">`;
    
    // Create both squares with the correct order
    for (let i = 0; i < 2; i++) {
        const isSelected = showReward && squareOrder[i] === chosenOption;
        
        // If this is a feedback trial (showReward=true), don't use jspsych-html-button-response-button class
        // to avoid conflicts with the Continue button
        const buttonClass = showReward ? 
            `square-option ${squareOrder[i] === 0 ? 'square-blue' : 'square-red'} ${isSelected ? 'selected' : ''}` :
            `jspsych-html-button-response-button square-option ${squareOrder[i] === 0 ? 'square-blue' : 'square-red'}`;
            
        html += `
            <div class="option-wrapper">
                <div ${!showReward ? `id="jspsych-html-button-response-button-${squareOrder[i]}"` : ''} 
                     class="${buttonClass}" 
                     style="background-color: ${settings.option_colors[squareOrder[i]]} !important;" 
                     ${!showReward ? `data-choice="${squareOrder[i]}"` : ''}>
                </div>
                ${isSelected ? `<div class="reward-display">+${reward} points!</div>` : ''}
            </div>`;
    }
    
    html += `</div>
        </div>`;
    
    return html;
}
