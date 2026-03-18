# 2048游戏 - UI设计文档

**版本:** v1.0.0
**创建日期:** 2026-03-16
**最后更新:** 2026-03-16
**作者:** 架构师 Agent
**状态:** 已确认

---

## 文档目的

本文档确认2048游戏的UI设计规范，包括布局、配色、样式和交互，为开发提供明确的UI实现指导。

---

## 设计原则

### 1. 简洁性
- 界面简洁，无冗余元素
- 信息层次清晰
- 符合2048经典风格

### 2. 可用性
- 按钮尺寸适合点击
- 文字清晰可读
- 操作反馈及时

### 3. 响应式
- 自适应不同屏幕尺寸
- 移动端触摸友好
- 字体和间距动态调整

### 4. 性能
- 动画流畅（60fps）
- 轻量级样式
- 无外部资源依赖

---

## 整体布局

### 桌面端布局（≥1024px）

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                   2048游戏                          │
│                                                     │
│    ┌───────────────┐  ┌───────────────┐           │
│    │  分数: 128    │  │  最高分: 4096 │           │
│    └───────────────┘  └───────────────┘           │
│                                                     │
│    ┌────┬────┬────┬────┐                           │
│    │    │    │    │    │                           │
│    │  2 │    │  8 │    │                           │
│    │    │    │    │    │                           │
│    ├────┼────┼────┼────┤                           │
│    │    │    │    │    │                           │
│    │    │  4 │  2 │    │                           │
│    │    │    │    │    │                           │
│    ├────┼────┼────┼────┤                           │
│    │    │    │    │    │                           │
│    │    │    │ 16 │ 32 │                           │
│    │    │    │    │    │                           │
│    ├────┼────┼────┼────┤                           │
│    │    │    │    │    │                           │
│    │    │    │    │    │                           │
│    │    │    │    │    │                           │
│    └────┴────┴────┴────┘                           │
│                                                     │
│              [重新开始]                              │
│                                                     │
│           ↑↓←→ 或滑动移动                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 移动端布局（<768px）

```
┌─────────────────────┐
│    2048游戏         │
├─────────────────────┤
│ ┌─────────┐┌────────┐│
│ │分数:128│ │最高分  │
│ │        │ │ 4096   ││
│ └─────────┘└────────┘│
├─────────────────────┤
│ ┌──┬──┬──┬──┐       │
│ │  │  │  │  │       │
│ │2 │  │8 │  │       │
│ │  │  │  │  │       │
│ ├──┼──┼──┼──┤       │
│ │  │  │  │  │       │
│ │  │4 │2 │  │       │
│ │  │  │  │  │       │
│ ├──┼──┼──┼──┤       │
│ │  │  │  │  │       │
│ │  │  │16│32│       │
│ │  │  │  │  │       │
│ ├──┼──┼──┼──┤       │
│ │  │  │  │  │       │
│ │  │  │  │  │       │
│ │  │  │  │  │       │
│ └──┴──┴──┴──┘       │
├─────────────────────┤
│    [重新开始]       │
├─────────────────────┤
│  ↑↓←→或滑动移动    │
└─────────────────────┘
```

---

## 配色方案

### 背景色

```css
/* 页面背景 */
--bg-color: #faf8ef;

/* 网格背景 */
--grid-bg-color: #bbada0;

/* 空格背景 */
--cell-bg-color: #cdc1b4;

/* 文字颜色 */
--text-color: #776e65;
--text-light-color: #f9f6f2;
```

### 分数盒

```css
/* 分数盒背景 */
--score-bg-color: #bbada0;

/* 分数标签 */
--score-label-color: #eee4da;

/* 分数数值 */
--score-value-color: #ffffff;
```

### 按钮

```css
/* 按钮背景 */
--button-bg-color: #8f7a66;

/* 按钮文字 */
--button-text-color: #ffffff;

/* 按钮悬停 */
--button-hover-color: #7f6a56;
```

---

## 数字方块样式

### 样式表

| 数字 | 背景色 | 文字颜色 | 字号 (px) |
|------|--------|----------|-----------|
| 0 (空格) | #cdc1b4 | - | - |
| 2 | #eee4da | #776e65 | 40 |
| 4 | #ede0c8 | #776e65 | 40 |
| 8 | #f2b179 | #f9f6f2 | 40 |
| 16 | #f59563 | #f9f6f2 | 36 |
| 32 | #f67c5f | #f9f6f2 | 36 |
| 64 | #f65e3b | #f9f6f2 | 36 |
| 128 | #edcf72 | #f9f6f2 | 32 |
| 256 | #edcc61 | #f9f6f2 | 32 |
| 512 | #edc850 | #f9f6f2 | 32 |
| 1024 | #edc53f | #f9f6f2 | 26 |
| 2048 | #edc22e | #f9f6f2 | 26 |
| >2048 | #3c3a32 | #f9f6f2 | 20 |

### CSS实现

```css
/* 空格 */
.tile-empty {
  background-color: var(--cell-bg-color);
}

/* 数字方块 */
.tile-2 { background-color: #eee4da; color: #776e65; font-size: 40px; }
.tile-4 { background-color: #ede0c8; color: #776e65; font-size: 40px; }
.tile-8 { background-color: #f2b179; color: #f9f6f2; font-size: 40px; }
.tile-16 { background-color: #f59563; color: #f9f6f2; font-size: 36px; }
.tile-32 { background-color: #f67c5f; color: #f9f6f2; font-size: 36px; }
.tile-64 { background-color: #f65e3b; color: #f9f6f2; font-size: 36px; }
.tile-128 { background-color: #edcf72; color: #f9f6f2; font-size: 32px; }
.tile-256 { background-color: #edcc61; color: #f9f6f2; font-size: 32px; }
.tile-512 { background-color: #edc850; color: #f9f6f2; font-size: 32px; }
.tile-1024 { background-color: #edc53f; color: #f9f6f2; font-size: 26px; }
.tile-2048 { background-color: #edc22e; color: #f9f6f2; font-size: 26px; }
.tile-super { background-color: #3c3a32; color: #f9f6f2; font-size: 20px; }
```

---

## 字体规范

### 字体族

```css
--font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
```

### 字体大小

```css
/* 标题 */
--title-font-size: 48px;

/* 分数标签 */
--score-label-font-size: 14px;

/* 分数数值 */
--score-value-font-size: 20px;

/* 按钮文字 */
--button-font-size: 16px;

/* 提示文字 */
--instructions-font-size: 14px;

/* 弹窗标题 */
--modal-title-font-size: 32px;

/* 弹窗文字 */
--modal-text-font-size: 18px;
```

### 字体粗细

```css
--font-weight-normal: 400;
--font-weight-bold: 700;
```

---

## 间距规范

### 桌面端

```css
/* 页面边距 */
--page-padding: 40px;

/* 标题下边距 */
--title-margin-bottom: 20px;

/* 分数盒间距 */
--score-gap: 10px;

/* 分数盒下边距 */
--score-margin-bottom: 20px;

/* 网格内边距 */
--grid-padding: 10px;

/* 格子间距 */
--cell-gap: 10px;

/* 格子尺寸 */
--cell-size: 80px;

/* 按钮上边距 */
--button-margin-top: 20px;

/* 提示文字上边距 */
--instructions-margin-top: 10px;
```

### 移动端

```css
/* 页面边距 */
--page-padding: 20px;

/* 标题下边距 */
--title-margin-bottom: 15px;

/* 分数盒间距 */
--score-gap: 8px;

/* 分数盒下边距 */
--score-margin-bottom: 15px;

/* 网格内边距 */
--grid-padding: 8px;

/* 格子间距 */
--cell-gap: 8px;

/* 格子尺寸（动态计算） */
--cell-size: calc((100vw - 40px - 24px) / 4);

/* 按钮上边距 */
--button-margin-top: 15px;

/* 提示文字上边距 */
--instructions-margin-top: 8px;
```

---

## 圆角规范

```css
/* 网格圆角 */
--grid-border-radius: 6px;

/* 格子圆角 */
--cell-border-radius: 3px;

/* 按钮圆角 */
--button-border-radius: 3px;

/* 弹窗圆角 */
--modal-border-radius: 6px;
```

---

## 动画规范

### 移动动画

```css
.tile {
  transition: transform 0.15s ease-in-out;
}
```

- **类型：** Transform
- **时长：** 150ms
- **缓动函数：** ease-in-out
- **触发条件：** 数字移动时

---

### 合并动画

```css
@keyframes merge {
  0% { transform: scale(1.0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1.0); }
}

.tile.merged {
  animation: merge 0.15s ease-in-out;
}
```

- **类型：** Scale动画
- **时长：** 150ms
- **缓动函数：** ease-in-out
- **效果：** 放大1.1倍再恢复
- **触发条件：** 数字合并时

---

### 生成动画

```css
@keyframes pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1.0); }
}

.tile.new {
  animation: pop 0.15s ease-in-out;
}
```

- **类型：** Scale动画
- **时长：** 150ms
- **缓动函数：** ease-in-out
- **效果：** 从0放大到1.1再恢复到1.0
- **触发条件：** 新数字生成时

---

## 交互规范

### 按钮交互

#### 悬停状态

```css
.btn-restart:hover {
  background-color: var(--button-hover-color);
  cursor: pointer;
}
```

#### 按下状态

```css
.btn-restart:active {
  transform: scale(0.95);
}
```

#### 禁用状态

```css
.btn-restart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

### 游戏结束弹窗

#### 显示动画

```css
.modal.show {
  opacity: 1;
  visibility: visible;
}

.modal.show .modal-content {
  transform: scale(1.0);
}
```

#### 隐藏动画

```css
.modal {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}

.modal .modal-content {
  transform: scale(0.9);
  transition: transform 0.3s ease;
}
```

---

## 响应式断点

```css
/* 手机端 */
@media (max-width: 767px) {
  /* 手机端样式 */
}

/* 平板端 */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 平板端样式 */
}

/* 桌面端 */
@media (min-width: 1024px) {
  /* 桌面端样式 */
}
```

---

## HTML结构

### 完整HTML结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2048游戏</title>
  <style>
    /* CSS样式 */
  </style>
</head>
<body>
  <div class="game-container">
    <!-- 标题 -->
    <header class="game-title">2048游戏</header>

    <!-- 分数区 -->
    <div class="score-container">
      <div class="score-box">
        <span class="score-label">分数</span>
        <span class="score-value" id="score">0</span>
      </div>
      <div class="score-box">
        <span class="score-label">最高分</span>
        <span class="score-value" id="best-score">0</span>
      </div>
    </div>

    <!-- 网格区 -->
    <div class="grid-container" id="grid">
      <!-- 16个格子 -->
      <div class="grid-cell" data-index="0"></div>
      <div class="grid-cell" data-index="1"></div>
      <div class="grid-cell" data-index="2"></div>
      <div class="grid-cell" data-index="3"></div>
      <div class="grid-cell" data-index="4"></div>
      <div class="grid-cell" data-index="5"></div>
      <div class="grid-cell" data-index="6"></div>
      <div class="grid-cell" data-index="7"></div>
      <div class="grid-cell" data-index="8"></div>
      <div class="grid-cell" data-index="9"></div>
      <div class="grid-cell" data-index="10"></div>
      <div class="grid-cell" data-index="11"></div>
      <div class="grid-cell" data-index="12"></div>
      <div class="grid-cell" data-index="13"></div>
      <div class="grid-cell" data-index="14"></div>
      <div class="grid-cell" data-index="15"></div>
    </div>

    <!-- 控制区 -->
    <div class="controls">
      <button id="restart-btn" class="btn-restart">重新开始</button>
    </div>

    <!-- 提示区 -->
    <div class="instructions">
      ↑↓←→ 或滑动移动
    </div>
  </div>

  <!-- 游戏结束弹窗 -->
  <div id="game-over-modal" class="modal hidden">
    <div class="modal-content">
      <h2>游戏结束！</h2>
      <p>最终得分: <span id="final-score">0</span></p>
      <button id="play-again-btn" class="btn-play-again">再来一局</button>
    </div>
  </div>

  <script>
    /* JavaScript代码 */
  </script>
</body>
</html>
```

---

## CSS样式实现

### 基础样式

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--page-padding);
}
```

### 游戏容器

```css
.game-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
```

### 标题

```css
.game-title {
  font-size: var(--title-font-size);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  margin-bottom: var(--title-margin-bottom);
}
```

### 分数区

```css
.score-container {
  display: flex;
  justify-content: center;
  gap: var(--score-gap);
  margin-bottom: var(--score-margin-bottom);
}

.score-box {
  background-color: var(--score-bg-color);
  border-radius: var(--grid-border-radius);
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.score-label {
  font-size: var(--score-label-font-size);
  color: var(--score-label-color);
  text-transform: uppercase;
}

.score-value {
  font-size: var(--score-value-font-size);
  font-weight: var(--font-weight-bold);
  color: var(--score-value-color);
}
```

### 网格容器

```css
.grid-container {
  background-color: var(--grid-bg-color);
  border-radius: var(--grid-border-radius);
  padding: var(--grid-padding);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--cell-gap);
  margin: 0 auto;
}

.grid-cell {
  background-color: var(--cell-bg-color);
  border-radius: var(--cell-border-radius);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
  transition: transform 0.15s ease-in-out;
}
```

### 按钮

```css
.btn-restart {
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  border: none;
  border-radius: var(--button-border-radius);
  padding: 12px 30px;
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  margin-top: var(--button-margin-top);
}

.btn-restart:hover {
  background-color: var(--button-hover-color);
}

.btn-restart:active {
  transform: scale(0.95);
}
```

### 提示文字

```css
.instructions {
  margin-top: var(--instructions-margin-top);
  font-size: var(--instructions-font-size);
  color: var(--text-color);
  opacity: 0.8;
}
```

### 游戏结束弹窗

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.modal.show {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: var(--modal-border-radius);
  text-align: center;
  transform: scale(0.9);
  transition: transform 0.3s ease;
  max-width: 90%;
}

.modal.show .modal-content {
  transform: scale(1.0);
}

.modal-content h2 {
  font-size: var(--modal-title-font-size);
  margin-bottom: 20px;
  color: var(--text-color);
}

.modal-content p {
  font-size: var(--modal-text-font-size);
  margin-bottom: 20px;
  color: var(--text-color);
}

.btn-play-again {
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  border: none;
  border-radius: var(--button-border-radius);
  padding: 12px 30px;
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn-play-again:hover {
  background-color: var(--button-hover-color);
}

.btn-play-again:active {
  transform: scale(0.95);
}
```

### 响应式样式

```css
@media (max-width: 767px) {
  body {
    padding: var(--page-padding);
  }

  .game-title {
    font-size: 36px;
  }

  .score-box {
    min-width: 80px;
    padding: 8px 15px;
  }

  .grid-container {
    gap: var(--cell-gap);
    padding: var(--grid-padding);
  }

  .grid-cell {
    font-size: 30px;
  }
}
```

---

## UI实现检查清单

### 开发前检查

- [ ] 配色方案已定义
- [ ] 字体规范已定义
- [ ] 间距规范已定义
- [ ] 动画规范已定义
- [ ] 响应式断点已定义

### 开发中检查

- [ ] 所有组件使用CSS变量
- [ ] 动画时长符合规范（≤150ms）
- [ ] 按钮有悬停和按下状态
- [ ] 弹窗有显示/隐藏动画
- [ ] 数字方块样式正确

### 开发后检查

- [ ] 桌面端布局正确（≥1024px）
- [ ] 平板端布局正确（768px-1023px）
- [ ] 手机端布局正确（<768px）
- [ ] 触摸滑动流畅
- [ ] 动画流畅（60fps）

---

## 总结

### UI设计特点

1. **经典风格**：采用经典2048配色
2. **简洁清晰**：界面简洁，层次清晰
3. **响应式**：自适应不同屏幕尺寸
4. **性能优化**：CSS动画，流畅流畅
5. **易于实现**：纯CSS，无外部依赖

### 关键设计元素

1. ✅ 配色：经典2048配色方案
2. ✅ 布局：标题→分数→网格→按钮→提示
3. ✅ 样式：数字方块根据数值显示不同颜色
4. ✅ 动画：移动、合并、生成三种动画
5. ✅ 响应式：三档断点适配

---

**设计状态：** ✅ 已确认
**下一步：** 传递给开发
