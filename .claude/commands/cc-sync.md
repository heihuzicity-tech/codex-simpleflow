# cc-sync
Synchronize actual development progress with documentation and detect implementation-design mismatches.

REQUIRED: Read all three documents (requirements.md, design.md, tasks.md) 
REQUIRED: Scan project files mentioned in completed tasks
REQUIRED: Verify implementation exists for tasks marked complete
REQUIRED: Check design.md API contracts match implemented APIs
REQUIRED: Verify requirements.md success criteria match working features
REQUIRED: Generate comprehensive sync report showing discrepancies
REQUIRED: Update tasks.md Tasks and Progress sections with actual status
REQUIRED: Flag design-implementation mismatches for user review
REQUIRED: Commit documentation updates with sync message

PROHIBITED: Making status changes without code verification
PROHIBITED: Changing task completion without evidence
PROHIBITED: Auto-updating design without user confirmation

Enhanced Sync Process:
1. Compare tasks.md status vs actual code implementation
2. Compare design.md API contracts vs implemented APIs
3. Compare requirements.md success criteria vs working features  
4. Report all documentation-code mismatches with evidence
5. Update tasks.md with correct completion status
6. Update tasks.md Progress section with corrected percentage
7. Flag design/requirements inconsistencies for user decision
8. Commit changes with detailed sync report