# cc-task
Query current project status and task information.

REQUIRED: Read `.specs/session.md` for current context
REQUIRED: Read `.specs/{feature_name}/tasks.md` Progress section for current status  
REQUIRED: Calculate completion percentage based on task status
REQUIRED: Display current feature, active task, and next recommended action

PROHIBITED: Making assumptions about project state without reading files
PROHIBITED: Proceeding without displaying current status

Output Format:
```
Current Feature: {feature_name}
Active Task: {task_id} - {task_description}
Progress: {completed}/{total} tasks ({percentage}%)
Next Action: {recommended_next_step}
```