# 更新日志

本项目遵循“尽量精简、可恢复、会话内留痕”的工作流设计。重要变更记录如下。

## [Unreleased]
- 新增：`/cc-load`（只读）用于自动读取并恢复上次会话的最新进度（优先使用 `.specs/project.yml -> flow.current`）。
- 精简结构：移除全局目录（`.specs/reports/`、`.specs/checkpoints/`、`.specs/runtime/`）、移除 `flow/schemas/*`，证据仅落在会话 `reports/`。
- 配置合并：将 `.specs/project.yml` 的重复 `flow:` 合并为单一块，新增 `flow.current.last_task/updated_at` 字段。
- 文档：新增 `USAGE.md`；更新 `AGENTS.md` 与 `policies.md` 以反映简化后的结构与 `/cc-load`。
- 模板：`journal.md` 增加 `WIP/DONE` 示例，便于 `/cc-load` 识别进度。

## [2.0.0] - 2025-09-11
- 引入 `.specs/flow` 基线（policies、commands、templates）。
- 建立最小命令集：`/cc-start`、`/cc-next`、`/cc-end`、`/cc-sync`、`/cc-git`、`/cc-info`、`/cc-server`、`/cc-archive`、`/cc-config`。
- 采用 feature‑centric 结构与会话 `journal.md` + `reports/` 的证据留存方式。

## [1.0.0] - 初始版本
- 初始化仓库与基础工作流文档。

— 完 —
