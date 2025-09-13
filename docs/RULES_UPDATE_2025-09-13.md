# Rules Update – 2025-09-13

This document summarizes the rule refinements. No file’s original language was changed; all updated files were originally written in English.

## Scope
1. AGENTS.md (English)
2. .codex/flow/commands/cc-start.yml (English)
3. .codex/flow/policies.md (English)

## Changes
1. Start SOP (/cc-start)
   - Added prechecks: branch guard (writes only on `feature/*`), Windows script guard, slug validity, working tree check, DB backup prompt.
   - Introduced a short Q&A phase (≤5 questions, ≤2 rounds) with no file writes.
   - Added drafts & preview step for requirements/design/tasks (no writes).
   - Enforced per-document confirmation and atomic write for each spec document.
   - Session creation and flow.current update occur only after all three docs are written; journal contains INIT only.
   - Simplification: removed optional modes (`--early-session`, `--batch`) to reduce cognitive load; /cc-start now follows a single, consistent flow.
   - Evidence (Q&A + draft summary) saved to feature reports.

2. cc-next refinements (simplified)
   - Keep minimal prechecks (unfinished task, no Windows scripts).
   - On confirmation, mark task done and update progress; optionally refresh `last_task` and `updated_at`.

3. State Machine Invariants
   - Before `/cc-next`: journal has only INIT; `flow.current.last_task=null`.
   - When in `/cc-next`: record `WIP n`/`DONE n`; set `flow.current.last_task=n`.
   - Forbid any `WIP` while `stage!=Active` or `last_task=null`.

4. cc-end refinements (simplified)
   - Keep prechecks minimal (all tasks complete; design parity; no Windows scripts).
   - Update index and clear `flow.current` pointer (details implementation-defined in tools).

3. Language rule (clarification)
   - Preserve each rules file’s original language; do not switch languages when updating rules. English files remain English; Chinese rules (if any) remain Chinese.

5. cc-sync refinements (simplified)
   - Focus on specs↔code parity using anchors/contracts; keep read-only.

6. De-duplication of invariants
   - Removed repeated invariant blocks from AGENTS.md; commands implicitly follow invariants defined once in `.codex/flow/policies.md`.

7. cc-fix (scoped) alignment
   - Do not write WIP entries in journal during scoped fixes; only append a fix task to the target feature. Progress is advanced via `/cc-next`.

8. Index file cleanup
   - Removed optional reads/writes of `.specs/index.yml` from command specs to keep the core path minimal.

9. cc-info facts policy
   - Canonical facts are stored in `.specs/project.yml` under a generic `facts` tree (no DB‑specific schema).
   - Minimal shapes: `facts.cheatsheets[]`, `facts.kv[]`, `facts.services[]`, `facts.commands[]`.
   - Cheatsheets: `{ key, scope, updated_at, lines[] (≤10) }` with core tips only (host/IP, port, a few commands).
   - KV: `{ key, value, scope, updated_at }` (no secrets). Services: `{ name, host, port, protocol?, scope, updated_at }`. Commands: `{ key, cmd, scope, updated_at }`.
   - Optional session cheatsheet is controlled by `flow.preferences.info.store_reports` and limited to 10–20 lines.

## Rationale
These refinements prevent speculative spec writes, enforce branch hygiene and confirmations, and keep state consistent between `journal.md` and `flow.current`, while keeping conversations concise and evidence auditable.
