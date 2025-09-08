# task Command

**Purpose**: Query tasks.md to understand current development progress and next development task

**Usage**: When user types `/task`, Claude should:
1. Read tasks.md file completely
2. Identify the current phase and active task status
3. Report the latest progress update
4. Identify and present the next development task to be worked on
5. Provide context on dependencies or prerequisites for the next task

**Expected Output Format**:
```
Current Phase: [Phase information from tasks.md]
Latest Progress: [Most recent progress update]
Next Task: [Specific next development task]
Prerequisites: [Any dependencies or requirements]
```

## Implementation

When the `/task` command is invoked:

1. Read the complete tasks.md file to get current status
2. Parse the development phases and identify the active phase
3. Extract the most recent progress updates (marked with ✅)
4. Identify the next pending task (marked with [ ] or 🎯)
5. Report any prerequisites or dependencies mentioned
6. Present the information in a structured format for easy understanding

This command helps maintain visibility into the current development status and ensures clear understanding of what needs to be done next.