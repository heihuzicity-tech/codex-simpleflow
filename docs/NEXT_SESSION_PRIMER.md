# 新会话提示词（Session Primer）

项目：codex-simpleflow（Codex CLI 轻量可追溯工作流）

## 当前目标
完成 flow 基线迁移后的“文档与发布闭环”，确保“规格—过程—证据”路径与安全闸门在示例与说明中清晰可用。

## 已完成（上次会话）
- 目录迁移：将 flow 从 `.specs/flow/` 彻底迁至 `.codex/flow/`（policies、commands、templates、tools）。
- 命令地位：`/cc-fix`、`/cc-analyze`、`/cc-think` 升级为正式命令。
- 文档更新：
  - `README.md`（中文）：简介/闭环/Quick Start/安全与验证/最新结构/命令表/偏好/恢复/安装/FAQ/作者。
  - `README_EN.md`（英文）：与中文同步的结构与内容。
  - `AGENTS.md`（英文规则）：引用 `.codex/flow`；英文化原有适配内容；补充脚本与环境纪律。
  - `CHANGELOG.md`：新增 v2.1.0 记录；Unreleased 置为待定。
  - `docs/RELEASE_NOTES_v2.1.0.md`：发布说明。
- 版本与推送：已提交并推送 main；创建并推送 tag `v2.1.0`。
- 忽略项：`.gitignore` 已忽略 `.claude/`。
- 安全闸门：文档明确禁用 `*.ps1/*.bat`、开始前 DB 备份提示、受控 Git、结束一致性校验与归档、可选自动 smoke。

## 重点位置
- 事实库：`.specs/`（`project.yml`、`features/*`、`sessions/*`、`archives/`）。
- 基线控制面：`.codex/flow/`（`policies.md`、`commands/*.yml`、`templates/*`、`tools/*`）。
- 规则：`AGENTS.md`（英文，含命令触发/最小读取/确认闸门/脚本与环境纪律）。
- 说明：`README.md`（中文）与 `README_EN.md`（英文）。
- 版本记录：`CHANGELOG.md`（已含 v2.1.0）。
- 发布说明：`docs/RELEASE_NOTES_v2.1.0.md`。

## 下一步建议（按优先级）
1) 创建 GitHub Release（基于 tag `v2.1.0`）。
   - 标题：`codex-simpleflow v2.1.0`。
   - 正文：复制 `docs/RELEASE_NOTES_v2.1.0.md` 内容。
2) 文档细化（可选）。
   - 在 README 增加“示例特性 quick demo”（`/cc-start demo → /cc-next → /cc-sync → /cc-end`）截图/动图，提高可读性。
   - 在 `policies.md` 再补一张目录示意图（`.specs` 仅存事实与证据、`.codex/flow` 为控制面）。
3) 生态细节（可选）。
   - 在 GitHub 设置 topics：`codex-cli`, `workflow`, `traceability`, `specs`, `evidence`, `safety-gates`。
   - 在仓库首页 Description 填写：Codex CLI 轻量可追溯工作流：规格—过程—证据统一于 `.specs`，会话留痕；`/cc-*` 驱动开始→推进→校验/修复→收尾；flow 基线在 `.codex/flow`，内置安全闸门与可审计证据。

## 校验清单（建议）
- 在 GitHub 渲染检查 README（中/英）是否正常（中文编码、表格、目录树）。
- 全仓搜索确认不再残留 `".specs/flow/"` 文案（当前已替换；再次检查以防遗漏）。

## 快速命令备忘
- 恢复上下文：`/cc-load`
- 推进任务：`/cc-next <feature> [--sid <UTC_ID>]`
- 一致性检查：`/cc-sync <feature> [--sid <UTC_ID>]`
- 收尾归档：`/cc-end <feature> [--sid <UTC_ID>]`
- Git（受控）：`/cc-git`

## 完成标准（本阶段）
- GitHub Releases 中已创建 `v2.1.0`，说明与 README/CHANGELOG 一致。
- README（CN/EN）首屏即可理解“为何/如何/安全门/目录结构/命令表”。
- 新用户可按 README Quick Start 成功执行 `/cc-start` 与 `/cc-next`（不需额外上下文）。

