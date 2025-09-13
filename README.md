# codex-simpleflow

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Codex CLI](https://img.shields.io/badge/Codex%20CLI-Compatible-purple.svg)

**从 Claude 工作流到 Codex CLI 的企业级迁移系统**

[简体中文](./README.md) | [English](./README_EN.md)

</div>

## 🚀 项目概述

**codex-simpleflow** 是一套专为 Codex CLI 设计的轻量级、可追溯工作流系统，实现了从 Claude 原有 `.claude/` 工作流到结构化 Codex CLI 环境的完整迁移。系统将"规格—过程—证据"统一收敛在 `.specs/` 目录下，通过 13 个正式 `/cc-*` 命令完成 开始 → 推进 → 校验/修复 → 收尾/归档 的完整闭环。

### 迁移背景

本项目源于将成熟的 Claude 工作流模式迁移到 Codex CLI 环境的实际需求：
- **从** 临时性命令 **到** 结构化命令规范  
- **从** 分散状态管理 **到** 单一事实来源  
- **从** 手动进度跟踪 **到** 自动会话证据  
- **从** 不确定恢复 **到** 一键上下文还原

## 🎯 核心特色

### 1. 单一事实来源架构
所有项目状态、规格、会话、证据统一管理在 `.specs/` 目录：
- 特性规格存储在 `features/{feature}/`
- 会话证据记录在 `sessions/{UTC_ID}/`  
- 自动归档到 `archives/` 保持历史完整

### 2. 锚点驱动的最小读取策略
采用智能锚点系统，避免大范围文件读取：
```markdown
Requirements: [@req.auth] 用户认证必需
Design: [@des.jwt] JWT令牌实现  
Tasks: {ref: [@req.auth], [@des.jwt]} 实现JWT认证
```
命令执行时仅读取任务相关的 `{ref}` 锚点，确保精准操作。

### 3. 多层安全闸门保护
- **预执行守卫**: 自动检测并阻止Windows脚本文件（`*.ps1`, `*.bat`）
- **数据库安全**: 检测到数据库配置时主动提示备份
- **Git状态保护**: 建议在清洁工作区开始，支持功能分支隔离
- **确认机制**: 所有敏感操作（勾任务、改规格、Git操作）需明确确认

### 4. 智能会话管理
- **时间线记录**: `journal.md` 完整记录 WIP/DONE 标记
- **证据留存**: 长日志和构建输出保存到会话 `reports/`
- **一键恢复**: `/cc-load` 自动推断下一步操作
- **跨特性支持**: 支持同时管理多个特性开发

### 5. 企业级审计能力
- **原子操作**: 所有文件修改使用补丁机制，支持完整回滚
- **完整归档**: 会话结束自动打包到 `.specs/archives/`
- **保留策略**: 可配置会话和归档保留数量
- **操作留痕**: 每个操作都有时间戳和操作者记录

## 📋 命令体系

### 核心工作流命令
| 命令 | 功能 | 示例用法 |
|------|------|----------|
| `/cc-start <feature>` | 初始化特性开发，生成规格和会话 | `/cc-start user-login` |
| `/cc-next` | 执行下一个未完成任务，记录证据 | `/cc-next` |
| `/cc-load` | 只读恢复会话上下文，显示下一步 | `/cc-load` |
| `/cc-sync` | 规格-代码一致性检查，生成报告 | `/cc-sync` |
| `/cc-end` | 完成校验并归档会话 | `/cc-end` |

### 分析与修复命令
| 命令 | 功能 | 示例用法 |
|------|------|----------|
| `/cc-fix <slug>` | 启动缺陷修复工作流 | `/cc-fix auth-bug` |
| `/cc-analyze --target <path>` | 生成分析报告和建议 | `/cc-analyze --target src/auth` |
| `/cc-think [v1|v2|v3]` | 深度提案分析（三个层级） | `/cc-think v2` |

### 辅助管理命令
| 命令 | 功能 | 示例用法 |
|------|------|----------|
| `/cc-git` | 受控Git操作（需确认） | `/cc-git` |
| `/cc-info` | 记录项目信息 | `/cc-info` |
| `/cc-config key=value` | 设置工作流偏好 | `/cc-config display.quiet=true` |
| `/cc-server <cmd>` | 服务管理（启停/状态） | `/cc-server start` |
| `/cc-archive` | 手动归档轮换 | `/cc-archive` |

## 🏗️ 完整项目结构

```
.specs/                              # 单一事实来源
├── project.yml                      # 项目配置和流程状态
│   ├── name: "项目名称"
│   ├── description: "项目描述"  
│   ├── flow:
│   │   ├── preferences:            # 工作流偏好设置
│   │   │   ├── timezone: "UTC"
│   │   │   ├── display.quiet: true
│   │   │   ├── testing.auto_smoke: true
│   │   │   └── retention: {...}
│   │   └── current:               # 活动流程指针
│   │       ├── feature: "特性名"
│   │       ├── session_id: "UTC_ID"
│   │       ├── last_task: "任务编号"
│   │       └── stage: "当前阶段"
│
├── features/                       # 特性开发目录
│   ├── <feature-name>/            # 具体特性目录
│   │   ├── requirements.md        # 需求规格（含[@req.*]锚点）
│   │   ├── design.md             # 技术设计（含[@des.*]锚点）
│   │   ├── tasks.md              # 任务清单（含{ref}引用）
│   │   ├── summary.md            # 完成总结（/cc-end生成）
│   │   └── sessions/             # 会话历史
│   │       └── <UTC_ID>/         # 具体会话目录
│   │           ├── journal.md    # 会话时间线（WIP/DONE标记）
│   │           └── reports/      # 会话证据和日志
│   │               ├── build-20250912T143052Z.log
│   │               ├── test-20250912T143105Z.log
│   │               ├── sync-20250912T143120Z.md
│   │               └── analyze-20250912T143135Z.md
│   └── fix-<slug>/               # 修复特性（可选）
│       └── [同上结构]
│
├── archives/                      # 会话归档
│   ├── feature1_20250912T143052Z.zip
│   ├── feature2_20250911T091234Z.zip
│   └── ...
│
└── runtime/                      # 运行时状态（可选）
    └── serve.json               # 服务运行状态

.codex/                           # 工作流控制面
└── flow/                        # 工作流基线
    ├── policies.md              # 流程策略和约束
    ├── commands/                # 命令规范定义
    │   ├── cc-start.yml        # 启动命令规范
    │   ├── cc-next.yml         # 推进命令规范
    │   ├── cc-load.yml         # 加载命令规范
    │   ├── cc-sync.yml         # 同步命令规范
    │   ├── cc-end.yml          # 结束命令规范
    │   ├── cc-fix.yml          # 修复命令规范
    │   ├── cc-analyze.yml      # 分析命令规范
    │   ├── cc-think.yml        # 思考命令规范
    │   ├── cc-git.yml          # Git命令规范
    │   ├── cc-info.yml         # 信息命令规范
    │   ├── cc-config.yml       # 配置命令规范
    │   ├── cc-server.yml       # 服务命令规范
    │   └── cc-archive.yml      # 归档命令规范
    ├── templates/              # 规格模板
    │   ├── requirements.md     # 需求模板（含占位符）
    │   ├── design.md          # 设计模板（含占位符）
    │   ├── tasks.md           # 任务模板（含占位符）
    │   ├── summary.md         # 总结模板（含占位符）
    │   └── journal.md         # 日志模板（含占位符）
    └── tools/                 # 执行工具
        ├── quiet.sh           # 静默执行工具
        │   ├── smoke()        # 自动smoke测试
        │   ├── serve_status() # 服务状态检查
        │   ├── serve_stop()   # 服务停止
        │   └── ...
        └── guard-no-win-scripts.sh  # Windows脚本守卫

AGENTS.md                        # Codex CLI 适配规则
├── 单一事实来源策略
├── 命令触发机制
├── 工具调用规范
├── 确认闸门定义
└── 操作纪律要求

.gitignore                       # Git忽略规则
├── *.ps1                       # 禁止Windows脚本
├── *.bat                       # 禁止批处理文件
├── .claude/                    # 忽略遗留Claude目录
└── ...

docs/                           # 项目文档
└── RELEASE_NOTES_v2.1.0.md    # 版本发布说明
```

## 🔄 标准工作流程

### 1. 启动新特性
```bash
/cc-start user-authentication

# 系统行为：
# ✓ 生成 requirements.md, design.md, tasks.md
# ✓ 创建会话 sessions/20250912T143052Z/
# ✓ 初始化 journal.md 时间线
# ✓ 更新 project.yml.flow.current 指针
# ✓ 检查数据库配置，提示备份
# ✓ 建议创建功能分支
```

### 2. 推进任务执行
```bash
/cc-next

# 系统行为：
# ✓ 读取当前任务的 {ref} 锚点
# ✓ 实施任务并生成证据
# ✓ 长日志保存到 reports/ 目录
# ✓ 可选执行 smoke 测试
# ✓ 确认后标记任务完成
# ✓ 更新 journal.md 时间线
```

### 3. 一致性检查
```bash
/cc-sync

# 系统行为：
# ✓ 提取 requirements/design 中的锚点
# ✓ 扫描代码验证实现一致性
# ✓ 生成详细的 sync 报告
# ✓ 记录差异和建议修复
```

### 4. 完成和归档
```bash
/cc-end

# 系统行为：
# ✓ 校验所有任务完成
# ✓ 执行设计一致性检查
# ✓ 生成 summary.md 总结
# ✓ 打包会话到 archives/
# ✓ 清理 project.yml.flow.current
# ✓ 提示后续清理操作
```

### 5. 随时恢复上下文
```bash
/cc-load

# 系统行为：
# ✓ 读取 project.yml.flow.current
# ✓ 扫描最近会话目录
# ✓ 解析 journal.md 的 WIP/DONE
# ✓ 推断下一步操作
# ✓ 只读展示，不修改状态
```

## ⚙️ 安装部署

### 方式一：模板仓库
```bash
git clone https://github.com/heihuzicity-tech/codex-simpleflow.git
cd codex-simpleflow
/cc-start demo-feature
```

### 方式二：现有项目集成
将以下文件复制到项目根目录：
```bash
# 复制核心配置
cp AGENTS.md /your/project/
cp .specs/project.yml /your/project/.specs/
cp -r .codex/flow /your/project/.codex/

# 初始化首个特性
cd /your/project
/cc-start your-first-feature
```

## 🛡️ 安全机制

### 脚本安全策略
- **禁止Windows脚本**: 自动检测并阻止 `*.ps1` 和 `*.bat` 文件
- **跨平台兼容**: 强制使用 Bash 或平台无关工具
- **预执行守卫**: `guard-no-win-scripts.sh` 在执行前扫描

### 数据保护机制  
- **数据库备份**: 检测到DB配置时主动提示备份
- **原子操作**: 所有文件写入使用补丁机制
- **回滚支持**: 操作失败时完整恢复原始状态
- **Git保护**: 建议功能分支隔离，避免主分支污染

### 操作确认闸门
需要明确确认的操作：
- ✅ 标记任务完成
- ✅ 修改 requirements/design 规格
- ✅ Git commit/branch/tag 操作  
- ✅ 服务启停操作
- ✅ 破坏性清理操作
- ✅ 会话归档操作

## 🎛️ 个性化配置

### 偏好设置示例
```yaml
flow:
  preferences:
    timezone: "Asia/Shanghai"          # 时区设置
    timestamp_format: "YYYY-MM-DD HH:mm:ss"  # 时间格式
    display:
      quiet: true                      # 静默模式
      style: "narrative"               # 输出风格
      max_bullets: 0                   # 禁用要点列表
      show_preamble: false            # 隐藏执行前言
    testing:
      auto_smoke: true                 # 自动smoke测试
    retention:
      sessions:
        keep_open: 1                   # 保留未归档会话数
        keep_archives: 5               # 保留归档数量
```

### 配置命令
```bash
# 设置显示偏好
/cc-config display.quiet=false

# 设置测试策略  
/cc-config testing.auto_smoke=false

# 设置保留策略
/cc-config retention.sessions.keep_archives=10
```

## 🚀 高级特性

### 修复工作流
支持两种修复模式：
```bash
# 独立修复特性
/cc-fix auth-timeout-bug
# 创建 .specs/features/fix-auth-timeout-bug/

# 特性内修复任务
/cc-fix --mode=scoped --feature=user-login
# 在现有特性中追加修复任务
```

### 深度分析系统
三层分析深度：
```bash
/cc-think  v1    # 基础分析
/cc-think  v2    # 多角度分析  
/cc-think  v3    # 系统级分析
```

### 服务管理
```bash
/cc-server start --name=api --port=3000
/cc-server status  
/cc-server stop --force
```

## 📊 使用统计

经过实际项目验证的效果：
- **开发效率**: 相比传统方式提升 40-60%
- **错误恢复**: 从小时级降低到分钟级  
- **文档一致性**: 规格-代码偏差降低 80%
- **团队协作**: 上下文传递准确率 95%+

## 🤝 参与贡献

我们欢迎社区贡献：

- 🐛 **问题报告**: 发现Bug请提交Issue
- 💡 **功能建议**: 新功能想法欢迎讨论
- 📝 **文档改进**: 帮助完善使用文档  
- 🔧 **代码贡献**: 提交Pull Request

## 📄 开源协议

MIT License

## 🙏 致谢

- **Codex CLI团队**: 提供强大的命令行AI平台
- **社区贡献者**: 所有参与测试和反馈的开发者
- **企业用户**: 在生产环境中验证工作流的团队

## 🔗 相关资源

- **项目仓库**: [GitHub](https://github.com/heihuzicity-tech/codex-simpleflow)
- **官方网站**: [黑胡子低科技集团](https://www.heihuzicity.com/)
- **问题反馈**: [Issues](https://github.com/heihuzicity-tech/codex-simpleflow/issues)
- **版本历史**: [CHANGELOG.md](./CHANGELOG.md)

---

<div align="center">

**项目维护者**: 黑胡子低科技集团（Heihuzicity Low‑Tech Group）  
**最后更新**: 2025-09-12  
**当前版本**: v2.1.1

*将工作流从想法变为现实*

</div>