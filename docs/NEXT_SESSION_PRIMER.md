# 新会话提示词（Session Primer，聚焦工作流细节）

用于下次唤起会话时，快速加载项目约束、目录语义与命令行为，避免跑偏。

## 角色与边界
1) 作为 Codex CLI 工作流执行者，严格遵循仓内规则与策略，所有“事实/会话/证据”以 `.specs/` 为准，所有“执行基线/控制面”在 `.codex/flow/`。
2) 只能通过 `/cc-*` 命令推进；除非获得确认，不得越权（写入、脚本、环境）。

## 目录语义
1) `.specs/`（事实库）
   - `project.yml`：`flow.preferences` + `flow.current` 指针。
   - `features/<feature>/`：`requirements.md / design.md / tasks.md / summary.md / sessions/<UTC_ID>/{journal.md,reports/}`。
   - `archives/`：`/cc-end` 打包的会话归档 zip。
2) `.codex/flow/`（控制面）
   - `policies.md`：工作流策略与约束。
   - `commands/*.yml`：正式命令规范（start/next/load/sync/end/git/info/config/archive/server/fix/analyze/think）。
   - `templates/*`：三文档与 journal 模板；`/cc-start` 来源。
   - `tools/*`：守卫与安静执行脚本。

## 安全闸门（必须执行/确认）
1) 脚本守卫：执行前调用 `guard-no-win-scripts.sh`，发现 `*.ps1/*.bat` 立即失败。
2) 最小读取：`/cc-next` 仅按任务 `{ref}` 读取相关片段；`/cc-sync` 才可全量扫描。
3) 写入纪律：一律 `apply_patch` 原子落盘；YAML/Markdown 需校验通过。
4) 确认闸门：勾任务、改动 requirements/design、Git 操作、破坏性清理、跳过 DB 备份等，均需显式确认。
5) 环境约束：尊重项目既有 env（.env/.env.* 或脚本管理）；不得擅自修改 PORT/工作目录/日志路径。

## 命令行为要点
1) `/cc-start <feature>`：
   - 生成三文档 + `sessions/<UTC_ID>/journal.md`；更新 `flow.current`。
   - 若检测到 DB 迹象，先提示备份；建议在干净工作区并通过 `/cc-git` 建立 `feature/<slug>` 分支（需确认）。
2) `/cc-next <feature> [--sid]`：
   - 读取 `tasks.md` 的下一条未完成任务；按 `{ref}` 抽取上下文；实施并把长日志/构建输出写入会话 `reports/`。
   - `testing.auto_smoke=true` 时尝试 smoke（构建/探测）。
   - 仅在确认后勾选任务并更新进度。
3) `/cc-sync <feature> [--sid]`：
   - 只读一致性检查（requirements/design/tasks ↔ 代码证据），输出 `reports/sync-*.md`；不自动改文档。
4) `/cc-end <feature> [--sid]`：
   - 校验任务完成 + 设计一致性通过 → 打包会话到 `.specs/archives/`；可提示清理（需确认）。
5) `/cc-fix <slug>`：
   - standalone：创建 `features/fix-<slug>/` 与会话并更新指针；
   - scoped：向目标特性追加“修复任务”（需确认）。
6) `/cc-analyze`：
   - 只读分析目标路径/特性，写入会话报告；不改 specs。
7) `/cc-think`：
   - 产出实施前提案；在确认下写入 specs 或导出补丁，否则仅保留报告。

## 会话与证据
1) 时间线：`journal.md` 记录 WIP/DONE；`/cc-load` 通过尾部标记或 `tasks.md` 首条“未勾选”推断下一步。
2) 证据：所有构建日志、比对报告、修复说明等落在 `sessions/<UTC_ID>/reports/`，对话仅给结论与路径。

## 执行顺序（建议）
1) `/cc-start <feature>` → `/cc-next <feature>`（可多次）→ `/cc-sync <feature>`（必要时循环修复）→ `/cc-end <feature>`。
2) 任意时刻可用 `/cc-load` 只读恢复上下文，不写文件。
3) Git 操作统一通过 `/cc-git` 并需确认。

## 快速校验清单
1) `.specs/` 与 `.codex/flow/` 目录语义一致；无残留 `.specs/flow/` 引用。
2) `journal.md` 与 `reports/` 正在被使用（推进后有新增证据）。
3) README（中文）能让新用户 1 分钟跑通 Quick Start。

