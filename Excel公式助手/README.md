# Excel公式助手

一款帮助用户快速查找、学习、对比、练习 Excel 公式的桌面应用。

## 功能特性

### 核心功能
- **公式库** - 55+ 常用 Excel 公式，分类浏览，智能搜索
- **公式详情** - 语法、参数、示例、错误案例、使用建议
- **公式对比** - 最多 3 个公式对比，自动推荐
- **练习模式** - 3 种题型（填空/选择/计算），错题本
- **收藏管理** - 收藏常用公式，快速访问

### 进阶功能
- **学习路径** - 可视化进度追踪，个性化学习建议
- **实战案例** - 数码 3C 行业 20 个案例，Excel 模板下载
- **公式组合** - 10 个常用组合，组合生成器，组合练习
- **交互式练习** - 表格编辑器，限时挑战，每日打卡

### 高级功能
- **Excel 上传分析** - 公式分析、优化建议、学习路径生成
- **案例生成** - 基于上传数据生成实战案例
- **模板管理** - 保存常用 Excel 为模板
- **公式提取** - 从 Excel 批量提取所有公式

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite + TailwindCSS + Naive UI
- **状态管理**: Pinia
- **路由**: Vue Router
- **桌面框架**: Tauri 2.x + Rust
- **Excel 处理**: xlsx

## 安装使用

### 下载安装
下载最新安装包：`src-tauri/target/release/bundle/nsis/excel-helper_0.2.3_x64-setup.exe`

### 开发构建

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm tauri:dev

# 构建发布
pnpm tauri:build
```

## 项目结构

```
Excel公式助手/
├── src/                    # 前端源代码
│   ├── views/             # 页面组件（23个页面）
│   ├── utils/             # 工具函数和数据
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── types/             # TypeScript 类型定义
│   └── assets/            # 静态资源
├── src-tauri/              # Tauri/Rust 代码
├── docs/                   # 项目文档
│   ├── prd/               # 需求文档
│   └── development/       # 开发日志
├── package.json
├── PROGRESS.md            # 进度跟踪
├── CHANGELOG.md           # 版本变更记录
└── README.md
```

## 版本信息

- 当前版本: v0.2.3
- 状态: 开发完成，待测试验证

## 开发者

阿伟（总裁）

## 许可证

MIT License
