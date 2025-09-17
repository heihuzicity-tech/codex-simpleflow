# CodexFlow Agent Rules (AGENTS.md)

Scope: These rules apply to the entire repository for all agent work in Codex CLI.

## CodexFlow Adapter
- Single source of truth: treat `.specs/` as the only runtime/state source.
- Commands trigger: a `/cc-*` message means "run that command" (see `.codex/flow/commands/*.yml`).
- Tools
  - Read/detect: `shell` (read-only checks such as git status, env, logs).
  - Write/change: `apply_patch` (atomic patches; prefer one shot, minimal diffs).
  - Process rendering: `update_plan` (exactly one `in_progress` at a time).
- Quick restore: `/cc-load` restores the last session context read-only (reads `.specs/project.yml -> flow.current`; if invalid, fall back to the latest session). No files are written.
- Confirmation gates (ask before acting)
  - Marking tasks done; changing requirements/design; skipping database backup.
  - Applying changes suggested by `cc-sync`.
  - Git commit/branch/tag/merge; publishing/tagging; destructive cleanups.
- Minimal read strategy
  - `cc-task` (if used) reads only the Progress section in `tasks.md`.
  - `cc-next` reads only the `{ref: ...}` anchors from requirements/design relevant to the active task.
  - `cc-sync` may read all three docs and compare with code evidence.
- Checkpointing: record progress only in `.specs/features/<feature>/sessions/<UTC_ID>/session.md`; do not use a global `checkpoints/`.
- Task lifecycle is automated: `/cc-next` writes `状态: 开始新任务 → 进行中 → 等待测试 → 完成` into tasks.md & session.md; do not hand-edit states or checkboxes.

## Single Source of Truth
- `.specs/project.yml` (includes `flow.preferences` and `flow.current`).
- `.specs/features/{feature}/` (requirements/design/tasks/summary).
- `.specs/features/{feature}/sessions/{UTC_ID}/` (combined `session.md` timeline and evidence pointers).

## References
- Policies and constraints: `.codex/flow/policies.md`.
- Command specs: `.codex/flow/commands/*.yml`.

## Language
- Preserve each rules file’s original language. English files remain English (e.g., `AGENTS.md`, `.codex/flow/policies.md`, `.codex/flow/commands/*.yml`). Any rules file originally written in Chinese should remain Chinese. Do not change a file’s language when supplementing or refining rules.

## Start SOP (/cc-start)
- Prechecks: branch guard (allow writes only on `feature/*`), Windows script guard, slug validity/uniqueness, working tree check, and DB backup prompt if applicable.
- Short Q&A: ask up to 5 targeted questions within 1–2 rounds to clarify scope, success criteria, constraints, and non‑goals. No file writes yet.
- Drafts & preview: produce drafts for `requirements.md`, `design.md`, and `tasks.md`; present a concise preview; do not write files in this step.
- Single confirmation & write: after preview, obtain one confirmation to atomically write all three documents. Unconfirmed drafts stay pending.
- Session & pointer: immediately create `sessions/<UTC_ID>/session.md` (INIT + kickoff summary) and update `.specs/project.yml.flow.current` with `{ feature, session_id, last_task: null, stage: Active, updated_at: now }`.
- Evidence: capture the Q&A and supporting notes inside `session.md`; reference any large artifacts from the same session directory.

### State Machine
See `.codex/flow/policies.md` for the authoritative State Machine Invariants and session/pointer rules. Commands must honor the 状态: 开始新任务 → 进行中 → 等待测试 → 完成 lifecycle enforced by those invariants; do not restate or bypass them.

## Commands (formal)
- `/cc-start`, `/cc-next`, `/cc-load`, `/cc-sync`, `/cc-end`.
- `/cc-git`, `/cc-info`, `/cc-config`, `/cc-archive`, `/cc-server`.
- `/cc-fix`: Fix workflow (default creates `.specs/features/fix-<slug>/` and a session; or append a fix task to a target feature on confirmation).
- `/cc-analyze`: Read-only analysis (does not modify specs); summary appends to the active session `session.md`.
- `/cc-think`: Proposal before implementation (spec edits require confirmation; may output a patch instead).

---

## Operational Discipline (Shell & Scripts)
- Single command per step: run exactly one command at a time. Do not chain with `;`, `&&`, or `||`.
- Use project scripts only: when `./server.sh` exists and exposes `start|stop|status|restart|build|clean`, use it exclusively for service operations. Do not bypass with `nohup`, framework dev servers, or background `&`.
- No external backgrounding: never start background processes outside provided scripts.
- Process control via script: do not manually kill PIDs or free ports; use `./server.sh`.
- Logs/PID location (default): write logs to `logs/service.log` and PID to `logs/service.pid` (paths relative to the repository root). If the project's scripts or policies specify different paths, follow those. Do not relocate arbitrarily without explicit approval.
- Sequential flow: wait for each command to complete and report before running the next.
- Script edits need approval: propose changes via patch and obtain user confirmation before modifying `./server.sh` or related scripts.
- Environment invariants: do not implicitly change `PORT`, working directory, or log paths; configure only via approved scripts or with explicit approval.

## Service Management (if `./server.sh` is present)
- Start: `./server.sh start`
- Stop: `./server.sh stop`
- Status: `./server.sh status`
- Restart: `./server.sh restart`
- Build: `./server.sh build`
- Clean: `./server.sh clean`

After `start`/`restart`, always run `./server.sh status` to verify health before further steps.

## Network and Environment
- Respect the project's existing environment configuration (e.g., `.env`, `.env.*`, CI env, or script-managed env). Do not add/modify env vars without approval.
- Avoid installing packages unless explicitly required to fix a concrete error and approved by the user.

## Editing and Commits
- Use focused patches; do not change unrelated files.
- Follow existing code style and structure; prefer minimal diffs.
- Document behavior-affecting changes in the PR/summary to the user.

## Approval and Change Control
1) Analyze first: before modifying code/scripts, identify root cause, scope, risks; propose concrete changes and a test plan.
2) Explicit approval required: do not apply patches or run fix commands until the user approves.
3) Scoped execution: once approved, implement only the approved scope; if new findings arise, pause and request updated approval.
4) Verification: after implementation, validate with the agreed test plan and report results succinctly.

## Output Formatting Rules
1) Do not use hyphen-style bullet lists in replies.
2) Prefer numbered lists or short paragraphs; use section titles only when they help clarity.
3) Keep responses concise and task-focused; include commands and paths in backticks when needed.
4) Avoid heavy formatting; no nested lists; keep structure simple and readable.

