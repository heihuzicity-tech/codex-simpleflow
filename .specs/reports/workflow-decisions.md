# 工作流设计共识（汇总）

更新时间：2025-09-11T22:05:00Z（UTC）

## 已确定内容

### 目录与命名
- 功能目录名一律采用英文 slug：小写、短横线、字符集 a–z 0–9 -，长度≤40，需全局唯一。
- 不再在仓库根目录放置 `codexflow/`；流程资料与产物集中到 `.specs/`。
- 按功能聚合的目标结构（示例，login-page 为 slug）：
  - `.specs/features/login-page/{requirements.md, design.md, tasks.md, summary.md}`
  - `.specs/features/login-page/sessions/<UTC_ID>/journal.md`（单文件时间线，替代大量 checkpoint 文件）
  - `.specs/features/login-page/sessions/<UTC_ID>/reports/*`（构建/验证/分析报告）
  - `.specs/runtime/serve.json`（运行中服务状态：端口、PID、命令）
  - `.specs/archives/login-page_<UTC_ID>.zip`（会话打包归档）
  - `.specs/current.yml`（当前活跃 feature 与 session 指针）
  - `.specs/index.yml`（可选但推荐：全局轻量索引）

### 指令与交互
- 指令不隐藏，保留斜杠：斜杠表示“明确执行，可能写入”。
- 最小指令集保留：`/cc-start`、`/cc-next`、`/cc-end`、`/cc-sync`、`/cc-git`、`/cc-info`。
- `/cc-next` 支持自然语言等价触发（“继续/确认/下一个”），但命令仍可直接使用。
- 新指令保留：
  - `/cc-server`（或别名 `/cc-serve`）：启动/停止/重启/状态；动作与状态写入 `.specs/runtime/`，日志归档到当前会话 `reports/`。
  - `/cc-archive`：显式触发当前或指定功能的归档与清理（手动操作时使用）。
- `/cc-config` 保留为“极薄偏好写入器”，仅更新流程偏好（时间戳、保留策略、自然语言开关等），项目事实仍由 `/cc-info` 维护。

### 记录与留痕
- 检查点不再散落根目录，改为“每会话一份 `journal.md`”，在对应 `sessions/<UTC_ID>/` 中按时间追加。
- 报告随会话存放在 `sessions/<UTC_ID>/reports/`，`/cc-end` 时一并打包入归档。
- 运行态（端口/PID/命令）统一写入 `.specs/runtime/`，便于回溯与清理。

### 写入与规范
- 所有写入一律通过 `apply_patch`；写前做轻量 YAML 校验（失败不落盘）。
- 编码统一 UTF‑8；时间戳统一 UTC，格式 `YYYY-MM-DDThhmmssZ`。
- requirements/design 关键条目可加锚点，`tasks.md` 的 `{ref}` 指向锚点，便于 `/cc-next` 精准读取与验证。
- 输出显示格式遵循“短段落 + 少量要点 + 结论优先”，仅在需要时使用简短条目清单。

## 默认策略（待你确认，可在 `.specs/project.yml` 的 `flow.preferences` 中调整）
- 会话轮换：每个功能保留最近 1 个会话为展开目录（keep_open=1），更早会话压缩为 zip 并删除原目录；最多保留 5 个归档包（keep_archives=5）。
- 报告保留：每会话内同类报告仅保留最近 3 份（keep_latest=3）。
- `index.yml`：推荐保留（聚合 slug、最近会话时间、完成度与状态），`/cc-start` 与 `/cc-end` 自动维护。
- `meta.yml`：默认不生成；当登记 owner/tags/status 等元信息时再创建精简版。

## 执行要点（对现有命令的最小改动）
- `/cc-start`：创建功能目录与会话目录，初始化 `journal.md` 与 `current.yml` 指针；按需刷新 `index.yml`。
- `/cc-next`：把进展与证据写入当次会话 `journal.md` 与 `reports/`；支持自然语言等价触发。
- `/cc-end`：生成 `summary.md`，打包 `sessions/<UTC_ID>` 至 `archives/`，按保留策略轮换并更新索引。
- `/cc-server`：记录动作与结果到 `.specs/runtime/` 和当前会话 `reports/`；支持 `start|stop|restart|status`（或 `up|down`）。
- `/cc-archive`：手动归档/清理入口（等价于在 `/cc-end` 之外主动执行归档策略）。
- `/cc-config`：以 key=value 方式修改 `flow.preferences`，变更前集中确认，并生成一次配置变更报告。

- 命令目录（示例）：`.specs/flow/commands/` 下包含 `cc-start.yml`、`cc-next.yml`、`cc-end.yml`、`cc-sync.yml`、`cc-git.yml`、`cc-info.yml`、`cc-server.yml`（或 `cc-serve.yml`）、`cc-archive.yml`、`cc-config.yml`；模板在 `.specs/flow/templates/`；运行小工具在 `.specs/flow/tools/`；轻量 schema 在 `.specs/flow/schemas/`。

## 风险与缓解
- Windows 路径与编码：采用英文 slug + UTF‑8 + 单层 `sessions/<UTC_ID>/` 结构，可显著降低风险。
- 误写路径：通过 `.specs/current.yml` 固定“当前指针”，命令内部统一由指针构造写入路径；异常即中止。
- 文件膨胀：通过“每会话一份 `journal.md` + 归档压缩 + 保留策略”解决。

---
如需调整默认策略或立即迁移现有内容到上述结构，请告知，我将给出迁移步骤（最小变更）。
