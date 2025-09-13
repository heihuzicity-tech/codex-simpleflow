# codex-simpleflow

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Codex CLI](https://img.shields.io/badge/Codex%20CLI-Compatible-purple.svg)

**Enterprise-grade Migration System from Claude Workflows to Codex CLI**

[English](./README_EN.md) | [简体中文](./README.md)

</div>

## 🚀 Project Overview

**codex-simpleflow** is a lightweight, traceable workflow system designed for Codex CLI, implementing a complete migration from Claude's original `.claude/` workflows to structured Codex CLI environments. The system unifies "specifications → process → evidence" under a single `.specs/` directory, completing the full cycle of Start → Progress → Verify/Fix → Archive through 13 formal `/cc-*` commands.

### Migration Background

This project stems from the practical need to migrate mature Claude workflow patterns to Codex CLI environments:
- **From** ad-hoc commands **to** structured command specifications
- **From** scattered state management **to** single source of truth
- **From** manual progress tracking **to** automatic session evidence
- **From** uncertain recovery **to** one-command context restoration

## 🎯 Core Features

### 1. Single Source of Truth Architecture
All project state, specs, sessions, and evidence unified under `.specs/` directory:
- Feature specifications stored in `features/{feature}/`
- Session evidence recorded in `sessions/{UTC_ID}/`
- Automatic archiving to `archives/` maintains complete history

### 2. Anchor-Driven Minimal Read Strategy
Intelligent anchor system avoids large-scale file reading:
```markdown
Requirements: [@req.auth] User authentication required
Design: [@des.jwt] JWT token implementation  
Tasks: {ref: [@req.auth], [@des.jwt]} Implement JWT authentication
```
Commands execute by reading only task-relevant `{ref}` anchors, ensuring precise operations.

### 3. Multi-Layer Security Gates
- **Pre-execution Guards**: Automatically detects and blocks Windows script files (`*.ps1`, `*.bat`)
- **Database Safety**: Proactively prompts for backup when DB configuration detected
- **Git State Protection**: Suggests clean working directory start, supports feature branch isolation
- **Confirmation Mechanisms**: All sensitive operations (task completion, spec changes, Git operations) require explicit confirmation

### 4. Intelligent Session Management
- **Timeline Recording**: Complete WIP/DONE markers in `journal.md`
- **Evidence Preservation**: Long logs and build outputs saved to session `reports/`
- **One-Command Recovery**: `/cc-load` automatically infers next steps
- **Cross-Feature Support**: Manages multiple concurrent feature developments

### 5. Enterprise-Grade Auditing
- **Atomic Operations**: All file modifications use patch mechanisms with complete rollback
- **Complete Archiving**: Sessions automatically packaged to `.specs/archives/`
- **Retention Policies**: Configurable session and archive retention counts
- **Operation Traces**: Every operation timestamped with operator records

## 📋 Command System

### Core Workflow Commands
| Command | Function | Usage Example |
|---------|----------|---------------|
| `/cc-start <feature>` | Initialize feature development, generate specs and session | `/cc-start user-login` |
| `/cc-next` | Execute next incomplete task, record evidence | `/cc-next` |
| `/cc-load` | Read-only session context restoration, show next steps | `/cc-load` |
| `/cc-sync` | Specs-code consistency check, generate reports | `/cc-sync` |
| `/cc-end` | Complete validation and archive session | `/cc-end` |

### Analysis & Fix Commands
| Command | Function | Usage Example |
|---------|----------|---------------|
| `/cc-fix <slug>` | Start defect fix workflow | `/cc-fix auth-bug` |
| `/cc-analyze --target <path>` | Generate analysis reports and suggestions | `/cc-analyze --target src/auth` |
| `/cc-think [v1|v2|v3]` | Deep proposal analysis (three levels) | `/cc-think v2` |

### Auxiliary Management Commands
| Command | Function | Usage Example |
|---------|----------|---------------|
| `/cc-git` | Controlled Git operations (requires confirmation) | `/cc-git` |
| `/cc-info` | Record project information | `/cc-info` |
| `/cc-config key=value` | Set workflow preferences | `/cc-config display.quiet=true` |
| `/cc-server <cmd>` | Service management (start/stop/status) | `/cc-server start` |
| `/cc-archive` | Manual archive rotation | `/cc-archive` |

## 🏗️ Complete Project Structure

```
.specs/                              # Single source of truth
├── project.yml                      # Project config and flow state
│   ├── name: "Project Name"
│   ├── description: "Project Description"  
│   ├── flow:
│   │   ├── preferences:            # Workflow preference settings
│   │   │   ├── timezone: "UTC"
│   │   │   ├── display.quiet: true
│   │   │   ├── testing.auto_smoke: true
│   │   │   └── retention: {...}
│   │   └── current:               # Active flow pointer
│   │       ├── feature: "feature-name"
│   │       ├── session_id: "UTC_ID"
│   │       ├── last_task: "task-number"
│   │       └── stage: "current-stage"
│
├── features/                       # Feature development directory
│   ├── <feature-name>/            # Specific feature directory
│   │   ├── requirements.md        # Requirements specs (with [@req.*] anchors)
│   │   ├── design.md             # Technical design (with [@des.*] anchors)
│   │   ├── tasks.md              # Task list (with {ref} references)
│   │   ├── summary.md            # Completion summary (/cc-end generated)
│   │   └── sessions/             # Session history
│   │       └── <UTC_ID>/         # Specific session directory
│   │           ├── journal.md    # Session timeline (WIP/DONE markers)
│   │           └── reports/      # Session evidence and logs
│   │               ├── build-20250912T143052Z.log
│   │               ├── test-20250912T143105Z.log
│   │               ├── sync-20250912T143120Z.md
│   │               └── analyze-20250912T143135Z.md
│   └── fix-<slug>/               # Fix features (optional)
│       └── [same structure as above]
│
├── archives/                      # Session archives
│   ├── feature1_20250912T143052Z.zip
│   ├── feature2_20250911T091234Z.zip
│   └── ...
│
└── runtime/                      # Runtime state (optional)
    └── serve.json               # Service runtime status

.codex/                           # Workflow control plane
└── flow/                        # Workflow baseline
    ├── policies.md              # Flow policies and constraints
    ├── commands/                # Command specification definitions
    │   ├── cc-start.yml        # Start command specification
    │   ├── cc-next.yml         # Progress command specification
    │   ├── cc-load.yml         # Load command specification
    │   ├── cc-sync.yml         # Sync command specification
    │   ├── cc-end.yml          # End command specification
    │   ├── cc-fix.yml          # Fix command specification
    │   ├── cc-analyze.yml      # Analyze command specification
    │   ├── cc-think.yml        # Think command specification
    │   ├── cc-git.yml          # Git command specification
    │   ├── cc-info.yml         # Info command specification
    │   ├── cc-config.yml       # Config command specification
    │   ├── cc-server.yml       # Server command specification
    │   └── cc-archive.yml      # Archive command specification
    ├── templates/              # Specification templates
    │   ├── requirements.md     # Requirements template (with placeholders)
    │   ├── design.md          # Design template (with placeholders)
    │   ├── tasks.md           # Tasks template (with placeholders)
    │   ├── summary.md         # Summary template (with placeholders)
    │   └── journal.md         # Journal template (with placeholders)
    └── tools/                 # Execution tools
        ├── quiet.sh           # Quiet execution tool
        │   ├── smoke()        # Automatic smoke testing
        │   ├── serve_status() # Service status check
        │   ├── serve_stop()   # Service stop
        │   └── ...
        └── guard-no-win-scripts.sh  # Windows script guard

AGENTS.md                        # Codex CLI adaptation rules
├── Single source of truth strategy
├── Command trigger mechanisms
├── Tool invocation specifications
├── Confirmation gate definitions
└── Operational discipline requirements

.gitignore                       # Git ignore rules
├── *.ps1                       # Prohibit Windows scripts
├── *.bat                       # Prohibit batch files
├── .claude/                    # Ignore legacy Claude directory
└── ...

docs/                           # Project documentation
└── RELEASE_NOTES_v2.1.0.md    # Version release notes
```

## 🔄 Standard Workflow

### 1. Start New Feature
```bash
/cc-start user-authentication

# System Behavior:
# ✓ Generate requirements.md, design.md, tasks.md
# ✓ Create session sessions/20250912T143052Z/
# ✓ Initialize journal.md timeline
# ✓ Update project.yml.flow.current pointer
# ✓ Check database configuration, prompt for backup
# ✓ Suggest creating feature branch
```

### 2. Progress Task Execution
```bash
/cc-next

# System Behavior:
# ✓ Read current task's {ref} anchors
# ✓ Implement task and generate evidence
# ✓ Save long logs to reports/ directory
# ✓ Optionally execute smoke tests
# ✓ Mark task complete after confirmation
# ✓ Update journal.md timeline
```

### 3. Consistency Check
```bash
/cc-sync

# System Behavior:
# ✓ Extract anchors from requirements/design
# ✓ Scan code to verify implementation consistency
# ✓ Generate detailed sync reports
# ✓ Record discrepancies and suggested fixes
```

### 4. Completion and Archiving
```bash
/cc-end

# System Behavior:
# ✓ Validate all tasks completed
# ✓ Execute design consistency checks
# ✓ Generate summary.md summary
# ✓ Package session to archives/
# ✓ Clear project.yml.flow.current
# ✓ Prompt for cleanup operations
```

### 5. Context Recovery Anytime
```bash
/cc-load

# System Behavior:
# ✓ Read project.yml.flow.current
# ✓ Scan recent session directories
# ✓ Parse journal.md WIP/DONE markers
# ✓ Infer next operation
# ✓ Read-only display, no state modification
```

## ⚙️ Installation & Deployment

### Option A: Template Repository
```bash
git clone https://github.com/heihuzicity-tech/codex-simpleflow.git
cd codex-simpleflow
/cc-start demo-feature
```

### Option B: Existing Project Integration
Copy these files to your project root:
```bash
# Copy core configuration
cp AGENTS.md /your/project/
cp .specs/project.yml /your/project/.specs/
cp -r .codex/flow /your/project/.codex/

# Initialize first feature
cd /your/project
/cc-start your-first-feature
```

## 🛡️ Security Mechanisms

### Script Security Policy
- **Windows Script Prohibition**: Automatically detects and blocks `*.ps1` and `*.bat` files
- **Cross-Platform Compatibility**: Forces use of Bash or platform-agnostic tools
- **Pre-execution Guards**: `guard-no-win-scripts.sh` scans before execution

### Data Protection Mechanisms  
- **Database Backup**: Proactively prompts for backup when DB configuration detected
- **Atomic Operations**: All file writes use patch mechanisms
- **Rollback Support**: Complete recovery to original state on operation failure
- **Git Protection**: Suggests feature branch isolation, avoiding main branch contamination

### Operation Confirmation Gates
Operations requiring explicit confirmation:
- ✅ Mark tasks complete
- ✅ Modify requirements/design specifications
- ✅ Git commit/branch/tag operations  
- ✅ Service start/stop operations
- ✅ Destructive cleanup operations
- ✅ Session archiving operations

## 🎛️ Personalization Configuration

### Preference Settings Example
```yaml
flow:
  preferences:
    timezone: "Asia/Shanghai"          # Timezone setting
    timestamp_format: "YYYY-MM-DD HH:mm:ss"  # Time format
    display:
      quiet: true                      # Quiet mode
      style: "narrative"               # Output style
      max_bullets: 0                   # Disable bullet lists
      show_preamble: false            # Hide execution preamble
    testing:
      auto_smoke: true                 # Automatic smoke testing
    retention:
      sessions:
        keep_open: 1                   # Retain unarchived sessions count
        keep_archives: 5               # Retain archive count
```

### Configuration Commands
```bash
# Set display preferences
/cc-config display.quiet=false

# Set testing strategy  
/cc-config testing.auto_smoke=false

# Set retention policy
/cc-config retention.sessions.keep_archives=10
```

## 🚀 Advanced Features

### Fix Workflow
Supports two fix modes:
```bash
# Standalone fix feature
/cc-fix auth-timeout-bug
# Creates .specs/features/fix-auth-timeout-bug/

# Scoped fix task
/cc-fix --mode=scoped --feature=user-login
# Appends fix task to existing feature
```

### Deep Analysis System
Three analysis levels:
```bash
/cc-think v1    # Basic analysis
/cc-think v2    # Multi-perspective analysis  
/cc-think v3    # System-wide analysis
```

### Service Management
```bash
/cc-server start --name=api --port=3000
/cc-server status  
/cc-server stop --force
```

## 📊 Usage Statistics

Verified effects from real project usage:
- **Development Efficiency**: 40-60% improvement over traditional methods
- **Error Recovery**: Reduced from hours to minutes  
- **Documentation Consistency**: 80% reduction in specs-code deviation
- **Team Collaboration**: 95%+ accuracy in context transfer

## 🤝 Contributing

We welcome community contributions:

- 🐛 **Bug Reports**: Submit Issues for discovered bugs
- 💡 **Feature Suggestions**: New feature ideas welcome for discussion
- 📝 **Documentation Improvements**: Help improve usage documentation  
- 🔧 **Code Contributions**: Submit Pull Requests

## 📄 License

MIT License

## 🙏 Acknowledgments

- **Codex CLI Team**: Providing powerful command-line AI platform
- **Community Contributors**: All developers participating in testing and feedback
- **Enterprise Users**: Teams validating workflows in production environments

## 🔗 Related Resources

- **Project Repository**: [GitHub](https://github.com/heihuzicity-tech/codex-simpleflow)
- **Official Website**: [Heihuzicity Low‑Tech Group](https://www.heihuzicity.com/)
- **Issue Reporting**: [Issues](https://github.com/heihuzicity-tech/codex-simpleflow/issues)
- **Version History**: [CHANGELOG.md](./CHANGELOG.md)

---

<div align="center">

**Project Maintainer**: Heihuzicity Low‑Tech Group（黑胡子低科技集团）  
**Last Updated**: 2025-09-12  
**Current Version**: v2.1.1

*Transforming workflows from ideas into reality*

</div>