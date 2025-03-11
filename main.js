/* Initialize jsPsych and run the experiment */

// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        jsPsych.data.displayData();
    },
    display_element: 'jspsych-target' // Explicitly set the display element
});

// Run the experiment when the page loads
window.onload = function() {
    // Build the timeline
    const timeline = buildTimeline();
    
    // Run the experiment
    jsPsych.run(timeline);
};
