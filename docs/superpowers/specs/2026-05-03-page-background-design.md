# 分页背景风格统一 — 设计规格

## 概述

为 Lucid 博客的所有非首页页面建立统一的视觉风格：每个页面拥有独特的 CSS 动画背景，同时通过共享的色彩、排版、组件、装饰元素、颗粒纹理和页面结构保持全站一致性。

## 设计决策

- **首页**保持现有 `FluidBackground`（WebGL 流体），不使用 `PageBackground`
- **其他页面**使用新建的 `PageBackground` 组件，纯 CSS 动画，零 JS 开销
- 每个页面有独特的背景主题，但共享统一的视觉语言

---

## 一、PageBackground 组件架构

### 文件

`src/components/effects/PageBackground.astro` — 纯 Astro 组件，无客户端 JS

### 用法

```astro
<PageBackground theme="ink" />
```

### DOM 结构

```html
<div class="page-bg" data-theme={theme}>
  <div class="page-bg__animation" />
  <div class="page-bg__grain" />
  <div class="page-bg__orb page-bg__orb--1" />
  <div class="page-bg__orb page-bg__orb--2" />
</div>
```

### 定位

- `position: fixed; inset: 0; z-index: -1` — 铺满视口，在内容下方
- 动画层通过 `data-theme` 属性选择 CSS 动画
- 颗粒纹理和光晕是所有主题共享的统一层

---

## 二、主题动画定义

所有动画的共同约束：
- 时长 8-30 秒，节奏缓慢
- 颜色只用 `rgba(212,165,116,x)` 和 `rgba(180,140,100,x)` 系列
- 透明度 0.03-0.08，隐约可见而非抢眼

| 主题 | 页面 | 效果 | 动画时长 |
|------|------|------|----------|
| `ink` | 博客列表 | 暖色渐变圆缓慢漂移，像墨水扩散 | 20s |
| `focus` | 博客文章 | 单一柔和光晕缓慢呼吸 | 8s |
| `grid` | 项目 | 细线网格 + 缓慢旋转的几何线条 | 25s |
| `lightbox` | 摄影 | 大面积色块缓慢过渡，像画廊灯光 | 15s |
| `float` | 标签 | 小光点缓慢上浮 | 12s |
| `pulse` | 关于 / 404 | 径向渐变微妙脉动 | 6s |
| `horizon` | Now | 水平细线缓慢横向流动 | 30s |
| `wave` | Uses | 网格底纹 + 柔和波纹涟漪 | 12s |
| `bubbles` | 留言 | 半透明圆形缓慢漂浮 | 18s |
| `dots` | 友链 | 连接点之间微弱脉动连线 | 4s |

---

## 三、页面集成方式

每个页面改动两处：

### 1. 引入组件

```astro
---
import PageBackground from '../components/effects/PageBackground.astro';
---

<BaseLayout title="文章 — Lucid">
  <PageBackground theme="ink" />
  <!-- 页面内容 -->
</BaseLayout>
```

### 2. 清理重复背景代码

删除各页面中手写的：
- glow blob `<div>`
- dot grid / ruled lines 样式
- 手写 SVG 装饰（波浪线、节点连线等）

保留：
- 装饰性大字（"B"、"G"、"N" 等），调整为更克制的透明度

### 统一页面结构

```
BaseLayout
├── PageBackground (fixed, 内容下方)
├── 装饰大字 (absolute, 在内容区内)
├── 标题区 (h1 + 副标题 + 渐变分割线)
├── 内容区 (毛玻璃卡片承载)
└── 底部 CTA (可选)
```

统一 padding：`pt-28 pb-16 px-6 md:px-12 lg:px-24`

---

## 四、统一元素规范

### 颗粒纹理

- 由 `PageBackground` 统一渲染
- 透明度：亮色 0.08，暗色 0.12
- `mix-blend-mode: multiply`（亮色）/ `soft-light`（暗色）

### 毛玻璃卡片

- 类名：`glass-card`
- 样式：`bg-white dark:bg-[#262626]` + `border-warm-200 dark:border-warm-700` + `rounded-2xl`
- hover：`box-shadow` 加深 + 边框变亮
- 首页半透明毛玻璃仅首页使用，其他页面用不透明卡片

### 装饰大字

- 字体：`font-display italic`
- 颜色：`text-warm-100 dark:text-warm-800/20`
- 大小：180-240px
- 属性：`select-none pointer-events-none`
- 位置：页面右上角或左上角，`absolute`

### 标题区

- `h1`：`text-2xl font-display italic tracking-tight` + `glitch-hover`
- 分割线：`h-px bg-gradient-to-r from-primary/20 dark:from-white/20 to-transparent`
- 副标题：`text-xs font-mono tracking-wider text-warm-400`

### 光晕 blob

- 由 `PageBackground` 统一渲染
- 尺寸 250-400px，`blur-[80px]`
- 颜色：`bg-black/[0.02] dark:bg-white/[0.02]`

### 按钮

- 主按钮：`bg-black dark:bg-white text-white dark:text-black` + `btn-ripple`
- 次按钮：`glass-card` 样式 + `font-mono tracking-wider uppercase`

---

## 五、改动范围

### 新建文件

| 文件 | 说明 |
|------|------|
| `src/components/effects/PageBackground.astro` | 背景组件，含所有主题动画 |

### 修改文件

| 文件 | 主题 | 删除内容 |
|------|------|----------|
| `src/pages/blog/index.astro` | `ink` | glow blob + ruled lines |
| `src/pages/blog/[...slug].astro` | `focus` | accent line |
| `src/pages/projects.astro` | `grid` | dot grid + 圆环装饰 |
| `src/pages/gallery.astro` | `lightbox` | 渐变线条 |
| `src/pages/tags/index.astro` | `float` | — |
| `src/pages/tags/[tag].astro` | `float` | — |
| `src/pages/about.astro` | `pulse` | glow blob + 斜线 |
| `src/pages/now.astro` | `horizon` | — |
| `src/pages/uses.astro` | `wave` | dot grid |
| `src/pages/guestbook.astro` | `bubbles` | SVG 波浪线 |
| `src/pages/links.astro` | `dots` | 节点连线 SVG |
| `src/pages/404.astro` | `pulse` | dot grid |

### 不改动

- `src/pages/index.astro` — 首页保持 `FluidBackground`
- 所有组件文件（`PostCard`、`Hero`、`BentoGrid` 等）
- `BaseLayout.astro`

---

## 六、技术约束

- `PageBackground` 是纯 Astro 组件，无 React / 客户端 JS
- 所有动画用 CSS `@keyframes`，无 GSAP / JS 动画
- 颜色统一使用 `warm-*` 自定义色阶
- 暗色模式通过 `dark:` Tailwind 变体实现
