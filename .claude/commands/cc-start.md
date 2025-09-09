# cc-start
Initialize new feature development workflow with safety checks and database backup.

REQUIRED: Perform safety checks and load project context before starting
REQUIRED: Detect database configurations and execute backup if found
REQUIRED: Ask user confirmation if no database configuration detected
REQUIRED: Ensure Git working directory is clean before branch creation
REQUIRED: Create feature branch with format `feature/{name}`
REQUIRED: Create `.specs/{feature_name}/` directory structure  
REQUIRED: Generate three simplified documents: requirements.md, design.md, tasks.md
REQUIRED: Ask user to describe feature in plain language
REQUIRED: Iterate with user through requirements discussion process
REQUIRED: Focus on understanding user's actual needs and scope preferences
REQUIRED: Continue until user explicitly confirms the final requirements
REQUIRED: Follow simplified workflow: requirements → design → tasks

PROHIBITED: Proceeding without database backup when database detected
PROHIBITED: Starting with dirty Git working directory
PROHIBITED: Using complex academic documentation formats
PROHIBITED: Creating overdesigned specifications

Simplified Workflow Sequence:
1. Safety checks and project context loading
2. Database backup (immediate if detected, ask if not)  
3. Git working directory verification and branch creation
4. Ask user: "What feature do you want to build?" and gather detailed requirements
5. Iterate with user to clarify requirements until user confirms
6. Generate requirements.md (what to build)
7. Generate design.md (how to build)
8. Generate tasks.md (step by step)
9. Create session.md for session tracking
10. Ready to start development with cc-next

Requirements Template:
```
# {feature_name} Requirements

## What we need
{user_description}

## Input & Output
**Input**: {input_format}
**Output**: {expected_output}

## Success criteria
- [ ] {success_criterion_1}
- [ ] {success_criterion_2}

## Edge cases  
- {edge_case}: {handling}
```

Design Template:
```
# {feature_name} Design

## API contracts
**Endpoint**: {method + url}
**Request**: {request_format}
**Response**: {response_format}
**Errors**: {error_codes}

## Key decisions
- **Tech choice**: {technology} - {reason}
- **Data flow**: {flow_description}

## Integration points
- {integration_description}
```

Tasks Template:
```
# {feature_name} Tasks

## Progress
Goal: {from_requirements}
Status: 0/{total} (0%)
Current: Ready to start
Next: {first_task}

## Tasks
- [ ] 1. {task_1} - {ref: requirements X.X, design Y.Y}
- [ ] 2. {task_2} - {ref: requirements X.X}
- [ ] 3. {task_3} - {ref: requirements X.X, design Y.Y}

## Notes
{development_discoveries}
```

Session Template:
```
# Session: {feature_name}
Stage: Development started
Task: Ready to start - {first_task}
Branch: feature/{feature_name}
Progress: 0/{total} (0%)
Next: cc-next to execute first task
Modified: {timestamp}
```