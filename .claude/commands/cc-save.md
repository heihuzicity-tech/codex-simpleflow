# cc-save
Save current development progress for session recovery.

REQUIRED: Use mandatory template for session.md
REQUIRED: Commit current changes with checkpoint message

PROHIBITED: Including detailed history or complete task lists
PROHIBITED: Saving without Git checkpoint

Mandatory Template:
```
# Session: {feature_name}
Stage: {current_stage}
Task: {current_task_id} - {brief_description}
Branch: {git_branch}
Progress: {completed}/{total} ({percentage}%)
Next: {next_action}
Modified: {timestamp}
```

Save Sequence:
1. Generate session using mandatory template only
2. Commit current work with checkpoint message
3. Save session.md