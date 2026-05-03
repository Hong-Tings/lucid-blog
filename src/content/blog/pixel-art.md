---
title: '像素画入门'
description: '用代码生成像素画，一种复古又现代的创作方式'
date: 2026-04-26
category: '创作'
tags: ['像素画', '创意编程', 'Canvas']
---

## 像素的魅力

在 4K 屏幕横行的今天，像素画（Pixel Art）反而越来越流行。

这是一种矛盾的美——用最少的信息量，传达最丰富的情感。每一个像素都经过精心选择，没有冗余，没有模糊。

就像写代码，每一行都应该有意义。

## 用 Canvas 画像素

作为一个前端开发者，我自然选择用代码来创作像素画。HTML5 Canvas 是最直接的工具：

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const PIXEL_SIZE = 8;

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
}
```

简单几行代码，就能开始创作了。

## 调色板的选择

像素画的调色板非常重要。受限的颜色数量反而能创造出独特的风格。

我常用的几个调色板：

- **PICO-8**：16 色，复古游戏风格
- **Endesga 32**：32 色，色彩丰富但不杂乱
- **Lospec500**：更多选择，适合复杂场景

```javascript
const PICO8_PALETTE = [
  '#000000', '#1D2B53', '#7E2553', '#008751',
  '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
  '#FF004D', '#FFA300', '#FFEC27', '#00E436',
  '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA',
];
```

## 创作过程

我创作了一幅程序员的像素肖像：

1. **草稿阶段**：用单色勾勒轮廓
2. **上色**：从大色块开始，逐步细化
3. **细节**：添加高光和阴影
4. **动画**：给角色加上简单的帧动画

整个过程和写代码很像——先搭建骨架，再填充逻辑，最后优化细节。

## 生成式像素画

更有趣的是**用算法生成**像素画。我写了一个小程序，可以根据音乐的频率生成不同的像素图案：

```javascript
function generateFromAudio(audioData) {
  const pixels = [];
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const index = y * WIDTH + x;
      const value = audioData[index % audioData.length];
      const colorIndex = Math.floor(value * PICO8_PALETTE.length);
      pixels.push({ x, y, color: PICO8_PALETTE[colorIndex] });
    }
  }
  return pixels;
}
```

每次播放不同的音乐，生成的图案都不同。这让我觉得代码也可以是一种艺术媒介。

## 为什么喜欢像素画

1. **约束产生创造力**：有限的像素和颜色迫使你做出选择
2. **精确到像素**：没有模糊地带，每一个决定都是明确的
3. **怀旧感**：小时候的红白机游戏，就是这种质感
4. **代码友好**：像素画天然是数字化的，非常适合用代码创作

## 工具推荐

如果你想入门像素画：

- **Aseprite**：最强像素画工具，付费但值得
- **Piskel**：免费在线工具，适合入门
- **代码生成**：Canvas + JavaScript，最自由

---

*写于一个用代码画了一下午像素画的周末。*
