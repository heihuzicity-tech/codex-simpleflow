# codex-simpleflow

A lightweight, traceable workflow for Codex CLI. Specs, sessions and evidence live under `.specs/`. The `/cc-*` commands form a simple loop: start → next → sync/fix → end; `/cc-load` resumes progress anytime.

Chinese version: [README.md](README.md)

## Why codex-simpleflow
- Single source of truth: everything under `.specs/`.
- Session as evidence: `sessions/<UTC_ID>/{journal.md,reports/}`; `/cc-end` archives it.
- One‑command resume: `/cc-load` reads `project.yml.flow.current`, falls back to latest session (read‑only).
- Anchor‑driven tasks: `{ref}` → `[@req.*]` / `[@des.*]` keeps context clear.
- Quiet output: long logs go to session `reports/`; conversation shows conclusions.
- Atomic + confirmations: all writes via patches; important actions require confirmation.

## Workflow loop
```
cc-start → cc-next ↔ (cc-sync / cc-fix) → cc-end
            ↑
          cc-load (resume anytime)
```

## Directory (on demand)
```
codex-simpleflow/
├─ AGENTS.md                      # Conversation rules & how to run commands
├─ README.md                      # Chinese docs
├─ README_EN.md                   # English docs
├─ CHANGELOG.md                   # Changes
└─ .specs/                        # Workflow data
   ├─ project.yml                 # Global prefs; flow.current = last session pointer
   ├─ archives/                   # Session archives
   ├─ features/
   │  └─ <feature>/
   │     ├─ requirements.md       # Requirements
   │     ├─ design.md             # Design
   │     ├─ tasks.md              # Tasks (with {ref})
   │     ├─ summary.md            # Summary
   │     └─ sessions/
   │        └─ <UTC_ID>/
   │           ├─ journal.md      # Timeline (WIP/DONE marks)
   │           └─ reports/        # Evidence & logs
   └─ flow/
      ├─ policies.md              # Policies
      ├─ commands/                # /cc-* command specs
      ├─ templates/               # Spec templates
      └─ tools/quiet.sh           # Optional quiet helper
```

## Quick start
```
/cc-start <feature>
/cc-next <feature> [--sid <UTC_ID>]
/cc-load
/cc-end  <feature> [--sid <UTC_ID>]
```

## Install
Use this repository as a starting point, or copy a minimal set into an existing project.

Option A (template repo)
```
git clone https://github.com/heihuzicity-tech/codex-simpleflow.git
cd codex-simpleflow
/cc-start demo
```

Option B (drop‑in to an existing project)
Copy the following into your project root:
```
AGENTS.md
.specs/project.yml
.specs/flow/   (entire directory)
```
Then initialize the first session/specs:
```
/cc-start <feature-name>
```
Prereqs: Git and Codex CLI. For quiet.sh, Bash and curl are recommended (optional).

## Recovery (/cc-load)
- Reads `.specs/project.yml -> flow.current` if present; otherwise picks the latest session.
- Suggests the next task by reading `journal.md` tail or the first unchecked item in `tasks.md`.
- Read‑only: no files are written.

## Sync & fix
1) Find differences: `/cc-sync <feature> [--sid]` → `reports/sync-<ts>.md`
2) Fix during next: `/cc-next <feature> [--sid]` → drop `reports/fix-<ts>.(md|patch|log)`
3) Re‑sync to confirm; end when ready: `/cc-end <feature> [--sid]`

## Cheatsheet
```
/cc-start, /cc-next, /cc-load, /cc-end, /cc-sync,
/cc-git, /cc-info, /cc-config, /cc-archive, /cc-server
```

## Author & site
- Author: Heihuzi (黑胡子)
- Site: https://www.heihuzicity.com
