# 更新日志

本项目遵循“精简、可恢复、会话留痕”的工作流设计。重要变更记录如下。

## [Unreleased]
- 目录迁移：将 flow 从 `.specs/flow/` 彻底迁移至 `.codex/flow/`；删除旧目录；README 与 AGENTS 全量更新至新路径。
- 命令集：`/cc-fix`、`/cc-analyze`、`/cc-think` 升级为“正式命令”，与 `/cc-start`、`/cc-next`、`/cc-load`、`/cc-sync`、`/cc-end` 并列。
- 安全与验证：README 新增“Safety Gates”说明；执行前守卫（禁用 `*.ps1/*.bat`）、开始前 DB 备份提示、受控 Git、结束一致性校验与归档清理、可选自动 smoke。
- 环境策略：移除对 `.env.local` 的绑定；统一为“尊重项目现有环境配置（.env/.env.*/CI/脚本环境），变更需确认”；日志/PID 路径为默认值（`logs/service.log`/`logs/service.pid`），若项目策略另有规定，以项目为准。
- 忽略项：将 `.claude/` 加入 `.gitignore`，旧 Claude 文档仅作迁移参考。
- 作者信息：README 添加“黑胡子低科技集团（Heihuzicity Low‑Tech Group）”与网站 `https://www.heihuzicity.com/`。

## [2.0.0] - 2025-09-11
- 引入 `.specs/flow` 基线（policies、commands、templates）。
- 建立最小命令集：`/cc-start`、`/cc-next`、`/cc-end`、`/cc-sync`、`/cc-git`、`/cc-info`、`/cc-server`、`/cc-archive`、`/cc-config`。
- 采用 feature‑centric 结构与会话 `journal.md` + `reports/` 的证据留存方式。

## [1.0.0] - 初始版本
- 初始化仓库与基础工作流文档。

