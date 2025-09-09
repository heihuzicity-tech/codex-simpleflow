# CC Workflow System Configuration

## File Structure
All feature specifications are stored in: `.specs/{feature_name}/`
- `requirements.md` - What to build
- `design.md` - How to build  
- `tasks.md` - Step by step implementation with progress tracking

## Global Files
- `.specs/session.md` - Current session state
- `.specs/project-info.md` - Project context and configuration

## Directory Organization
```
.specs/
├── project-info.md          # Project context (created by cc-info)
├── session.md               # Current session state (updated by cc-save)
└── {feature_name}/
    ├── requirements.md      # Feature requirements
    ├── design.md           # Technical design
    ├── tasks.md            # Implementation tasks with progress
    └── summary.md          # Feature completion summary (created by cc-end)
```

## Simplified Document Templates

### requirements.md Template
```markdown
# {feature_name} Requirements

## What we need
{user_description_in_plain_language}

## Input & Output
**Input**: {specific_input_format}
**Output**: {expected_output_format}

## Success criteria
- [ ] {testable_success_criterion_1}
- [ ] {testable_success_criterion_2}

## Edge cases
- {edge_case_description}: {handling_approach}
```

### design.md Template  
```markdown
# {feature_name} Design

## API contracts
**Endpoint**: {HTTP_method} {URL_path}
**Request**: {request_format}
**Response**: {response_format}  
**Errors**: {error_codes_and_meanings}

## Key decisions
- **Tech choice**: {selected_technology} - {selection_reason}
- **Data flow**: {data_flow_description}

## Integration points
- {integration_point_description}
```

### tasks.md Template
```markdown
# {feature_name} Tasks

## Progress
Goal: {goal_from_requirements}
Status: {completed}/{total} ({percentage}%)
Current: {current_task_description}
Next: {next_task_description}

## Tasks
- [ ] 1. {task_description} - {ref: requirements X.X, design Y.Y}
- [x] 2. {completed_task} - {verification_note}
- [ ] 3. {next_task} - {ref: requirements X.X}

## Notes
{development_discoveries_and_important_issues}
```

## Anti-Deviation Rules

### Documentation-Code Sync Rules
- Each task MUST reference specific requirements/design sections
- Mark task complete only after verifying against referenced specs
- Implementation that differs from design MUST update design.md first
- Log all design changes in tasks.md notes section

### cc-sync Enhanced Validation
- Compare tasks.md progress with actual code implementation
- Verify design.md API contracts match implemented APIs
- Check requirements.md success criteria against working features
- Report documentation-code mismatches with evidence

### Reading Strategy Optimization
- **cc-task**: Read only tasks.md Progress section for quick status
- **cc-next**: Read tasks.md + referenced requirements/design sections as needed
- **cc-sync**: Read all three documents for comprehensive validation

## Command Behavior Standards

### cc-start Workflow
1. Generate requirements.md from user description
2. Create design.md with technical decisions  
3. Break down into tasks.md with requirement/design references
4. Each document serves distinct purpose and focus

### cc-next Execution  
1. Read task references to load relevant requirements/design context
2. Implement according to specifications
3. Test implementation thoroughly (run code, verify functionality)
4. Present results and request user confirmation of completion
5. Only after user confirms: Update progress and mark task complete

### cc-sync Validation
1. Cross-check all three documents against actual implementation
2. Flag mismatches between documentation and code
3. Update task progress based on code evidence
4. Require user confirmation for design/requirement changes

## Error Prevention
- Prevent scope creep by requiring requirement references
- Maintain API consistency through design.md contracts
- Ensure implementation fidelity through verification requirements
- Enforce quality control through testing and user confirmation before task completion
- Enable reliable multi-session development through clear specifications

## Script and Command Standards

### Shell Script Requirements
- **REQUIRED**: Create bash shell scripts (.sh) exclusively
- **PROHIBITED**: Creating .bat (batch) or .ps1 (PowerShell) scripts under any circumstances
- **REQUIRED**: Use bash commands compatible with Linux, macOS, and Windows (WSL/Git Bash)
- **REQUIRED**: Prioritize bash/Unix commands over Windows-specific commands
- **REQUIRED**: Assume Git Bash or WSL availability for bash execution on Windows systems

### Service Management Standards
- **REQUIRED**: All service status management (build, start, stop, restart, status) must use dedicated service management scripts
- **REQUIRED**: Create centralized service management scripts for consistent operations
- **PROHIBITED**: Direct command execution for service operations without using management scripts
- **REQUIRED**: Service management scripts must provide standardized interface for:
  - `./service.sh build` - Build service/application
  - `./service.sh start` - Start service/application
  - `./service.sh stop` - Stop service/application
  - `./service.sh restart` - Restart service/application
  - `./service.sh status` - Check service/application status
- **REQUIRED**: Management scripts must handle error conditions and provide clear feedback
- **REQUIRED**: Scripts must be idempotent (safe to run multiple times)

### Port Conflict Resolution
- **REQUIRED**: When port conflicts are detected, kill the conflicting processes instead of changing port numbers
- **PROHIBITED**: Automatically switching to alternative ports when conflicts occur
- **REQUIRED**: Service management scripts must identify and terminate processes occupying required ports
- **REQUIRED**: Provide clear feedback about which processes were terminated and why
- **REQUIRED**: Use platform-appropriate commands for process identification and termination:
  - Linux/macOS: `lsof -ti:PORT | xargs kill -9` or `fuser -k PORT/tcp`
  - Windows (WSL/Git Bash): `netstat -ano | findstr :PORT` then `taskkill /PID`

## User-Friendly Error Messages

### Common Error Situations and Responses

1. **Dirty Git State**
   - Error: "Git working directory not clean"
   - Solution: "Please commit or stash your changes before starting: `git status` then `git add -A && git commit -m 'Work in progress'`"

2. **Missing Session State**
   - Error: "No session.md found"
   - Solution: "Run `cc-load` to restore session or `cc-start` to begin new feature"

3. **Inconsistent Documentation**
   - Error: "Task marked complete but implementation not found"
   - Solution: "Run `cc-sync` to align documentation with actual code"

4. **Document Too Complex**
   - Error: "Document structure unclear"
   - Solution: "Break down into clear sections with specific focus areas"

5. **Missing References**
   - Error: "Task lacks requirement/design references"
   - Solution: "Add `{ref: requirements X.X}` to specify which requirement this task fulfills"

### User Guidance Templates

**First Time User**:
```
Welcome to CC Workflow! Start with:
1. cc-info (set up project information)
2. cc-start (begin your first feature)
3. cc-task (check current status anytime)
```

**Session Recovery**:
```
Returning to work? Use:
1. cc-load (restore your session)
2. cc-task (see where you left off)
3. cc-next (continue development)
```

**When Stuck**:
```
Need help? Try:
1. cc-sync (check documentation consistency)
2. cc-task (see current status)
3. Check QUICK_REFERENCE.md for command guide
```

---

**Document Status**: CC Workflow System Configuration Complete
**Purpose**: Enable consistent, lightweight, multi-session development workflow  
**Principle**: Simple documents, clear separation, reliable synchronization
**User Focus**: Clear guidance, helpful errors, intuitive workflow