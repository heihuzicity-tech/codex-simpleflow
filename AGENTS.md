# CodexFlow 执行适配说明

本文件用于指导在 Codex CLI 环境下如何执行 codexflow/ 中定义的工作流。不要在此复制或发明新规则，命令与约束以 `codexflow/policies.md` 与 `codexflow/commands/*.yml` 为唯一规范来源。

## 适用范围
- 作用于整个仓库；当需要使用“/cc-*”命令时，按本适配说明运行。

## 执行约定
- 命令触发：对话中输入 `/cc-*` 视为运行对应命令（见 commands）。
- 工具使用：
  - 读取/检测：`shell`（只读探测，如 git 状态/DB 线索）
  - 写入/变更：`apply_patch`（原子落盘，尽量一次性写全）
  - 过程呈现：`update_plan`（始终仅一个 in_progress）
- 确认闸门（必须先征询）：
  - 标记任务完成、修改 requirements/design、跳过数据库备份
  - 变更由 `cc-sync` 建议的文档状态
  - Git 提交/分支/合并、发布/打标签
- 最小读取策略：
  - `cc-task` 仅读 `tasks.md` 的 Progress 段
  - `cc-next` 仅按任务 `{ref: ...}` 读取 requirements/design 相关片段
  - `cc-sync` 全量读取三文档并比对代码证据
- 检查点策略：
  - 如不执行 Git 提交，则在 `.specs/checkpoints/{timestamp}.md` 记录模拟检查点

## 单一事实来源
- 运行时状态以 `.specs/` 为唯一事实来源：
  - `.specs/project.yml`、`.specs/session.yml`
  - `.specs/features/{feature}/` 下的 requirements/design/tasks/summary
  - `.specs/reports/*` 与 `.specs/checkpoints/*`

## 引用
- 全局政策与约束：`codexflow/policies.md`
- 命令执行手册：`codexflow/commands/*.yml`

