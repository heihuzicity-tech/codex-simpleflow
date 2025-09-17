# Flow Policies (Baseline)

This repository uses a feature‑centric specs layout under `.specs/` and places the workflow baseline under `.codex/flow/`.

## Directories
- `.specs/features/<slug>/` holds all specs for a feature (requirements, design, tasks, summary).
- `.specs/features/<slug>/sessions/<UTC_ID>/` contains the combined session log `session.md` (timeline + evidence pointers).
- `.specs/archives/` stores zipped session archives `<slug>_<UTC_ID>.zip`.
- Active pointer lives in `.specs/project.yml` under `flow.current` (feature + session id).
- Workflow baseline lives in `.codex/flow/` (policies, commands, templates, tools).

## Naming & Encoding
- Feature directory names are English slugs: lowercase, `[a-z0-9-]`, length ≤ 40, globally unique.
- Timestamps are UTC in `YYYY-MM-DDThhmmssZ`.
- All files use UTF‑8 without BOM.

## Commands (overview)
- Formal commands: `/cc-start`, `/cc-next`, `/cc-load`, `/cc-sync`, `/cc-end`, `/cc-git`, `/cc-info`, `/cc-config`, `/cc-archive`, `/cc-server`, `/cc-fix`, `/cc-analyze`, `/cc-think`.

### Command policies
- `/cc-fix`: Fix workflow. Default to standalone fix features under `.specs/features/fix-<slug>/`. Scoped mode may append a fix task to an existing feature `tasks.md` on confirmation.
- `/cc-analyze`: Read-only analysis. Summaries append to session.md; does not modify specs.
- `/cc-think`: Proposal-first. Summaries append to session.md; any specs edits require explicit confirmation (optional patch files may be emitted).

## Session Records
- Use a single per-session `session.md` to capture INIT plus per-task lifecycle entries (`状态: 开始新任务 → 进行中 → 等待测试 → 完成`), decisions, and pointers to supporting artifacts.
- Large logs or attachments may be referenced from `session.md` (e.g., archived under the same session directory) without maintaining parallel `reports/` trees.
- No global `.specs/reports/` directory; cross-feature notes belong to regular docs (e.g., `AGENTS.md`/policies) or the active session.

## Info Facts Policy
- Canonical facts live in `.specs/project.yml` under a generic `facts` tree, so multiple features/sessions can share them.
- Minimal shapes (pick what fits):
  - `facts.cheatsheets[]`: `{ key, scope: global|feature/<slug>, updated_at, lines[] (≤10) }`
  - `facts.kv[]`: `{ key, value, scope, updated_at }` (string values only; do not store secrets)
  - `facts.services[]`: `{ name, host, port, protocol?, scope, updated_at }`
  - `facts.commands[]`: `{ key, cmd, scope, updated_at }`
- Keep entries short and generic (IP/port, names, 3–6 commands). Avoid long narrative notes and never store credentials/tokens.
- Session files may include an optional minimal cheatsheet (10–20 lines) only when `flow.preferences.info.store_reports=true`.

### Fix feature location
- Bug‑fix features use `.specs/features/fix-<slug>/` (lowercase, `[a-z0-9-]`).
- When a fix is tightly coupled with an existing feature, prefer adding a scoped fix task to that feature’s `tasks.md` instead of creating a new fix feature.

## Output Style (Quiet by Default)
- Conversation output is concise: conclusion → evidence path → next step.
- Long stdout/stderr is captured to the current session directory (referenced from `session.md`) and not printed inline.
- On failure, show the last ~50 lines and the full report path.
- Controlled by preferences:
  - `display.quiet: true`
  - `display.style: concise|narrative` (default: concise)
  - `display.max_bullets: 4` (limit bullets per section)
  - `display.headers: minimal|none` (default: minimal)
  - `display.show_preamble: false`
  - `display.icons: false`
  - `execution.show_stdout: on-failure`
  - `execution.capture_logs: to-session`

## Auto Testing
- `/cc-next` runs smoke checks after implementation when applicable (e.g., build + preview ping for front‑end).
- `/cc-end` aggregates a final verification and writes an end report.
- Controlled by preferences: `testing.auto_smoke: true`.

## Write Discipline
- All file writes go through atomic patches (apply_patch).
- Validate YAML before writing; on failure, abort without partial state.

## Confirmations
- Always confirm: marking tasks done, changing requirements/design, service operations, destructive cleanups, and Git actions.

## Script Types Policy
- Prohibited: generating or committing Windows shell scripts (`*.ps1`, `*.bat`). Cross‑platform tools must use Bash (`*.sh`) or platform‑neutral languages.
- Guards: commands should run the `guard-no-win-scripts.sh` check during prechecks and fail fast when such files appear.

- Prechecks: enforce branch guard (writes allowed only on `feature/*`), run Windows script guard, validate slug (lowercase, unique), check working tree, and prompt DB backup if applicable.
- Short Q&A: collect scope, success criteria, constraints, and non-goals in ≤5 questions and ≤2 rounds. No writes in this phase.
- Drafts & preview: produce drafts for `requirements.md`, `design.md`, and `tasks.md`; present preview without writing.
- Single confirmation: after preview, confirm once to atomically write all three spec documents.
- Session & pointer: immediately create `sessions/<UTC_ID>/session.md` (INIT only) and set `.specs/project.yml.flow.current` with `stage=Active`, `feature`, `session_id`, and `updated_at`.
- Evidence: capture the Q&A and draft summary inside `session.md` (or reference stored artifacts) to keep the session self-contained.

## State Machine Invariants
- Before `/cc-next`: timeline holds `INIT` plus any 已完成任务 entries, and the next task in tasks.md must still read `状态: 开始新任务`; `flow.current.last_task=null`.
- Entering `/cc-next`: the command must immediately write `状态: 进行中` (session.md + tasks.md) and update `flow.current.last_task` to the active task number.
- Prior to confirmation: a `状态: 等待测试` entry (session.md + tasks.md) is required; absence of this state blocks completion.
- Marking completion: only after acceptance may the command write `状态: 完成`, tick the checkbox, and reference completion evidence; no `状态: 进行中 / 等待测试 / 完成` entries are allowed while `stage!=Active` or `last_task=null`.
