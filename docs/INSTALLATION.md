# CC Workflow 安装指南

## 系统要求

- Claude Code (Anthropic 官方 CLI)
- Git
- 任意操作系统（Windows/macOS/Linux）

## 安装方式

### 方式一：全新项目安装

1. **克隆 CC Workflow 仓库**
```bash
git clone https://github.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow.git cc-workflow
cd cc-workflow
```

2. **复制到您的项目**
```bash
# 进入您的项目目录
cd /path/to/your-project

# 复制 CC Workflow 文件
cp -r /path/to/cc-workflow/.claude ./
cp -r /path/to/cc-workflow/cc-workflow ./
```

3. **验证安装**
```bash
# 检查文件结构
ls -la .claude/commands/cc-*.md
ls -la cc-workflow/

# 应该看到 12 个 cc-*.md 命令文件
```

### 方式二：从 Kiro Workflow 升级

1. **备份现有 Kiro 配置**
```bash
# 备份当前配置
mv .claude .claude.kiro.backup
mv .specs .specs.kiro.backup
```

2. **安装 CC Workflow**
```bash
# 克隆 CC Workflow
git clone https://github.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow.git cc-workflow

# 复制新配置
cp -r cc-workflow/.claude ./
cp -r cc-workflow/cc-workflow ./
```

3. **迁移项目数据（可选）**
```bash
# 如果有正在进行的工作
cp .specs.kiro.backup/project-info.md .specs/
cp .specs.kiro.backup/session.md .specs/
```

### 方式三：最小化安装

只需要核心命令文件：

```bash
# 创建命令目录
mkdir -p .claude/commands

# 下载 CC Workflow 命令
cd .claude/commands
curl -O https://raw.githubusercontent.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow/main/.claude/commands/cc-start.md
curl -O https://raw.githubusercontent.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow/main/.claude/commands/cc-next.md
curl -O https://raw.githubusercontent.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow/main/.claude/commands/cc-task.md
# ... 下载所有 12 个命令文件

# 下载配置文件
cd ../
curl -O https://raw.githubusercontent.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow/main/.claude/CLAUDE.md
```

## 目录结构说明

安装后的项目结构：

```
your-project/
├── .claude/                    # Claude Code 配置目录
│   ├── CLAUDE.md              # 核心配置文件
│   └── commands/              # 命令目录
│       ├── cc-start.md        # 启动功能开发
│       ├── cc-next.md         # 执行下一任务
│       ├── cc-task.md         # 查看进度
│       ├── cc-save.md         # 保存会话
│       ├── cc-load.md         # 恢复会话
│       ├── cc-end.md          # 完成功能
│       ├── cc-sync.md         # 同步文档
│       ├── cc-analyze.md      # 代码分析
│       ├── cc-think.md        # 需求分析
│       ├── cc-fix.md          # Bug 修复
│       ├── cc-info.md         # 项目信息
│       └── cc-git.md          # Git 操作
├── cc-workflow/               # CC Workflow 文档（可选）
│   ├── README.md             # 项目说明
│   ├── QUICK_REFERENCE.md    # 快速参考
│   └── docs/                 # 详细文档
└── .specs/                   # 工作文件（自动创建）
    ├── project-info.md       # 项目信息
    ├── session.md            # 会话状态
    └── {feature}/            # 功能文档
```

## 配置说明

### .claude/CLAUDE.md

这是 CC Workflow 的核心配置文件，包含：

- **文档模板**：requirements.md, design.md, tasks.md 的格式
- **防偏离规则**：确保实现与设计一致
- **命令行为标准**：各命令的执行规范
- **错误处理策略**：统一的错误处理方式
- **开发标准**：Shell 脚本、服务管理、端口处理等规范

### 命令文件

每个 `cc-*.md` 文件都是自包含的命令定义，包括：

- 命令功能说明
- 执行约束（REQUIRED/PROHIBITED）
- 操作模板
- 错误处理

## 首次使用

1. **初始化项目信息**
```bash
/cc-info
```

2. **开始第一个功能**
```bash
/cc-start 用户登录功能
```

3. **查看当前状态**
```bash
/cc-task
```

4. **执行开发任务**
```bash
/cc-next
```

## 验证安装成功

在 Claude Code 中测试命令：

```
用户：/cc-info
Claude：正在初始化项目信息...
       [创建 .specs/project-info.md]
```

如果看到类似响应，说明安装成功！

## 故障排除

### 命令不识别

**问题**：输入 `/cc-start` 没有响应

**解决**：
1. 检查文件路径：`.claude/commands/cc-start.md`
2. 确保文件名正确（注意是 `cc-` 不是 `kiro-`）
3. 重启 Claude Code 会话

### 文件权限问题

**问题**：无法创建 .specs 目录

**解决**：
```bash
# 确保有写权限
chmod 755 .
mkdir -p .specs
```

### 从 Kiro 迁移冲突

**问题**：命令混淆或冲突

**解决**：
1. 完全删除旧的 Kiro 命令
2. 确保只有 cc-*.md 文件存在
3. 清理 .specs 目录重新开始

## 获取帮助

- **GitHub Issues**: [提交问题](https://github.com/heihuzicity-tech/ClaudeCode-Kiro-Workflow/issues)
- **快速参考**: 查看 `QUICK_REFERENCE.md`
- **详细文档**: 查看 `docs/` 目录

---

**CC Workflow v2.0.0**  
**革命性的 Kiro Workflow 重构版本**