# Git工作流规范

## 版本号规则

遵循语义化版本控制（Semantic Versioning 2.0.0）：`MAJOR.MINOR.PATCH`

- **MAJOR（主版本）**：不兼容的API更改
- **MINOR（次版本）**：向后兼容的功能新增
- **PATCH（补丁版本）**：向后兼容的错误修复

示例：
- `v0.1.0` → `v0.2.0`：新增功能
- `v0.1.0` → `v0.1.1`：Bug修复
- `v1.0.0` → `v2.0.0`：重大架构变更

---

## Commit Message规范

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

| Type | 说明 | 示例 |
|-------|------|------|
| `feat` | 新功能 | `feat: 添加用户上传Excel功能` |
| `fix` | Bug修复 | `fix: 修复深色模式文字看不清问题` |
| `docs` | 文档更新 | `docs: 更新API文档` |
| `style` | 代码格式调整 | `style: 统一代码缩进为2空格` |
| `refactor` | 重构代码 | `refactor: 重构公式计算引擎` |
| `perf` | 性能优化 | `perf: 优化大数据量渲染性能` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建/工具链更新 | `chore: 升级Tauri到2.1.0` |
| `revert` | 回滚提交 | `revert: 回滚feat/login` |

### Scope（可选）

指定修改的模块，常见Scope：
- `core`：核心逻辑
- `ui`：UI组件
- `api`：API接口
- `utils`：工具函数
- `docs`：文档
- `build`：构建配置

### Subject（必需）

简短描述（不超过50字符），使用动词开头，首字母小写：

```
❌ 错误：添加用户上传功能
✅ 正确：add user upload feature
```

### Body（可选）

详细描述修改内容，每行不超过72字符。解释**为什么**修改，而不仅仅是做了什么：

```
feat(api): 添加公式计算接口

- 支持嵌套公式计算
- 添加错误处理机制
- 优化大数据量计算性能

Closes #123
```

### Footer（可选）

关联Issue、 breaking changes等：

```
Closes #123
Refs #456
Breaking Change: API v1不再支持，请迁移到v2
```

---

## 分支策略

### 主分支

- **main**：生产环境，稳定版本
- **develop**：开发环境，最新功能

### 功能分支

从`develop`创建，命名规范：`feature/<功能名>`

```
feature/dark-mode
feature/excel-upload
feature/formula-combinations
```

### 修复分支

从`main`或`develop`创建，命名规范：`fix/<问题描述>`

```
fix/dark-mode-text-visibility
fix/memory-leak-in-table
```

### 发布分支

从`develop`创建，命名规范：`release/<版本号>`

```
release/v0.1.0
release/v0.2.0
```

---

## 工作流程

### 开发新功能

```bash
# 1. 从develop创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 开发代码，小步提交
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature

# 3. 开发完成，创建PR合并到develop
# 在GitHub/GitLab创建Pull Request
```

### 修复Bug

```bash
# 1. 从main创建修复分支（紧急修复）或从develop（常规修复）
git checkout main
git pull origin main
git checkout -b fix/bug-description

# 2. 修复代码，提交
git add .
git commit -m "fix: 修复XXX问题"
git push origin fix/bug-description

# 3. 合并到main并打标签
git checkout main
git merge fix/bug-description
git tag -a v0.1.1 -m "Release v0.1.1"
git push origin main --tags
```

### 发布新版本

```bash
# 1. 从develop创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v0.2.0

# 2. 更新版本号（package.json、Cargo.toml等）
# 3. 合并到main和develop
git checkout main
git merge release/v0.2.0
git tag -a v0.2.0 -m "Release v0.2.0"

git checkout develop
git merge release/v0.2.0

# 4. 推送
git push origin main --tags
git push origin develop

# 5. 删除发布分支
git branch -d release/v0.2.0
```

---

## 标签（Tags）规范

### 格式

`v<MAJOR>.<MINOR>.<PATCH>`

### 创建标签

```bash
# 轻量标签（仅引用commit）
git tag v0.1.0

# 附注标签（包含信息，推荐）
git tag -a v0.1.0 -m "Release v0.1.0 - 修复深色模式"
```

### 推送标签

```bash
# 推送单个标签
git push origin v0.1.0

# 推送所有标签
git push origin --tags
```

### 删除标签

```bash
# 删除本地标签
git tag -d v0.1.0

# 删除远程标签
git push origin :refs/tags/v0.1.0
```

---

## 版本检查清单

发布前检查：

- [ ] 所有测试通过（单元测试、集成测试、E2E测试）
- [ ] 更新CHANGELOG.md
- [ ] 更新版本号（package.json、Cargo.toml等）
- [ ] 更新文档（README、API文档）
- [ ] 代码审查通过
- [ ] 没有遗留的TODO或FIXME
- [ ] 性能测试通过
- [ ] 安全检查通过

---

## 紧急修复流程

```bash
# 1. 从main创建hotfix分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. 修复并测试
# ...

# 3. 合并到main和develop，打标签
git checkout main
git merge hotfix/critical-bug
git tag -a v0.1.1 -m "Hotfix v0.1.1 - 修复XXX"

git checkout develop
git merge hotfix/critical-bug

# 4. 推送
git push origin main --tags
git push origin develop
```

---

## 最佳实践

1. **小步提交**：每次提交一个完整的逻辑单元，不要混入不相关的修改
2. **清晰描述**：Commit message要准确描述做了什么和为什么
3. **不要提交敏感信息**：API密钥、密码等不要提交到仓库
4. **及时合并**：功能分支开发完成后及时合并，避免长时间分支
5. **定期同步**：每天开始工作前先pull最新代码
6. **代码审查**：合并前进行代码审查，确保代码质量
7. **使用.gitignore**：排除不需要版本控制的文件（node_modules、dist等）

---

## 工具推荐

- **Commitlint**：Commit message规范检查
- **Husky**：Git hooks，提交前自动检查
- **Conventional Changelog**：自动生成CHANGELOG.md
- **Release-it**：自动化版本发布流程

---

## 常见问题

### Q: 如何修改最近的commit message？

```bash
# 修改最近一次未推送的commit
git commit --amend

# 修改多次未推送的commit
git rebase -i HEAD~n
```

### Q: 如何合并多个commit？

```bash
# 交互式rebase
git rebase -i HEAD~n
# 将多个commit标记为squash
```

### Q: 如何撤销已推送的commit？

```bash
# 撤销最后一次commit（保留修改）
git reset --soft HEAD~1

# 撤销最后一次commit（丢弃修改）
git reset --hard HEAD~1

# 强制推送（慎用！）
git push origin main --force
```

---

**最后更新：** 2026-03-30
**维护者：** 阿伟（总裁）
