# Lucid Blog — 开发记录

## 项目概述

基于 Astro 5.7 + React 岛屿架构的个人博客，暖色调设计风格，支持 SSR/SSG。

---

## 一、核心组件

### 音乐播放器（NowPlaying）

- **状态管理**：`player-store.ts` — pub/sub 模式，`useSyncExternalStore` 订阅
- **数据外置**：`playlist.json` — 独立于组件，便于更新曲目
- **功能**：播放/暂停/上下首/进度条拖拽/时间显示
- **扩展**：支持真实音频（`src` 字段）和模拟播放两种模式
- **SSR 兼容**：`useSyncExternalStore` 第三参数 `getServerSnapshot`

### 命令面板（CommandPalette）

- `⌘K` / `Ctrl+K` 唤起
- 键盘导航（↑↓选择，Enter 跳转）
- 分组搜索：页面 + 博客文章

### 流体背景（FluidBackground）

- WebGL 流体模拟（Navier-Stokes 求解器），移植自 Pavel Dobryakov 的 WebGL-Fluid-Simulation（MIT）
- 暖色调（hue 0.05-0.20，琥珀/橙色范围）
- Bloom + Sunrays 后处理
- 自动流动：每 4 秒随机生成 1-2 个流体喷射
- 鼠标悬移交互（无需点击）
- `position: fixed` 贯穿全页，仅首页启用（`showFluid` prop）

### 渐变遮罩（fluid-gradient-mask）

- 固定定位，从顶部 `rgba(28,28,28,0.85)` 渐变到底部 `transparent`
- 滚动越深，流体越清晰，页面底部完全暴露

---

## 二、首页效果

### Hero 区域

- **GlowTypewriter** — 逐字出现 + 每个字符出现时琥珀色光晕
- **TextReveal** — 标题文字逐行显现
- **毛玻璃** — `backdrop-filter: blur(20px) saturate(1.4)` 保证文字可读
- SVG 动画圆环 + 旋转虚线环 + 角落装饰线
- 浮动 Scroll 提示

### 内容区块

- **Marquee** — 滚动文字带
- **Stats** — 统计数字（AnimatedCounter）
- **BentoGrid** — 网格卡片布局，GSAP 滚动动画
- **TechStack** — 技术栈卡片，故事性描述
- **GamingShelf** — 游戏架，状态标签（进行中/已通关/想玩）
- **Interests** — 兴趣爱好，左右交替布局
- **Timeline** — 最新文章时间线

### 视觉统一

- 全站暗色主题，内容区块 `bg-[#1c1c1c]/70` + `backdrop-blur-sm`
- 流体暖色透过半透明背景隐约可见
- 所有组件文字/背景/边框统一为深色方案

---

## 三、博客功能

### 文章页面

- **ReadingProgress** — 字数统计 + 阅读时间 + 滚动百分比
- **ShareButtons** — Twitter/微博分享 + 复制链接
- **RelatedPosts** — 底部推荐最多 3 篇相关文章
- **Tag 链接** — 文章标签可点击跳转

### 标签系统

- `/tags` — 标签云页面，大小按文章数量缩放
- `/tags/[tag]` — 按标签筛选文章列表

### 代码块样式

- 仿 macOS 终端风格：红黄绿圆点 + 语言标签 + 复制按钮
- 行号（CSS counter 实现）
- 行高亮 + hover 效果

---

## 四、新增页面

| 路径 | 说明 |
|------|------|
| `/404` | 自定义 404 页面，大号装饰文字 |
| `/tags` | 标签云 |
| `/tags/[tag]` | 标签详情 |
| `/uses` | 工具与设备（5 个分类） |
| `/now` | 当前动态时间线 |

---

## 五、交互效果

| 组件 | 说明 |
|------|------|
| ScrollProgress | 顶部进度条，暖色渐变 + 发光尾迹 |
| BackToTop | 回到顶部按钮（左下角，避免与播放器重叠） |
| CursorSpotlight | 鼠标跟随光晕（仅暗色模式） |
| FluidBackground | WebGL 流体 + 自动流动 + 鼠标交互 |
| GlowTypewriter | 逐字光晕打字机 |
| WaveDivider | 三层波浪 SVG 分隔线 |

---

## 六、设计决策

### 命名

- 网站仅使用英文名 **Lucid**，移除所有"清醒"字样

### 滚动条

- 完全隐藏（`scrollbar-width: none` + `::-webkit-scrollbar { width: 0 }`）

### 顶栏

- 首页：全透明 + 白色文字，与流体背景融合
- 滚动 80px 后：毛玻璃背景 + 深色文字
- 非首页：正常显示

### 音乐播放器

- 移出 SmoothScroll 容器（Lenis transform 导致 `position: fixed` 失效）
- 固定在右下角，BackToTop 在左下角

### 暖色调

- 整体色系：琥珀/暖黄/米色，无蓝紫色
- `warm-100` 到 `warm-900` 色阶

---

## 七、技术栈

- **框架**：Astro 5.7（SSG）
- **UI**：React 19（岛屿组件）
- **样式**：Tailwind CSS 3.4（`darkMode: 'class'`）
- **动画**：GSAP + ScrollTrigger、CSS animations
- **滚动**：Lenis 平滑滚动
- **3D/特效**：WebGL（流体模拟）
- **字体**：Instrument Serif（标题）、Outfit（正文）、JetBrains Mono（代码）
