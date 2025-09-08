# cc-fix
Initiate bug fix workflow within existing feature context.

REQUIRED: Detect current feature from session.md or prompt user
REQUIRED: Ensure Git working directory is clean before starting
REQUIRED: Create `.specs/fix-{bug_name}/` directory  
REQUIRED: Create requirements.md (bug description), design.md (fix approach), tasks.md (fix steps)
REQUIRED: Use intelligent branch strategy based on current Git state

PROHIBITED: Expanding scope beyond reported bug without user approval
PROHIBITED: Starting fix with dirty working directory
PROHIBITED: Skipping bug documentation requirements

Bug Fix Workflow:
1. Identify current feature context
2. Ensure clean Git state
3. Create bug documentation structure
4. Document problem, analysis, and fix tasks
5. Implement minimal fix within scope
6. Validate fix against original bug report