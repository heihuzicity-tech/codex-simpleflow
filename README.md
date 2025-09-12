# codex-simpleflow

[English Version](README_EN.md)

codex-simpleflow 一个用于验证与演示“轻量可追溯工作流”的仓库。规格、会话与证据集中在 `.specs/`，通过一组 `/cc-*` 命令完成“开始 → 推进 → 验证/修复 → 收尾/归档”的闭环。

本项目主要在 Codex CLI 环境中使用；如何在对话中触发命令与落盘，请参见 `AGENTS.md`。

## 目标
简洁：最少的全局状态与目录，证据集中在会话下。

可恢复：通过 `/cc-load` 只读恢复上次进度。

可追溯：`journal.md` + `reports/` 形成完整时间线与证据链。

## 特色功能
单一事实来源：一切以 `.specs/` 为准；没有分散的状态文件。

会话即证据：每次 `/cc-start` 生成 `sessions/<UTC_ID>`，所有构建/验证/修复日志只放这里，`/cc-end` 一键归档。

一键恢复：`/cc-load` 无参即可恢复（优先读 `flow.current`，失效则回退到最近会话），只读更安全。

锚点驱动：`tasks.md` 用 `{ref}` 指向 `[@req.*]`/`[@des.*]`，上下文清晰、可核对。

安静模式：长日志不刷屏，全部落在会话 `reports/`，对话只给结论与路径。

原子与确认：统一 `apply_patch` 落盘，重要动作（如勾选任务、配置写入、归档、Git）都需确认。

## 为什么选择 codex-simpleflow？
更专注：不追求“大而全”，只围绕“开始—推进—验证—收尾”的闭环把事做成。

更可控：每一步都有证据，出了问题回到会话 `reports/` 即可定位。

更友好：命令少、语义直白；读文档像读笔记，而不是在背 API。

更干净：不引入全局临时目录和冗余文件，仓库长期保持清爽。

## 设计哲学（借鉴不盲从）
保持单一来源（`.specs/`），避免多地写状态。

优先只读降级：找不到指针就扫描最近会话，不让流程卡死。

证据比口号重要：所有“说过的话”都要能在 `journal.md`/`reports/` 找到影子。

约束够用即可：政策写在 `policies.md`，实现用最少工具站得住脚。

## 工作流闭环（示意）
```
cc-start → cc-next ↔ (cc-sync / cc-fix) → cc-end
            ↑
          cc-load（随时恢复）
```
一句话版：start 初始化规格与会话；next 推进并产出证据；sync/fix 校验与修复；end 生成总结并归档；load 随时恢复。

## 目录结构（按需创建）
```
simpleflow/
├─ AGENTS.md                      # 使用约定与命令入口
├─ README.md                      # 使用说明与速查
├─ CHANGELOG.md                   # 变更记录
└─ .specs/                        # 工作流数据
   ├─ project.yml                   # 全局配置（含上次会话指针）
   ├─ archives/                     # 会话归档
   ├─ features/                     # 功能区
   │  └─ <feature>/
   │     ├─ requirements.md           # 需求文档
   │     ├─ design.md                 # 设计文档
   │     ├─ tasks.md                  # 任务清单
   │     ├─ summary.md                # 总结
   │     └─ sessions/
   │        └─ <UTC_ID>/
   │           ├─ journal.md          # 时间线
   │           └─ reports/            # 证据
   └─ flow/                       # 工作流定义
      ├─ policies.md              # 规则
      ├─ commands/                # 命令说明（机器可读）
      │  ├─ cc-start.yml           # 新建功能与会话
      │  ├─ cc-next.yml            # 推进任务、产出证据
      │  ├─ cc-end.yml             # 校验并归档
      │  ├─ cc-load.yml            # 恢复上次进度（只读）
      │  ├─ cc-sync.yml            # 规格-代码一致性（只读）
      │  ├─ cc-git.yml             # Git 提交/分支/标签（需确认）
      │  ├─ cc-info.yml            # 更新项目信息（需确认）
      │  ├─ cc-config.yml          # 修改偏好（需确认）
      │  ├─ cc-archive.yml         # 手动归档轮换
      │  └─ cc-server.yml          # 启停服务/状态（可选）
      ├─ templates/               # 规格模板（/cc-start 生成）
      │  ├─ requirements.md        # 需求模板
      │  ├─ design.md              # 设计模板
      │  ├─ tasks.md               # 任务模板（含 {ref} 示例）
      │  ├─ summary.md             # 总结模板
      │  └─ journal.md             # 会话日志模板（含 WIP/DONE）
      └─ tools/quiet.sh           # 可选工具（安静构建/状态/停服）
```

单一事实来源：`.specs/`。

`archives/`：在 `/cc-end` 或 `/cc-archive` 后出现。

无全局 `reports/`、`checkpoints/`、`runtime/` 目录。

## 快速开始
初始化特性与会话：`/cc-start <feature>`

推进下一任务：`/cc-next <feature> [--sid <UTC_ID>]`

只读恢复进度：`/cc-load`

收尾并归档：`/cc-end <feature> [--sid <UTC_ID>]`

更多细节与最佳实践见下文。

## 安装
新项目直接使用本仓库即可。若要集成到现有项目，可按最小拷贝方式落地。

方式一（作为起始模板）

```
git clone https://github.com/heihuzicity-tech/codex-simpleflow.git
cd codex-simpleflow
/cc-start demo
```

方式二（集成到现有项目）

把以下文件/目录拷贝到你的项目根目录：

```
AGENTS.md
.specs/project.yml
.specs/flow/   （整个目录）
```

初始化一次以生成首个会话与规格：

```
/cc-start <feature-name>
```

前置环境建议：已安装 Git，能运行 Codex CLI；如要用 quiet.sh，请确保有 Bash 与 curl（可选）。

## 使用案例（从零到归档）
1) 新建功能与会话
   - `/cc-start login-page`
   - 生成规格与 `sessions/<UTC_ID>/journal.md`，并写入 `flow.current`
2) 推进任务（可多次）
   - `/cc-next login-page`
   - 产出证据到 `sessions/<UTC_ID>/reports/`；完成后勾选任务
3) 中断后恢复
   - `/cc-load`
   - 返回：`resumed login-page@<UTC_ID>; next=<N>|unknown; last=<report?>`
4) 收尾与归档
   - `/cc-end login-page`
   - 生成 `summary.md` 并打包该会话到 `.specs/archives/`

## 修复与一致性（差异发现 → 修复 → 验证）
步骤一（发现差异）：执行 `/cc-sync <feature> [--sid <UTC_ID>]`，在会话 `reports/` 下生成例如 `sync-<ts>.md` 的报告。

步骤二（实施修复）：进入 `/cc-next <feature> [--sid <UTC_ID>]` 推进，修复说明与补丁建议命名为 `reports/fix-<YYYYMMDDThhmmssZ>.md/.patch/.log`。

步骤三（复查一致性）：再次执行 `/cc-sync`，确认差异消除。

步骤四（更新进度）：在 `tasks.md` 勾选对应任务，或补充“后续项”。

步骤五（结束）：执行 `/cc-end <feature> [--sid]` 归档本次会话。

## 命令一览（摘）
`/cc-start`：脚手架规格与会话，并写入 `.specs/project.yml -> flow.current`。

`/cc-next`：推进任务，证据落入会话 `reports/`（可选 smoke）。

`/cc-end`：校验一致性并归档会话至 `archives/`。

`/cc-sync`：只读一致性检查，输出到会话 `reports/`。

`/cc-load`：只读恢复最新会话上下文（优先读取 `flow.current`）。

`/cc-git`、`/cc-info`、`/cc-config`、`/cc-archive`、`/cc-server`：详见 `.specs/flow/commands/*.yml`。

## 前置约定
编码与时间：UTF‑8（无 BOM），UTC 时间戳（`YYYY‑MM‑DDThhmmssZ`）。

禁用脚本类型：禁止 `*.ps1` 与 `*.bat`。

写入方式：统一使用原子补丁（`apply_patch`）。

锚点引用：在 `requirements.md`/`design.md` 使用 `[@req.*]`/`[@des.*]`；`tasks.md` 的 `{ref}` 指向这些锚点。

## 恢复中断（/cc-load）
`/cc-load`（无参，仅读）。

首选读取 `.specs/project.yml -> flow.current` 的 `<feature>/<session_id>`；若无效，回退到全局最近一次会话。

解析对应 `journal.md` 尾部的 `WIP/DONE` 标记；若无则以 `tasks.md` 首个未勾选为“下一步建议”。

输出摘要：`resumed <feature>@<UTC_ID>; next=<N>|unknown; last=<report?>`。

示例（journal 标记）：

```
- {ts} WIP task {n} {ref: [@req.x], [@des.y]}
- {ts} DONE task {n}
```

## 偏好项（`.specs/project.yml -> flow.preferences`）
`display.quiet`：安静模式（对话仅输出结论，日志落会话 `reports/`）。

`testing.auto_smoke`：在 `/cc-next` 后自动进行 smoke（如前端构建/探测）。

`retention.sessions.reports`：报告留存数与会话归档策略（如需）。

## 最佳实践
参数优先：命令入参（如 `<feature>`、`--sid`）优先于 `flow.current`。

证据归一：所有构建/验证/修复证据放在会话 `reports/`，`journal.md` 追加简要时间线。

小步留痕：推进前在 `journal.md` 写一行 WIP，完成后写 DONE；即使未更新 `tasks.md` 也能轻松恢复。

## 常见问题（FAQ）
看不到“上次进度”？

先执行 `/cc-load`；若提示指针无效，检查 `.specs/project.yml -> flow.current` 或直接在 `features/<feature>/sessions/` 中选择最新 `<UTC_ID>`，再执行 `/cc-next <feature> --sid <UTC_ID>`。

需要全局报告吗？

不需要。跨特性说明请写在 `AGENTS.md` 或当次会话 `reports/` 的概览文档。

为什么禁止 `*.ps1/*.bat`？

为降低跨平台与合规风险；统一使用 Bash 或平台无关语言/工具。

## 命令速查表（Cheatsheet）
`/cc-start <feature>`：创建规格与会话，写入 `flow.current`。

`/cc-next <feature> [--sid <UTC_ID>]`：推进任务，产出证据到会话 `reports/`。

`/cc-load`：只读恢复最近一次会话上下文；不写任何文件。

`/cc-end <feature> [--sid <UTC_ID>]`：校验一致性并归档到 `archives/`。

`/cc-sync <feature> [--sid]`：只读一致性检查，报告写入会话 `reports/`。

`/cc-git`：受控 Git 操作（确认后执行）。

`/cc-info`：项目信息采集/写入 `project.yml`（确认后执行）。

`/cc-config key=value [...]`：修改偏好（确认后执行）。

`/cc-archive [<feature>]`：手动归档/轮换（通常不必手动执行）。

`/cc-server start|stop|status ...`：可选服务管理；日志建议落会话 `reports/`。

## 作者与网站
作者：黑胡子

网站：https://www.heihuzicity.com

## 设计约定
- UTF‑8（无 BOM）、UTC 时间戳（`YYYY‑MM‑DDThhmmssZ`）。
- 禁止 `*.ps1/*.bat`；跨平台工具使用 Bash 或平台无关实现。
- 写入一律使用原子补丁；锚点 `[@req.*]`、`[@des.*]` 与 `{ref}` 保持一致。

## 文档
- 运行约定与命令触发：`AGENTS.md`
- 流程策略与共识：`.specs/flow/policies.md`
