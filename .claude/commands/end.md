# bobo-end Command

**Purpose**: Complete feature development with git commit and merge to main branch

**Usage**: When user types `/bobo-end`, Claude should:
1. Run final tests to ensure everything works
2. Create database backup before finalizing
3. Stage and commit all changes with descriptive message
4. Switch to main branch and merge feature branch
5. Update tasks.md with completion status
6. Clean up and summarize what was accomplished

**Expected Output Format**:
```
🏁 Feature Development Complete

Final Checks:
- ✅ Tests passed
- ✅ Database backed up
- ✅ All changes committed

Git Operations:
- ✅ Committed to feature branch: [commit message]
- ✅ Merged to main branch
- ✅ Feature branch cleaned up

Summary:
- Completed: [feature/task description]
- Files modified: [number] files
- Tests added/updated: [number] tests
- Ready for: [next development phase]
```

## Implementation

When `/bobo-end` is invoked:

1. **Run tests** to verify all functionality works correctly
2. **Backup database** using the backup utility
3. **Git operations**:
   - Stage all changes (`git add .`)
   - Commit with descriptive message
   - Switch to main branch (`git checkout main`)
   - Merge feature branch
   - Delete feature branch if requested
4. **Update documentation** if needed
5. **Report completion** with summary of accomplishments

This command provides a clean completion workflow for feature development following the project's git standards.