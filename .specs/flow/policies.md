# Flow Policies (Baseline)

This repository uses a feature‑centric specs layout under `.specs/`.

## Directories
- `.specs/features/<slug>/` holds all specs for a feature (requirements, design, tasks, summary).
- `.specs/features/<slug>/sessions/<UTC_ID>/` contains per‑session timeline `journal.md` and session reports/artifacts.
- `.specs/runtime/` stores runtime state (e.g., `serve.json`).
- `.specs/archives/` stores zipped session archives `<slug>_<UTC_ID>.zip`.
- Active pointer lives in `.specs/project.yml` under `flow.current` (feature + session id).
- `.specs/index.yml` is an optional global index.

## Naming & Encoding
- Feature directory names are English slugs: lowercase, `[a-z0-9-]`, length ≤ 40, globally unique.
- Timestamps are UTC in `YYYY-MM-DDThhmmssZ`.
- All files use UTF‑8 without BOM.

## Commands (overview)
- Keep minimal user commands: `/cc-start`, `/cc-next`, `/cc-end`, `/cc-sync`, `/cc-git`, `/cc-info`.
- Keep `/cc-server` (aka `/cc-serve`) and `/cc-archive` for service control and manual archiving.
- Provide `/cc-load` to resume the latest session context: read `project.yml.flow.current` or fallback to the most recent session across features (read-only).
- `/cc-config` is a thin preferences writer (writes `.specs/project.yml` → `flow.preferences`).
- `/cc-next` also accepts natural language equivalents (e.g., 继续/确认/下一个) with the same flow.

## Reports
- Use a single per‑session `journal.md` to record the timeline.
- Put all evidence and logs under the session `reports/`; archive at `/cc-end`.
- No global `.specs/reports/` directory; cross‑feature notes belong to regular docs (e.g., `AGENTS.md`/policies) or the active session.

## Output Style (Quiet by Default)
- Conversation output is concise: conclusion → evidence path → next step.
- Long stdout/stderr is captured to the current session `reports/` and not printed inline.
- On failure, show the last ~50 lines and the full report path.
- Controlled by preferences:
  - `display.quiet: true`
  - `display.style: concise|narrative` (default: concise)
  - `display.max_bullets: 4` (limit bullets per section)
  - `display.headers: minimal|none` (default: minimal)
  - `display.show_preamble: false` (suppress verbose run-up)
  - `display.icons: false` (no emoji/icons)
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
