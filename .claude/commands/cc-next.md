# cc-next
Execute the next uncompleted task from tasks.md.

REQUIRED: Read tasks.md Progress and Tasks sections before execution
REQUIRED: Read relevant requirements.md and design.md sections based on task references
REQUIRED: Execute ONLY one task at a time
REQUIRED: Update task status in tasks.md during execution
REQUIRED: Test implementation after completion
REQUIRED: Wait for user confirmation that task is truly complete
REQUIRED: Update Progress section only after user confirmation
REQUIRED: Verify implementation meets referenced requirements/design specs

PROHIBITED: Executing multiple tasks without user confirmation
PROHIBITED: Automatically proceeding to next task
PROHIBITED: Marking task complete without testing and user verification
PROHIBITED: Skipping progress updates

Execution Flow:
1. Locate next uncompleted task from Tasks section (by task number)
2. Read referenced requirements.md and design.md sections 
3. Update Progress section: Current = task being worked on
4. Implement task according to requirements and design specs
5. Test implementation (run code, check functionality, verify output)
6. Present implementation results and testing evidence to user
7. Ask user: "Does this task meet requirements and work correctly? Confirm completion?"
8. ONLY after user confirms: Mark task as completed [x] with verification note
9. Update Progress section: Progress percentage and Next action
10. Wait for user instruction before continuing to next task