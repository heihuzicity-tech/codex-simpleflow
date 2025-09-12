# codex-simpleflow（Codex 轻量可追溯工作流）

[English Version](README_EN.md)

codex-simpleflow 是一套面向 Codex CLI 的轻量工作流基线。我们把“规格—过程—证据”统一收敛在仓库的 `.specs/` 下，用一小组 `/cc-*` 命令完成 开始 → 推进 → 校验/修复 → 收尾/归档 的闭环；任意时刻可通过 `/cc-load` 在只读模式恢复现场。目标是：开箱即用、约束最小、可回放、可审计。

## 为什么选择 codex-simpleflow
- 单一事实来源：状态、规格、会话、证据统一在 `.specs/`。
- 会话即证据：`sessions/<UTC_ID>/{journal.md,reports/}` 留痕；`/cc-end` 打包归档。
- 一键恢复：`/cc-load` 只读恢复（优先 `project.yml.flow.current`）。
- 最小读取：推进仅按 `{ref}` 精准读取；全量校验交给 `/cc-sync`。
- 安静输出：长日志写入会话 `reports/`，对话只给结论与路径。
- 原子 + 确认：所有写入走补丁；勾任务/改文档/Git/归档等敏感动作需确认。

## 工作流闭环（Workflow Loop）
```
cc-start -> cc-next -> (cc-sync | cc-fix) -> cc-end
             \-> cc-load (resume anytime)
```

## 一分钟上手（Quick Start）
- 初始化：`/cc-start <feature>`（生成三文档 + 会话 `journal.md`，写入 `flow.current`）
- 推进：`/cc-next <feature> [--sid <UTC_ID>]`（证据写入会话 `reports/`，确认后勾任务）
- 恢复：`/cc-load`（只读恢复上下文）
- 收尾：`/cc-end <feature> [--sid <UTC_ID>]`（校验并归档）

## 安全与验证（Safety Gates）
- 预检与守卫
  - Windows 脚本禁用：执行前通过 `guard-no-win-scripts.sh` 扫描，发现 `*.ps1/*.bat` 立即失败。
  - 最小读取：推进仅按 `{ref}` 精准读取，避免误读和大范围改动。
- 开始前（/cc-start）
  - 数据库备份提示：若检测到数据库配置/痕迹，优先执行备份；“跳过备份”必须明确确认。
  - Git 状态提示：建议在干净工作区开始，新建分支可通过 `/cc-git` 控制（如 `feature/<slug>`）。
- 推进中（/cc-next）
  - 只读→落证据→再确认：实现过程的长日志与构建输出落在会话 `reports/`；仅在你确认后才勾选任务。
  - 自动 smoke（可配）：`testing.auto_smoke=true` 时执行构建/探测以做“轻体检”。
- 结束时（/cc-end）
  - 完成度校验：任务勾选、设计一致性（parity）检查均通过才允许归档。
  - 一键归档：会话打包至 `.specs/archives/`；支持按保留策略轮转。
  - 清理提示：可结合项目脚本完成构建产物/临时文件清理（需确认）。
- Git 受控（/cc-git）
  - 提交/分支/打标签均需确认；避免隐式写入与历史污染。

示例（含安全检查）
```
/cc-start login-api         # 生成规格，提示 DB 备份与 Git 状态
/cc-next  login-api         # 实施并落证据；守卫脚本与可选 smoke
/cc-sync  login-api         # 只读一致性检查，报告写入 reports/
/cc-git                      # 经你确认后提交或建分支
/cc-end   login-api         # 校验通过→归档→可提示清理
```

## 项目结构（Project Structure）
```
simpleflow/
├─ AGENTS.md                       # Codex CLI 适配与执行约定（命令触发/工具/确认闸门）
├─ README.md                       # 本文档（中文）
├─ CHANGELOG.md                    # 变更记录
├─ .gitignore                      # 忽略规则
├─ .specs/                         # 单一事实来源（规格与证据）
│  ├─ project.yml                  # 偏好与活动指针（flow.current）
│  ├─ archives/                    # 会话归档（zip）
│  └─ features/                    
│     ├─ .gitkeep
│     ├─ <feature>/                # 常规特性
│     │  ├─ requirements.md        # 需求（含 [@req.*] 锚点）
│     │  ├─ design.md              # 设计（含 [@des.*] 锚点）
│     │  ├─ tasks.md               # 任务清单（{ref} 指向锚点）
│     │  ├─ summary.md             # 由 /cc-end 生成
│     │  └─ sessions/
│     │     └─ <UTC_ID>/
│     │        ├─ journal.md       # 时间线（含 WIP/DONE 示例）
│     │        └─ reports/         # 证据与日志
│     └─ fix-<slug>/               # 修复特性（可选，与上同结构）
└─ .codex/
   └─ flow/                        # 工作流基线（控制面）
      ├─ policies.md               # 策略与约束
      ├─ commands/                 # /cc-* 命令规范（正式）
      │  ├─ cc-start.yml  cc-next.yml  cc-load.yml  cc-sync.yml  cc-end.yml
      │  ├─ cc-git.yml    cc-info.yml  cc-config.yml  cc-archive.yml  cc-server.yml
      │  ├─ cc-fix.yml    cc-analyze.yml  cc-think.yml
      ├─ templates/               # 规格模板（/cc-start 从此生成）
      │  ├─ requirements.md  design.md  tasks.md  summary.md  journal.md
      └─ tools/                   # 工具（安静执行/守卫）
         ├─ quiet.sh
         └─ guard-no-win-scripts.sh
```

## 命令参考（Commands Reference）

| 命令 | 作用 |
| --- | --- |
| `/cc-start <feature>` | 脚手架规格并开启会话（生成三文档与 `journal.md`，更新 `flow.current`） |
| `/cc-next` | 执行下一条未完成任务（证据写入会话 `reports/`，确认后勾任务） |
| `/cc-load` | 只读恢复最近上下文（优先 `flow.current`，否则回退最近会话） |
| `/cc-sync` | 规格-实现一致性检查（只读，生成 `reports/sync-*.md`） |
| `/cc-end` | 校验完成并归档（生成 `summary.md` 与会话 zip，清空指针） |
| `/cc-git` | 受控 Git 操作（commit/branch/tag 需确认） |
| `/cc-info` | 记录项目信息到 `project.yml`（需确认） |
| `/cc-config key=value` | 设置偏好项到 `project.yml`（需确认） |
| `/cc-archive` | 手动归档轮换（按保留策略） |
| `/cc-server` | 服务启停/状态（持久化到 `.specs/runtime/serve.json`） |
| `/cc-fix` | 启动缺陷修复流：standalone 生成 `fix-<slug>` 与会话；或 scoped 向目标特性追加修复任务 |
| `/cc-analyze --target <path|feature>` | 只读分析并生成建议（报告写入会话 `reports/`） |
| `/cc-think [v1|v2|v3]` | 实施前提案/评估（确认后可改 specs 或导出补丁） |

## 偏好与策略
- 偏好项：`.specs/project.yml -> flow.preferences`（timezone、timestamp_format、display.quiet、testing.auto_smoke、retention 等）。
- 写入纪律：所有写入使用原子补丁；YAML/Markdown 校验通过才落盘。
- 确认闸门：勾任务、修改 requirements/design、服务操作、破坏性清理、Git 操作等必须确认。
- 脚本策略：禁止 `*.ps1/*.bat`；跨平台工具使用 Bash 或平台无关实现。

## 恢复与一致性
- `/cc-load`：优先读取 `flow.current`，否则扫描最近会话；从 `journal.md` 的 WIP/DONE 或 `tasks.md` 首个未完成项推断“下一步”。
- `/cc-sync`：提取锚点/契约并扫描代码，生成一致性报告到会话 `reports/`。

## 安装 / 集成
方式一（模板仓库）
```
git clone https://github.com/<your-org>/codex-simpleflow.git
cd codex-simpleflow
/cc-start demo
```

方式二（最小拷贝）
将如下文件/目录拷贝到既有项目根目录：
```
AGENTS.md
.specs/project.yml
.codex/flow/   （整个目录）
```
初始化首个特性与会话：
```
/cc-start <feature>
```

## FAQ
- 看不到“上次进度”？先用 `/cc-load`；若指针无效，从 `features/*/sessions/*` 选择最新 `<UTC_ID>` 并用 `--sid` 指给 `/cc-next`。
- 需要全局 `reports/` 吗？不需要。所有证据放在“当前会话”的 `reports/`；跨特性说明写在 `AGENTS.md` 或当次会话报告概览。
- 修复特性目录在哪里？统一使用 `.specs/features/fix-<slug>/`（小写 `[a-z0-9-]`）。若修复与原特性强耦合，优先在原特性 `tasks.md` 追加“修复任务”。

作者与网站：
- 黑胡子低科技集团（Heihuzicity Low‑Tech Group）
- https://www.heihuzicity.com/

