# Data Dictionary for Teacher-Pupil Experiment

This document explains each data field recorded during the experiment for proper interpretation of results.

## Trial Data Fields

### Common Fields (All Trials)

| Field | Type | Description |
|-------|------|-------------|
| `trial_index` | Integer | Sequential index of the trial within the entire experiment |
| `task` | String | Type of trial ('choice', 'feedback', 'test', 'teaching_text') |
| `rt` | Float | Response time in milliseconds |
| `trial_type_id` | String | The condition ID ('plain', 'hatched', 'triangle') |
| `square_order` | Array | Order of squares presented [0,1] or [1,0] |

### Choice Trial Fields

| Field | Type | Description |
|-------|------|-------------|
| `response` | Integer | Index of selected option (0 or 1) |
| `chosen_option` | Integer | Same as response, the option chosen by participant |
| `rewarding_option` | Integer | The option that gives reward (0 or 1) |
| `reward` | Integer | Points earned from the choice (typically 0 or 10) |
| `total_reward` | Integer | Cumulative points earned up to this trial |

### Test Phase Fields

| Field | Type | Description |
|-------|------|-------------|
| `phase` | String | Indicates 'test' for the test phase trials |

### Quiz Fields

| Field | Type | Description |
|-------|------|-------------|
| `q1`, `q2`, `q3` | String | Answers to task quiz questions ('true' or 'false') |
| `passed_quiz` | Boolean | Whether participant passed the task quiz |
| `tq1`, `tq2`, `tq3` | String | Answers to teaching quiz questions ('true' or 'false') |
| `passed_teaching_quiz` | Boolean | Whether participant passed the teaching quiz |

### Teaching Data

| Field | Type | Description |
|-------|------|-------------|
| `teaching_text` | String | Instructions written by participant for future learners |

## Trial Types

| Trial Type | Description |
|------------|-------------|
| `plain` | Standard background with no special visual features |
| `hatched` | Background with a hatched pattern |
| `triangle` | Hatched background with a triangle indicator |

## Option Colors

The experiment randomly assigns a color pair from the available options in `config.js`. The data store records which colors were used but participants only see the numerical indices (0 and 1).

## Rewarding Options

| Value | Meaning |
|-------|---------|
| 0 | First color in the pair is rewarding |
| 1 | Second color in the pair is rewarding |

## Reward Structure

- Plain background: The second color (index 1) is rewarding
- Hatched background: The first color (index 0) is rewarding
- Triangle indicator: The second color (index 1) is rewarding

## Response Time (RT)

Response time is measured from when the options appear until the participant makes a selection. In the test phase, this does not include the 500ms delay where the selected option is highlighted.
