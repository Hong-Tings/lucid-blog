---
title: '深色模式的设计与实现'
description: '不只是换个背景色——深色模式的设计原则和技术实现'
date: 2026-04-22
category: '技术'
tags: ['CSS', '设计', '用户体验']
---

## 不只是反色

很多开发者以为深色模式就是把背景改成黑色、文字改成白色。这种理解太简单了。

一个糟糕的深色模式，会让用户觉得在看负片。一个好的深色模式，会让用户觉得"这才是正确的打开方式"。

## 设计原则

### 1. 不要用纯黑

`#000000` 纯黑作为背景会导致文字与背景的对比度过高，长时间阅读会视觉疲劳。

推荐使用深灰色：

```css
:root {
  --bg-dark: #121212;  /* Material Design 推荐 */
  --bg-dark: #0a0a0a;  /* 更深一点 */
  --bg-dark: #1a1a1a;  /* 更柔和 */
}
```

### 2. 降低饱和度

深色背景上的高饱和度颜色会显得刺眼。需要降低饱和度，提高明度：

```css
/* 浅色模式 */
--text-primary: #1a1a1a;
--accent: #2563eb;

/* 深色模式 */
--text-primary: #e5e5e5;
--accent: #60a5fa;  /* 更亮、更柔和 */
```

### 3. 用高度表达层级

浅色模式用阴影（shadow）表达层级，深色模式用**表面亮度**：

```css
/* 浅色模式：阴影 */
.card { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

/* 深色模式：表面色 */
.dark .card {
  background: #1e1e1e;  /* 比背景亮一点 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
```

层级越高，表面越亮：

```
背景: #0a0a0a
卡片: #1e1e1e
弹窗: #2a2a2a
导航: #1e1e1e
```

## 技术实现

### CSS 变量方案

最灵活的方式是用 CSS 变量：

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --border: #e5e5e5;
}

:root.dark {
  --bg: #0a0a0a;
  --text: #e5e5e5;
  --border: #333333;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

### 系统偏好检测

```javascript
// 检测系统偏好
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 监听变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  document.documentElement.classList.toggle('dark', e.matches);
});
```

### 用户手动切换

```javascript
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// 初始化
const saved = localStorage.getItem('theme');
if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}
```

## 常见错误

### 1. 忘记处理图片

深色模式下，高亮度过高的图片会很刺眼。可以降低亮度：

```css
.dark img {
  filter: brightness(0.9);
}
```

### 2. 忘记处理阴影

浅色模式的阴影在深色模式下可能看不见或太突兀：

```css
.dark .card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
```

### 3. 忘记处理滚动条

浏览器默认的滚动条在深色模式下可能很违和：

```css
.dark ::-webkit-scrollbar-thumb {
  background: #444;
}
```

## 测试清单

- [ ] 所有文字可读性良好
- [ ] 图片不会过亮或过暗
- [ ] 阴影和层级关系清晰
- [ ] 表单元素（输入框、下拉框）样式正确
- [ ] 代码块语法高亮适配
- [ ] 图标和 SVG 颜色正确
- [ ] 系统偏好和手动切换都正常

---

*深色模式是现代 Web 应用的标配。做好它，不是可选项，是必须。*
