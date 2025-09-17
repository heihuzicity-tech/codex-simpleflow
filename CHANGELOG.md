# 更新日志

本项目遵循“精简、可恢复、会话留痕”的工作流设计。重要变更记录如下。

## [Unreleased]
### 规则与流程完善
### 自动化加强
- `/cc-next` 全流程强制写入 `状态: 开始新任务 → 进行中 → 等待测试 → 完成`，并在验收前阻断不完整状态；`quiet.sh task_state` 与 `cc_next_state.py` 提供命令化写入能力，保证 `/cc-load` 可一键恢复上下文。
- Start SOP：在 `/cc-start` 中新增前置检查、≤5 问精简问答、草案预览、单次确认原子写入三份规格，随后立即创建会话并更新指针；问答与草案摘要记录在 session.md；精简为单一路径，移除可选模式。
- State Machine：明确不变量：`/cc-start` 阶段仅有 INIT；进入 `/cc-next` 才允许 WIP/DONE，并同步 `flow.current.last_task`；禁止 `stage!=Active` 或 `last_task=null` 时出现 WIP。
- cc-next：保持最小化校验与简洁推进逻辑；确认后标记任务完成并更新进度（可选刷新指针）。
- cc-end：保持最小化校验，归档并清空指针为初始态（实现细节由工具层处理）。
- cc-sync：聚焦规格与代码一致性，保持只读与简洁报告。
- cc-fix（scoped）：不再写入 session.md 的 WIP，仅向目标特性的 tasks.md 追加修复任务，由 `/cc-next` 推进。
- index.yml：移除各命令对 `.specs/index.yml` 的可选读取/写入描述，保持主路径最小化。
- cc-info：公共信息采用通用 `facts` 树记录于 `.specs/project.yml`（如 `facts.cheatsheets[]`），可选生成极简会话备忘（受 `flow.preferences.info` 控制）。
 - cc-info：支持通用最小结构：`facts.cheatsheets[]`、`facts.kv[]`、`facts.services[]`、`facts.commands[]`，避免与具体技术耦合；严禁存储密钥。
 - 去重：将状态机不变量的权威描述集中到 `policies.md`，在其他文档仅做引用，避免重复与漂移。

## [2.1.1] - 2025-09-13
### 文档优化
- **README 重构**: 全面重写中文 README.md，突出项目核心特色和迁移价值
- **英文文档**: 新增完整的 README_EN.md 英文版本，支持国际化推广
- **结构展示**: 详细展开 `.specs/` 和 `.codex/flow/` 目录结构到文档级别
- **特性说明**: 强化锚点驱动、安全闸门、会话管理等核心特性描述
- **使用指南**: 添加完整的安装部署、配置管理、高级特性使用说明
- **视觉优化**: 增加项目徽章、居中布局，提升 GitHub 展示效果

### 内容完善
- **命令参考**: 完善 13 个正式命令的功能说明和使用示例
- **工作流程**: 详细描述标准工作流的 5 个阶段和系统行为
- **安全机制**: 强调脚本安全、数据保护、确认闸门等企业级特性
- **项目定位**: 明确"从 Claude 到 Codex CLI 迁移系统"的核心价值
- **贡献指南**: 添加社区参与、问题反馈、开源协议等相关信息

## [2.1.0] - 2025-09-13
- 目录迁移：将 flow 从 `.specs/flow/` 彻底迁移至 `.codex/flow/`；删除旧目录；README 与 AGENTS 全量更新至新路径。
- 命令集：`/cc-fix`、`/cc-analyze`、`/cc-think` 升级为“正式命令”，与 `/cc-start`、`/cc-next`、`/cc-load`、`/cc-sync`、`/cc-end` 并列。
- 安全与验证：README 新增“Safety Gates”说明；执行前守卫（禁用 `*.ps1/*.bat`）、开始前 DB 备份提示、受控 Git、结束一致性校验与归档清理、可选自动 smoke。
- 环境策略：移除对 `.env.local` 的绑定；统一为“尊重项目现有环境配置（.env/.env.*/CI/脚本环境），变更需确认”；日志/PID 路径为默认值（`logs/service.log`/`logs/service.pid`），若项目策略另有规定，以项目为准。
- 忽略项：将 `.claude/` 加入 `.gitignore`，旧 Claude 文档仅作迁移参考。
- 作者信息：README 添加“黑胡子低科技集团（Heihuzicity Low‑Tech Group）”与网站 `https://www.heihuzicity.com/`。

## [2.0.0] - 2025-09-11
- 引入 `.specs/flow` 基线（policies、commands、templates）。
- 建立最小命令集：`/cc-start`、`/cc-next`、`/cc-end`、`/cc-sync`、`/cc-git`、`/cc-info`、`/cc-server`、`/cc-archive`、`/cc-config`。
- 采用 feature‑centric 结构与会话 `session.md` + 同目录附件的证据留存方式。

## [1.0.0] - 初始版本
- 初始化仓库与基础工作流文档。
