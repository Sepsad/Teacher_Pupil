/* Initialize jsPsych and run the experiment */

// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        jsPsych.data.displayData();
        jsPsych.data.get().localSave('csv', 'data_demo.csv');
    },
    display_element: 'jspsych-target' // Explicitly set the display element
});

// Run the experiment when the page loads
window.onload = function() {
    // Add demo mode indicator to console
    console.log("Running in DEMO mode");
    
    // Build the timeline
    const timeline = buildTimeline();
    
    // Run the experiment
    jsPsych.run(timeline);
};
