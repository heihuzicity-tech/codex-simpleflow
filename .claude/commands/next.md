# bobo-next Command

**Purpose**: Continue development based on current task progress

**Usage**: When user types `/bobo-next`, Claude should:
1. Read tasks.md to identify current progress
2. Find the next pending task or module to work on
3. Analyze current project state to understand what's needed
4. Start implementing the next logical development task
5. Create todo list for the implementation steps

**Expected Output Format**:
```
🎯 Next Development Task

Current Status: [current module/phase completion status]
Next Task: [specific task to be implemented]
Scope: [brief description of what needs to be done]

Implementation Plan:
- [step 1]
- [step 2]
- [step 3]

Starting development...
```

## Implementation

When `/bobo-next` is invoked:

1. **Read tasks.md** to understand current completion status
2. **Identify next task** by finding first unchecked item or next module
3. **Analyze dependencies** to ensure prerequisites are met
4. **Create implementation plan** using TodoWrite tool
5. **Begin development** of the identified next task
6. **Update progress** as work is completed

This command provides seamless continuation of development workflow by automatically identifying and starting the next logical task.