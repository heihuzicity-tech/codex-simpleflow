# Flow Policies (Baseline)

This repository uses a feature‑centric specs layout under `.specs/`.

## Directories
- `.specs/features/<slug>/` holds all specs for a feature (requirements, design, tasks, summary).
- `.specs/features/<slug>/sessions/<UTC_ID>/` contains per‑session timeline `journal.md` and session reports/artifacts.
- `.specs/runtime/` stores runtime state (e.g., `serve.json`).
- `.specs/archives/` stores zipped session archives `<slug>_<UTC_ID>.zip`.
- `.specs/current.yml` is the active pointer (feature + session id).
- `.specs/index.yml` is an optional global index.

## Naming & Encoding
- Feature directory names are English slugs: lowercase, `[a-z0-9-]`, length ≤ 40, globally unique.
- Timestamps are UTC in `YYYY-MM-DDThhmmssZ`.
- All files use UTF‑8 without BOM.

## Commands (overview)
- Keep minimal user commands: `/cc-start`, `/cc-next`, `/cc-end`, `/cc-sync`, `/cc-git`, `/cc-info`.
- Keep `/cc-server` (aka `/cc-serve`) and `/cc-archive` for service control and manual archiving.
- `/cc-config` is a thin preferences writer (writes `.specs/project.yml` → `flow.preferences`).
- `/cc-next` also accepts natural language equivalents (e.g., 继续/确认/下一个) with the same flow.

## Checkpoints & Reports
- Replace many scattered checkpoints with a single per‑session `journal.md`.
- Put all session reports under the session folder; archive at `/cc-end`.

## Write Discipline
- All file writes go through atomic patches (apply_patch).
- Validate YAML before writing; on failure, abort without partial state.

## Confirmations
- Always confirm: marking tasks done, changing requirements/design, service operations, destructive cleanups, and Git actions.

