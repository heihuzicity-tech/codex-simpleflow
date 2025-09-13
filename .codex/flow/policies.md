# Flow Policies (Baseline)

This repository uses a feature‑centric specs layout under `.specs/` and places the workflow baseline under `.codex/flow/`.

## Directories
- `.specs/features/<slug>/` holds all specs for a feature (requirements, design, tasks, summary).
- `.specs/features/<slug>/sessions/<UTC_ID>/` contains per‑session timeline `journal.md` and session reports/artifacts.
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
- `/cc-analyze`: Read‑only analysis. Generates session reports; does not modify specs.
- `/cc-think`: Proposal‑first. Writes a proposal report; any specs edits require explicit confirmation (or produce a patch for later application).

## Reports
- Use a single per‑session `journal.md` to record the timeline.
- Put all evidence and logs under the session `reports/`; archive at `/cc-end`.
- No global `.specs/reports/` directory; cross‑feature notes belong to regular docs (e.g., `AGENTS.md`/policies) or the active session.

## Info Facts Policy
- Canonical facts live in `.specs/project.yml` under a generic `facts` tree, so multiple features/sessions can share them.
- Prefer a minimal `facts.cheatsheets[]` structure: `{ key, scope: global|feature/<slug>, updated_at, lines[] (≤10) }`.
- `lines[]` should capture core tips only (e.g., host/IP, port, 3–6 commands). Avoid long narrative notes.
- Session reports may include an optional minimal cheatsheet (10–20 lines) only when `flow.preferences.info.store_reports=true`.

### Fix feature location
- Bug‑fix features use `.specs/features/fix-<slug>/` (lowercase, `[a-z0-9-]`).
- When a fix is tightly coupled with an existing feature, prefer adding a scoped fix task to that feature’s `tasks.md` instead of creating a new fix feature.

## Output Style (Quiet by Default)
- Conversation output is concise: conclusion → evidence path → next step.
- Long stdout/stderr is captured to the current session `reports/` and not printed inline.
- On failure, show the last ~50 lines and the full report path.
- Controlled by preferences:
  - `display.quiet: true`
  - `display.style: concise|narrative` (default: concise)
  - `display.max_bullets: 4` (limit bullets per section)
  - `display.headers: minimal|none` (default: minimal)
  - `display.show_preamble: false`
  - `display.icons: false`
  - `execution.show_stdout: on-failure`
  - `execution.capture_logs: to-session-reports`

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

## Start Command (SOP)
- Prechecks: enforce branch guard (writes allowed only on `feature/*`), run Windows script guard, validate slug (lowercase, unique), check working tree, and prompt DB backup if applicable.
- Short Q&A: collect scope, success criteria, constraints, and non‑goals in ≤5 questions and ≤2 rounds. No writes in this phase.
- Drafts & preview: produce drafts for `requirements.md`, `design.md`, and `tasks.md`; present preview without writing.
- Per‑document confirmations: write each document only after explicit confirmation (atomic write per document).
- Session & pointer: only after all three docs are written, create `sessions/<UTC_ID>/journal.md` (INIT only) and set `.specs/project.yml.flow.current` with `stage=Active`, `feature`, `session_id`, and `updated_at`.
- Evidence: store Q&A and draft summary under `.specs/features/<slug>/reports/cc-start-qa-<ts>.md`.

## State Machine Invariants
- Before `/cc-next`: journal contains only `INIT`; `flow.current.last_task=null`.
- Entering `/cc-next`: journal may append `WIP n` and `DONE n`; `flow.current.last_task` must be set to `n`.
- Forbidden: any `WIP` while `stage!=Active` or `last_task=null`.
