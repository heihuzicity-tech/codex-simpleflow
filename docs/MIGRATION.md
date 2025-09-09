# 从 Kiro Workflow 迁移到 CC Workflow

## 为什么要迁移？

### 性能提升
- **48.4%** 文档精简
- **64.2%** 命令优化
- **60-75%** Context 节省
- **42%** 响应速度提升

### 功能增强
- ✅ 自动数据库备份
- ✅ 强制分支隔离
- ✅ 智能会话恢复
- ✅ 自动化项目收尾
- ✅ AI 多专家分析
- ✅ 防偏离机制

## 迁移前准备

### 1. 评估当前状态
```bash
# 检查是否有未完成的工作
ls -la .specs/
git status

# 如果有正在进行的功能，先完成或保存
/kiro-save
```

### 2. 备份现有配置
```bash
# 创建备份目录
mkdir kiro-backup

# 备份 Kiro 配置
cp -r .claude kiro-backup/
cp -r .specs kiro-backup/
cp CLAUDE.md kiro-backup/
```

## 迁移步骤

### Step 1: 下载 CC Workflow

```bash
# 克隆 CC Workflow 仓库
git clone https://github.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow.git cc-workflow
```

### Step 2: 替换命令文件

```bash
# 删除旧的 Kiro 命令
rm -rf .claude/commands/kiro-*.md

# 复制新的 CC 命令
cp cc-workflow/.claude/commands/cc-*.md .claude/commands/

# 更新配置文件
cp cc-workflow/.claude/CLAUDE.md .claude/
```

### Step 3: 迁移项目数据

```bash
# 保持项目信息
# project-info.md 格式兼容，无需修改

# 迁移会话状态（如果需要）
# session.md 可能需要调整格式
```

### Step 4: 验证迁移

```bash
# 列出新命令
ls -la .claude/commands/cc-*.md

# 测试基本命令
/cc-info    # 应该读取现有 project-info.md
/cc-task    # 查看当前状态
```

## 命令映射指南

### 一对一映射

| Kiro 命令 | CC 命令 | 变化说明 |
|-----------|---------|----------|
| kiro-info | cc-info | 功能相同，精简 52.8% |
| kiro-start | cc-start | 增加自动备份，精简 67% |
| kiro-next | cc-next | 智能 Context 管理，精简 69.7% |
| kiro-status | cc-task | 改名更简洁，精简 65.3% |
| kiro-save | cc-save | 增强上下文保存，精简 61.7% |
| kiro-load | cc-load | 智能恢复，精简 67.7% |
| kiro-end | cc-end | 自动化收尾，精简 57.1% |
| kiro-sync | cc-sync | 增强验证，精简 51% |
| kiro-analyze | cc-analyze | 多专家模式，精简 68.4% |
| kiro-think | cc-think | 深度分析，精简 60.3% |
| kiro-fix | cc-fix | 快速修复，精简 68.9% |
| kiro-git | cc-git | 简化操作，精简 65.2% |

### 使用习惯调整

#### 1. 命令前缀变化
```bash
# 旧习惯
/kiro-start 新功能
/kiro-next
/kiro-save

# 新习惯
/cc-start 新功能
/cc-next
/cc-save
```

#### 2. 输出更简洁
- Kiro：冗长的状态信息
- CC：关键信息 + 进度条

#### 3. 自动化程度更高
- Kiro：需要手动确认多个步骤
- CC：智能判断 + 关键点确认

## 文档结构对比

### Kiro 结构（复杂）
```
.specs/
├── analysis/
├── {feature}/
│   ├── requirements.md
│   ├── design.md
│   ├── tasks.md
│   ├── session-*.md    # 多个会话文件
│   ├── tests/
│   ├── scripts/
│   └── temp/
└── backups/
```

### CC 结构（简洁）
```
.specs/
├── project-info.md
├── session.md          # 单一会话文件
└── {feature}/
    ├── requirements.md
    ├── design.md
    ├── tasks.md
    └── summary.md
```

## 常见问题解决

### Q1: 命令不识别
**问题**：输入 `/cc-start` 没反应

**解决**：
1. 确认文件存在：`ls .claude/commands/cc-start.md`
2. 检查文件名拼写
3. 重启 Claude Code 会话

### Q2: 项目信息丢失
**问题**：`/cc-info` 显示空白

**解决**：
1. 检查 `.specs/project-info.md` 是否存在
2. 从备份恢复：`cp kiro-backup/.specs/project-info.md .specs/`

### Q3: 会话恢复失败
**问题**：`/cc-load` 无法恢复状态

**解决**：
1. 检查 session.md 格式
2. 手动编辑适配新格式
3. 或重新开始：`/cc-start`

### Q4: Git 分支混乱
**问题**：分支状态不一致

**解决**：
```bash
git status
git checkout main
git branch -D feature/old-feature
/cc-start 新功能
```

## 迁移后优化建议

### 1. 熟悉新命令
花 30 分钟浏览 `QUICK_REFERENCE.md`

### 2. 调整工作流程
- 利用自动备份特性
- 善用智能会话保存
- 充分使用 cc-analyze

### 3. 监控性能提升
- 对比 Context 使用量
- 观察响应速度
- 统计命令成功率

## 回滚方案

如果需要回滚到 Kiro：

```bash
# 恢复 Kiro 备份
rm -rf .claude
cp -r kiro-backup/.claude ./
cp kiro-backup/CLAUDE.md ./

# 恢复工作文件
rm -rf .specs
cp -r kiro-backup/.specs ./
```

## 获取支持

### 遇到问题？
1. 查看 `docs/COMMANDS.md` 了解命令详情
2. 参考 `QUICK_REFERENCE.md` 快速解决
3. 提交 Issue：[GitHub Issues](https://github.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow/issues)

### 反馈建议
欢迎通过 GitHub Issues 反馈使用体验和改进建议。

---

**CC Workflow v2.0.0**  
**让迁移变得简单，让开发更加高效**