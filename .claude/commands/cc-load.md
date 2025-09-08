# cc-load
Restore saved session state and project context.

REQUIRED: Read `.specs/project-info.md` for project context
REQUIRED: Read `.specs/session.md` for current session state
REQUIRED: Read current feature tasks.md Status section for context
REQUIRED: Verify Git branch matches session state
REQUIRED: Validate all referenced files exist
REQUIRED: Display current status and next recommended actions

PROHIBITED: Proceeding if session state is inconsistent
PROHIBITED: Loading without validating file integrity
PROHIBITED: Assuming project state without verification

Recovery Sequence:
1. Load project information from project-info.md
2. Restore session state from session.md
3. Load current feature context from tasks.md Status section
4. Verify Git repository consistency
5. Validate all referenced files exist
6. Display current status and continuation options