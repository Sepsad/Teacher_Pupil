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
