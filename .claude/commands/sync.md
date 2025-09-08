# bobo-sync Command

**Purpose**: Synchronize current development progress with tasks.md documentation

**Usage**: When user types `/bobo-sync`, Claude should:
1. Read tasks.md to understand current task status
2. Analyze current project state (git status, new files, modified files)
3. Update tasks.md with actual progress based on current state
4. Recalculate completion percentages
5. Report what was synchronized

**Expected Output Format**:
```
🔄 Progress Synchronized

Updated Tasks:
- ✅ [Task name] - marked as completed
- ⏳ [Task name] - marked as in progress
- ❌ [Task name] - remains pending

Progress Updated:
- Module A: [old%] → [new%] (+[change]%)

Next Recommended Task: [suggested next task based on current progress]
```

## Implementation

When `/bobo-sync` is invoked:

1. **Read tasks.md** to get current task status and progress
2. **Analyze project state** using git status and file system
3. **Compare actual vs documented progress** to identify discrepancies
4. **Update task statuses** in tasks.md based on actual completion
5. **Recalculate progress percentages** for relevant modules
6. **Report changes** made during synchronization

This command ensures documentation stays aligned with actual development progress without manual updates.