/* Experiment parameters */
const settings = {
    // Block structure configuration
    blocks: {
        learning: {
            count: 3,           // Number of learning blocks
            trialsPerBlock: 6, // Trials per learning block (should be divisible by 3)
            showBlockBreaks: true // Show break between blocks
        },
        test: {
            count: 1,           // Number of test blocks
            trialsPerBlock: 30, // Trials per test block (should be divisible by 3 for equal distribution)
            showBlockBreaks: true // Show break between blocks
        }
    },
    nb_trials: 30, // Change this value to adjust the total number of trials
    // Define multiple color pairs for the squares
    colorPairs: [
        ["#3498db", "#e74c3c"], // Blue and Red
        ["#f39c12", "#1abc9c"], // Orange and Teal
        ["#d35400", "#16a085"],  // Dark Orange and Sea Green
        ["#27ae60", "#e84393"], // Dark Green and Pink
        ["#2980b9", "#f1c40f"], // Dark Blue and Yellow
        ["#c0392b", "#2ecc71"], // Dark Red and Bright Green
        // ["#2ecc71", "#9b59b6"] // Green and Purple for instructions

    ],
    option_colors: [], // Will be set randomly on initialization
    instruction_colors: ["#2ecc71", "#9b59b6"], // Green and Purple for instructions
    totalReward: 0,
    currentBlock: 0,  // Track the current block number
    // Trial types configuration with proportions instead of absolute counts
    trialTypes: [
        {
            id: 'plain',      // Plain background, red rewarding
            proportion: 0.5,  // 50% of trials
            frameClass: '',
            rewardingOption: 1, // 1 is the second color in the pair
            reward: 10,         // Fixed reward value
            probability: 1.0    // 100% chance of reward (deterministic)
        },
        {
            id: 'hatched',    // Hatched background, blue rewarding
            proportion: 0.33, // ~33% of trials
            frameClass: 'hatched',
            rewardingOption: 0, // 0 is the first color in the pair
            reward: 10,         // Fixed reward value
            probability: 1.0    // 100% chance of reward (deterministic)
        },
        {
            id: 'triangle',   // Hatched with triangle, red rewarding
            proportion: 0.17, // ~17% of trials
            frameClass: 'hatched',
            hasTriangle: true,
            rewardingOption: 1, // 1 is the second color in the pair
            reward: 10,         // Fixed reward value
            probability: 1.0    // 100% chance of reward (deterministic)
        }
    ]
};

// Calculate actual trial counts based on proportions
function calculateTrialCounts() {
    // First calculate raw counts
    settings.trialTypes.forEach(type => {
        type.count = Math.round(settings.nb_trials * type.proportion);
    });
    
    // Check total and adjust if needed
    let totalCount = settings.trialTypes.reduce((sum, type) => sum + type.count, 0);
    
    // If there's a discrepancy, adjust the largest trial type count
    if (totalCount !== settings.nb_trials) {
        const diff = settings.nb_trials - totalCount;
        // Find type with largest count
        const largestType = settings.trialTypes.reduce((a, b) => 
            (a.count > b.count) ? a : b);
        largestType.count += diff;
    }
    
    console.log("Trial counts:", settings.trialTypes.map(t => ({id: t.id, count: t.count})));
}

// Function to randomly select a color pair
function selectRandomColorPair() {
    const randomIndex = Math.floor(Math.random() * settings.colorPairs.length);
    settings.option_colors = settings.colorPairs[randomIndex];
    console.log("Selected color pair:", settings.option_colors);
}

// Calculate total trials across all learning blocks
function calculateTotalLearningTrials() {
    return settings.blocks.learning.count * settings.blocks.learning.trialsPerBlock;
}

// Initialize block-specific settings
function initializeBlockSettings() {
    // Store total learning trials for reference
    settings.totalLearningTrials = calculateTotalLearningTrials();
    
    // Calculate trial counts for each trial type (per block)
    calculateTrialCounts();
    
    console.log(`Experiment configured with ${settings.blocks.learning.count} learning blocks of ${settings.blocks.learning.trialsPerBlock} trials each`);
    console.log(`Test phase has ${settings.blocks.test.count} blocks of ${settings.blocks.test.trialsPerBlock} trials each`);
}

// Call initialization functions
selectRandomColorPair();
initializeBlockSettings();
