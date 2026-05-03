# 分页背景风格统一 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为所有非首页页面创建统一的 CSS 动画背景系统，每个页面有独特主题，同时保持全站视觉一致。

**架构：** 新建 `PageBackground.astro` 纯组件（无客户端 JS），通过 `data-theme` 属性选择 10 种 CSS 动画主题。组件统一渲染颗粒纹理和光晕 blob，替代各页面手写的重复背景代码。

**技术栈：** Astro 5.7、Tailwind CSS 3.4、纯 CSS `@keyframes`

**规格文档：** `docs/superpowers/specs/2026-05-03-page-background-design.md`

---

## 文件结构

### 新建

| 文件 | 职责 |
|------|------|
| `src/components/effects/PageBackground.astro` | 统一背景组件：主题动画层 + 颗粒纹理 + 光晕 blob |

### 修改

| 文件 | 改动 |
|------|------|
| `src/layouts/BaseLayout.astro` | 移除 grain-overlay 和 ambient-orb（由 PageBackground 接管） |
| `src/pages/blog/index.astro` | 添加 `<PageBackground theme="ink" />`，删除 glow blob + ruled lines |
| `src/pages/blog/[...slug].astro` | 添加 `<PageBackground theme="focus" />`，删除 accent line |
| `src/pages/projects.astro` | 添加 `<PageBackground theme="grid" />`，删除 glow blobs + dot grid + 圆环 |
| `src/pages/gallery.astro` | 添加 `<PageBackground theme="lightbox" />`，删除 glow blob + 渐变线条 |
| `src/pages/tags/index.astro` | 添加 `<PageBackground theme="float" />`，删除 glow blob |
| `src/pages/tags/[tag].astro` | 添加 `<PageBackground theme="float" />`，删除 glow blob |
| `src/pages/about.astro` | 添加 `<PageBackground theme="pulse" />`，删除 glow blob + 斜线 |
| `src/pages/now.astro` | 添加 `<PageBackground theme="horizon" />`，删除 glow blob |
| `src/pages/uses.astro` | 添加 `<PageBackground theme="wave" />`，删除 glow blob + dot grid |
| `src/pages/guestbook.astro` | 添加 `<PageBackground theme="bubbles" />`，删除 glow blob + SVG 波浪线 |
| `src/pages/links.astro` | 添加 `<PageBackground theme="dots" />`，删除 glow blob + 节点连线 SVG |
| `src/pages/404.astro` | 添加 `<PageBackground theme="pulse" />`，删除 glow blobs + dot grid |

---

### 任务 1：创建 PageBackground 组件

**文件：**
- 创建：`src/components/effects/PageBackground.astro`

- [ ] **步骤 1：创建组件文件**

创建 `src/components/effects/PageBackground.astro`，包含完整的主题动画系统：

```astro
---
interface Props {
  theme: 'ink' | 'focus' | 'grid' | 'lightbox' | 'float' | 'pulse' | 'horizon' | 'wave' | 'bubbles' | 'dots';
}

const { theme } = Astro.props;
---

<div class="page-bg" data-theme={theme} aria-hidden="true">
  <div class="page-bg__animation"></div>
  <div class="page-bg__grain"></div>
  <div class="page-bg__orb page-bg__orb--1"></div>
  <div class="page-bg__orb page-bg__orb--2"></div>
</div>

<style>
  /* ===== Base ===== */
  .page-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
  }

  .page-bg__animation {
    position: absolute;
    inset: 0;
  }

  /* ===== Grain (unified across all themes) ===== */
  .page-bg__grain {
    position: absolute;
    inset: -200%;
    width: 400%;
    height: 400%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.08;
    mix-blend-mode: multiply;
    animation: grain 8s steps(10) infinite;
  }

  :global(.dark) .page-bg__grain {
    mix-blend-mode: soft-light;
    opacity: 0.12;
  }

  /* ===== Ambient Orbs (unified across all themes) ===== */
  .page-bg__orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
    background: rgba(0, 0, 0, 0.02);
  }

  :global(.dark) .page-bg__orb {
    background: rgba(255, 255, 255, 0.02);
  }

  .page-bg__orb--1 {
    width: 350px;
    height: 350px;
    top: 10%;
    left: -5%;
  }

  .page-bg__orb--2 {
    width: 280px;
    height: 280px;
    bottom: 15%;
    right: -3%;
  }

  /* ===== Theme: ink — warm gradient circles drifting ===== */
  [data-theme="ink"] .page-bg__animation {
    background:
      radial-gradient(circle at 30% 40%, rgba(212, 165, 116, 0.06), transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(180, 140, 100, 0.05), transparent 50%);
    animation: ink-drift 20s ease-in-out infinite alternate;
  }

  @keyframes ink-drift {
    0% {
      background-position: 0% 0%, 100% 100%;
    }
    100% {
      background-position: 30% 20%, 70% 80%;
    }
  }

  /* ===== Theme: focus — soft breathing glow ===== */
  [data-theme="focus"] .page-bg__animation {
    background: radial-gradient(circle at 50% 30%, rgba(212, 165, 116, 0.06), transparent 60%);
    animation: focus-breathe 8s ease-in-out infinite;
  }

  @keyframes focus-breathe {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  /* ===== Theme: grid — geometric lines with slow rotation ===== */
  [data-theme="grid"] .page-bg__animation {
    background-image:
      linear-gradient(rgba(212, 165, 116, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212, 165, 116, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: grid-shift 25s linear infinite;
  }

  @keyframes grid-shift {
    0% { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }

  /* ===== Theme: lightbox — large color blocks transitioning ===== */
  [data-theme="lightbox"] .page-bg__animation {
    background:
      radial-gradient(ellipse at 20% 50%, rgba(212, 165, 116, 0.05), transparent 60%),
      radial-gradient(ellipse at 80% 50%, rgba(180, 140, 100, 0.04), transparent 60%);
    animation: lightbox-shift 15s ease-in-out infinite alternate;
  }

  @keyframes lightbox-shift {
    0% {
      background-position: 0% 0%, 100% 100%;
    }
    100% {
      background-position: 20% 30%, 80% 70%;
    }
  }

  /* ===== Theme: float — small lights drifting upward ===== */
  [data-theme="float"] .page-bg__animation {
    background-image:
      radial-gradient(circle 2px at 20% 80%, rgba(212, 165, 116, 0.08), transparent),
      radial-gradient(circle 1.5px at 50% 90%, rgba(180, 140, 100, 0.06), transparent),
      radial-gradient(circle 2px at 80% 85%, rgba(212, 165, 116, 0.07), transparent),
      radial-gradient(circle 1px at 35% 75%, rgba(180, 140, 100, 0.05), transparent),
      radial-gradient(circle 1.5px at 65% 95%, rgba(212, 165, 116, 0.06), transparent);
    animation: float-rise 12s ease-in-out infinite;
  }

  @keyframes float-rise {
    0% { transform: translateY(0); }
    100% { transform: translateY(-40px); }
  }

  /* ===== Theme: pulse — radial gradient pulsing ===== */
  [data-theme="pulse"] .page-bg__animation {
    background: radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.06), transparent 60%);
    animation: pulse-glow 6s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
  }

  /* ===== Theme: horizon — horizontal lines flowing ===== */
  [data-theme="horizon"] .page-bg__animation {
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 79px,
        rgba(212, 165, 116, 0.04) 79px,
        rgba(212, 165, 116, 0.04) 80px
      );
    animation: horizon-slide 30s linear infinite;
  }

  @keyframes horizon-slide {
    0% { transform: translateX(0); }
    100% { transform: translateX(-80px); }
  }

  /* ===== Theme: wave — grid with ripple ===== */
  [data-theme="wave"] .page-bg__animation {
    background-image:
      radial-gradient(circle at 1px 1px, rgba(212, 165, 116, 0.04) 1px, transparent 0);
    background-size: 40px 40px;
    animation: wave-ripple 12s ease-in-out infinite;
  }

  @keyframes wave-ripple {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }

  /* ===== Theme: bubbles — soft circles floating ===== */
  [data-theme="bubbles"] .page-bg__animation {
    background-image:
      radial-gradient(circle 60px at 15% 30%, rgba(212, 165, 116, 0.04), transparent),
      radial-gradient(circle 40px at 75% 60%, rgba(180, 140, 100, 0.03), transparent),
      radial-gradient(circle 50px at 45% 80%, rgba(212, 165, 116, 0.035), transparent);
    animation: bubbles-float 18s ease-in-out infinite alternate;
  }

  @keyframes bubbles-float {
    0% {
      background-position: 0% 0%, 100% 100%, 50% 50%;
    }
    100% {
      background-position: 10% -10%, 90% 110%, 40% 60%;
    }
  }

  /* ===== Theme: dots — connected dots pulsing ===== */
  [data-theme="dots"] .page-bg__animation {
    background-image:
      radial-gradient(circle 2px at 20% 30%, rgba(212, 165, 116, 0.07), transparent),
      radial-gradient(circle 2px at 50% 60%, rgba(180, 140, 100, 0.06), transparent),
      radial-gradient(circle 2px at 80% 40%, rgba(212, 165, 116, 0.07), transparent),
      radial-gradient(circle 1.5px at 35% 75%, rgba(180, 140, 100, 0.05), transparent),
      radial-gradient(circle 1.5px at 65% 20%, rgba(212, 165, 116, 0.05), transparent);
    animation: dots-pulse 4s ease-in-out infinite;
  }

  @keyframes dots-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
</style>
```

- [ ] **步骤 2：验证构建**

运行：`npm run build`
预期：构建成功，无错误

- [ ] **步骤 3：Commit**

```bash
git add src/components/effects/PageBackground.astro
git commit -m "feat: 新增 PageBackground 组件，含 10 个 CSS 动画主题"
```

---

### 任务 2：清理 BaseLayout 中的重复背景元素

**文件：**
- 修改：`src/layouts/BaseLayout.astro`

**背景：** BaseLayout 当前渲染了 `grain-overlay` 和 4 个 `ambient-orb`。这些将由 `PageBackground` 统一渲染，需要移除以避免重复。

- [ ] **步骤 1：删除 grain-overlay div**

在 `src/layouts/BaseLayout.astro` 中，删除以下行（约第 57 行）：

```html
    <!-- Grain texture overlay -->
    <div class="grain-overlay" aria-hidden="true"></div>
```

- [ ] **步骤 2：删除所有 ambient-orb divs**

删除以下 4 个 ambient-orb div（约第 63-66 行）：

```html
    <!-- Ambient floating orbs — larger and more visible -->
    <div class="ambient-orb" aria-hidden="true" style="width: 600px; height: 600px; background: rgba(212, 165, 116, 0.06); top: 5%; left: -8%;"></div>
    <div class="ambient-orb" aria-hidden="true" style="width: 500px; height: 500px; background: rgba(201, 168, 124, 0.05); top: 35%; right: -10%;"></div>
    <div class="ambient-orb" aria-hidden="true" style="width: 450px; height: 450px; background: rgba(180, 140, 100, 0.04); bottom: 10%; left: 15%;"></div>
    <div class="ambient-orb" aria-hidden="true" style="width: 300px; height: 300px; background: rgba(212, 165, 116, 0.05); top: 60%; left: 50%;"></div>
```

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功（首页不受影响，它有自己的 FluidBackground）

- [ ] **步骤 4：Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "refactor: 移除 BaseLayout 中的 grain-overlay 和 ambient-orb，由 PageBackground 接管"
```

---

### 任务 3：博客列表页 — 主题 ink

**文件：**
- 修改：`src/pages/blog/index.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="ink" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 3 行（glow blob + ruled lines，约第 26-28 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/4 left-0 w-[300px] h-[300px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[80px]" aria-hidden="true" />
    {/* Horizontal ruled lines like a notebook */}
    <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" aria-hidden="true" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 31px, currentColor 31px, currentColor 32px); background-size: 100% 32px;" />
```

保留装饰大字 "B"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat(blog): 使用 PageBackground ink 主题，清理重复背景代码"
```

---

### 任务 4：博客文章页 — 主题 focus

**文件：**
- 修改：`src/pages/blog/[...slug].astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<article>` 之前添加：

```astro
  <PageBackground theme="focus" />
```

- [ ] **步骤 2：删除重复背景代码**

删除 accent line（约第 31 行）：

```astro
    {/* Subtle vertical accent line */}
    <div class="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-warm-200 dark:via-warm-700 to-transparent opacity-40" aria-hidden="true" />
```

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add "src/pages/blog/[...slug].astro"
git commit -m "feat(blog): 使用 PageBackground focus 主题，清理 accent line"
```

---

### 任务 5：项目页 — 主题 grid

**文件：**
- 修改：`src/pages/projects.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="grid" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 6 行（2 个 glow blob + dot grid + 2 个圆环，约第 16-22 行）：

```astro
    {/* Background glows */}
    <div class="absolute top-1/3 left-0 w-[350px] h-[350px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[100px]" aria-hidden="true" />
    <div class="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-[80px]" aria-hidden="true" />
    {/* Grid of dots pattern */}
    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 32px 32px;" aria-hidden="true" />
    {/* Corner accent */}
    <div class="absolute top-16 right-8 w-24 h-24 border border-warm-200 dark:border-warm-700 rounded-full" aria-hidden="true" />
    <div class="absolute top-20 right-12 w-16 h-16 border border-warm-100 dark:border-warm-800 rounded-full" aria-hidden="true" />
```

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/projects.astro
git commit -m "feat(projects): 使用 PageBackground grid 主题，清理重复背景代码"
```

---

### 任务 6：摄影页 — 主题 lightbox

**文件：**
- 修改：`src/pages/gallery.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="lightbox" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 3 行（glow blob + 2 条渐变线条，约第 9-14 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/2 right-0 w-[400px] h-[400px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[100px]" aria-hidden="true" />
```

和：

```astro
    {/* Horizontal accent lines */}
    <div class="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-warm-200 dark:via-warm-700 to-transparent" aria-hidden="true" />
    <div class="absolute bottom-32 left-0 w-full h-px bg-gradient-to-r from-transparent via-warm-100 dark:via-warm-800 to-transparent" aria-hidden="true" />
```

保留装饰大字 "G"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/gallery.astro
git commit -m "feat(gallery): 使用 PageBackground lightbox 主题，清理重复背景代码"
```

---

### 任务 7：标签页 — 主题 float

**文件：**
- 修改：`src/pages/tags/index.astro`
- 修改：`src/pages/tags/[tag].astro`

- [ ] **步骤 1：tags/index.astro — 添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="float" />
```

删除 glow blob（约第 19 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/4 right-0 w-[300px] h-[300px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[80px]" aria-hidden="true" />
```

保留装饰大字 "#"。

- [ ] **步骤 2：tags/[tag].astro — 添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="float" />
```

删除 glow blob（约第 29 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[80px]" aria-hidden="true" />
```

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/tags/index.astro "src/pages/tags/[tag].astro"
git commit -m "feat(tags): 使用 PageBackground float 主题，清理重复背景代码"
```

---

### 任务 8：关于页 — 主题 pulse

**文件：**
- 修改：`src/pages/about.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="pulse" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 2 行（glow blob + 斜线，约第 11-15 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/3 right-0 w-[400px] h-[400px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[100px]" aria-hidden="true" />
```

和：

```astro
    {/* Diagonal line */}
    <div class="absolute top-0 right-0 w-px h-[300px] bg-gradient-to-b from-warm-200 dark:from-warm-700 to-transparent origin-top rotate-[20deg]" aria-hidden="true" />
```

保留装饰大字 "Hi"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/about.astro
git commit -m "feat(about): 使用 PageBackground pulse 主题，清理重复背景代码"
```

---

### 任务 9：Now 页 — 主题 horizon

**文件：**
- 修改：`src/pages/now.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="horizon" />
```

- [ ] **步骤 2：删除重复背景代码**

删除 glow blob（约第 21 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[80px]" aria-hidden="true" />
```

保留装饰大字 "N"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/now.astro
git commit -m "feat(now): 使用 PageBackground horizon 主题，清理 glow blob"
```

---

### 任务 10：Uses 页 — 主题 wave

**文件：**
- 修改：`src/pages/uses.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="wave" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 2 行（glow blob + dot grid，约第 69-71 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[80px]" aria-hidden="true" />
    {/* Grid pattern */}
    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 32px 32px;" aria-hidden="true" />
```

保留装饰大字 "U"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/uses.astro
git commit -m "feat(uses): 使用 PageBackground wave 主题，清理重复背景代码"
```

---

### 任务 11：留言页 — 主题 bubbles

**文件：**
- 修改：`src/pages/guestbook.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="bubbles" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 2 行（glow blob + SVG 波浪线，约第 14-19 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[80px]" aria-hidden="true" />
```

和：

```astro
    {/* Wavy SVG line */}
    <svg class="absolute bottom-20 left-0 w-full h-8 opacity-[0.06] dark:opacity-[0.1]" aria-hidden="true" viewBox="0 0 1200 30" fill="none" preserveAspectRatio="none">
      <path d="M0 15Q150 0 300 15T600 15T900 15T1200 15" stroke="currentColor" strokeWidth="1" />
    </svg>
```

保留装饰 emoji "💬"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/guestbook.astro
git commit -m "feat(guestbook): 使用 PageBackground bubbles 主题，清理重复背景代码"
```

---

### 任务 12：友链页 — 主题 dots

**文件：**
- 修改：`src/pages/links.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="pt-28...">` 之前添加：

```astro
  <PageBackground theme="dots" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 2 行（glow blob + 节点连线 SVG，约第 17-30 行）：

```astro
    {/* Background glow */}
    <div class="absolute top-1/2 left-0 w-[300px] h-[300px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-[80px]" aria-hidden="true" />
    {/* Interconnected nodes SVG */}
    <svg class="absolute top-16 right-8 w-40 h-40 opacity-[0.06] dark:opacity-[0.1]" aria-hidden="true" viewBox="0 0 100 100" fill="none">
      <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="80" cy="30" r="3" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="70" r="5" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="30" cy="85" r="3" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="75" cy="80" r="4" stroke="currentColor" strokeWidth="0.5" />
      <line x1="20" y1="20" x2="80" y2="30" stroke="currentColor" strokeWidth="0.3" />
      <line x1="20" y1="20" x2="50" y2="70" stroke="currentColor" strokeWidth="0.3" />
      <line x1="80" y1="30" x2="50" y2="70" stroke="currentColor" strokeWidth="0.3" />
      <line x1="50" y1="70" x2="30" y2="85" stroke="currentColor" strokeWidth="0.3" />
      <line x1="50" y1="70" x2="75" y2="80" stroke="currentColor" strokeWidth="0.3" />
    </svg>
```

保留装饰大字 "∞"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/links.astro
git commit -m "feat(links): 使用 PageBackground dots 主题，清理重复背景代码"
```

---

### 任务 13：404 页 — 主题 pulse

**文件：**
- 修改：`src/pages/404.astro`

- [ ] **步骤 1：添加 import 和组件**

在 frontmatter 中添加 import：

```astro
import PageBackground from '../components/effects/PageBackground.astro';
```

在 `<BaseLayout>` 内、`<div class="min-h-screen...">` 之前添加：

```astro
  <PageBackground theme="pulse" />
```

- [ ] **步骤 2：删除重复背景代码**

删除以下 3 行（2 个 glow blobs + dot grid，约第 8-11 行）：

```astro
    {/* Background glows */}
    <div class="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-black/[0.02] dark:bg-white/[0.02] rounded-full blur-[100px]" aria-hidden="true" />
    <div class="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-black/[0.015] dark:bg-white/[0.015] rounded-full blur-[80px]" aria-hidden="true" />
    {/* Grid pattern */}
    <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 48px 48px;" aria-hidden="true" />
```

保留装饰大字 "404"。

- [ ] **步骤 3：验证构建**

运行：`npm run build`
预期：构建成功

- [ ] **步骤 4：Commit**

```bash
git add src/pages/404.astro
git commit -m "feat(404): 使用 PageBackground pulse 主题，清理重复背景代码"
```

---

## 自检

1. **规格覆盖度：** 所有 12 个页面均已覆盖，每个页面有独立任务。组件架构、主题定义、统一元素规范均已实现。
2. **占位符扫描：** 无 TODO、无"待定"、所有步骤包含完整代码。
3. **类型一致性：** `theme` 属性类型在组件定义和所有页面使用中保持一致（10 个字符串字面量）。
