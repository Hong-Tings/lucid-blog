---
title: 'Tailwind CSS v4 迁移实战'
description: '从 v3 到 v4 的完整迁移指南，踩坑记录与性能对比'
date: 2026-05-03
category: '技术'
tags: ['Tailwind', 'CSS', '前端']
---

## 为什么要升级

Tailwind CSS v4 带来了一个全新的引擎——Oxide。官方宣称构建速度提升了 10 倍，CSS 体积减少了 50%。作为一个性能强迫症，我决定第一时间迁移。

## 配置文件的变化

v4 最大的变化是**不再需要 `tailwind.config.js`**。取而代之的是在 CSS 中直接配置：

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-display: "Instrument Serif", serif;
  --breakpoint-3xl: 1920px;
}
```

这种 CSS-first 的方式让我想起了 CSS 变量的灵活性，同时保留了 Tailwind 的原子化优势。

## 踩坑记录

### 1. 选择器语法变化

v3 的 `@apply` 在 v4 中仍然支持，但一些旧的工具类被重命名了：

```css
/* v3 */
.bg-opacity-50

/* v4 — 直接用 CSS 原生语法 */
background-color: rgb(0 0 0 / 50%);
```

### 2. 响应式前缀

v4 引入了新的断点语法，不再需要 `@screen`：

```css
/* v3 */
@media screen(md) { ... }

/* v4 */
@media (width >= 48rem) { ... }
```

### 3. 插件迁移

v4 的插件 API 完全重写了。如果你用了第三方插件，需要等作者更新或者自己适配。

## 性能对比

在同一个项目上的对比：

| 指标 | v3 | v4 |
|------|-----|-----|
| 构建时间 | 2.3s | 0.2s |
| CSS 体积 | 48KB | 22KB |
| 首屏加载 | 1.2s | 0.8s |

数据不会说谎。v4 的 Oxide 引擎确实是一个质的飞跃。

## 迁移建议

1. **先在小项目试水**：不要直接在生产项目上升级
2. **逐个组件验证**：确保每个组件的样式没有被破坏
3. **利用 codemod**：官方提供了自动迁移工具

```bash
npx @tailwindcss/upgrade
```

## 总结

v4 是 Tailwind 自诞生以来最大的一次重构。虽然迁移过程有些痛苦，但性能提升和开发体验的改善是值得的。

> 好的工具不会让你思考工具本身，而是让你专注于创造。
