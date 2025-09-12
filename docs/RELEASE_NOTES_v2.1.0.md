# codex-simpleflow v2.1.0

Release date: 2025-09-13

## Highlights
- Move flow baseline to `.codex/flow/` (policies, commands, templates, tools)
- Promote `/cc-fix`, `/cc-analyze`, `/cc-think` to formal commands
- Add Safety Gates (guard, DB backup prompt, controlled Git, parity check + archive, optional smoke)
- Update docs (Chinese + English); add author & site

## Details
- Docs: README (CN/EN) refreshed; structure fully Chinese in CN, EN mirrored
- AGENTS: now references `.codex/flow/*`; environment policy generalized (no `.env.local` bind); log/PID paths are defaults
- .gitignore: ignore `.claude/`
- CHANGELOG: recorded migration and features

## Upgrade Notes
- If your tooling referenced `.specs/flow/…`, switch to `.codex/flow/…`
- Evidence and sessions remain under `.specs/` — single source of truth unchanged

## Links
- Repo: https://github.com/heihuzicity-tech/codex-simpleflow
- Tag: v2.1.0

