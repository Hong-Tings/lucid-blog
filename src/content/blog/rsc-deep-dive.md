---
title: 'React Server Components 深度解析'
description: '从原理到实践，全面理解 RSC 的工作机制和最佳实践'
date: 2026-04-20
category: '技术'
tags: ['React', 'RSC', '前端', '性能优化']
---

## 什么是 RSC

React Server Components（RSC）是 React 团队提出的一种新的组件模型，它允许组件在服务端渲染，并且**只在服务端运行**。

这意味着：

- 服务端组件可以直接访问数据库、文件系统
- 服务端组件不会被打包到客户端 bundle 中
- 客户端组件通过 `"use client"` 指令声明

## 核心概念

### 服务端组件 vs 客户端组件

```tsx
// 服务端组件（默认）
async function BlogPost({ id }: { id: string }) {
  const post = await db.posts.findUnique({ where: { id } });
  return <article>{post.content}</article>;
}

// 客户端组件
'use client';
function LikeButton({ count }: { count: number }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? '❤️' : '🤍'}</button>;
}
```

### 序列化边界

服务端组件和客户端组件之间存在一个**序列化边界**。服务端组件可以将客户端组件作为 children 传递，但不能传递函数。

```tsx
// ✅ 正确
<ClientComponent>
  <ServerComponent />
</ClientComponent>

// ❌ 错误：函数无法序列化
<ClientComponent onClick={() => console.log('hi')} />
```

## 性能优势

RSC 的性能优势主要体现在：

1. **更小的客户端 bundle**：服务端组件的代码不会发送到客户端
2. **更快的首屏渲染**：服务端直接渲染，无需等待 JS 下载和执行
3. **更好的数据获取**：避免了客户端-服务端的数据往返

## 实际应用

在 Next.js 13+ 中，RSC 已经成为默认模式。App Router 下的所有组件都是服务端组件，除非你用 `"use client"` 显式声明。

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return (
    <main>
      <h1>{post.title}</h1>
      <MDXContent content={post.content} />
      <ShareButtons /> {/* 客户端组件 */}
    </main>
  );
}
```

## 总结

RSC 不是银弹，但它确实解决了 React 应用中一些长期存在的问题。理解它的原理和限制，能帮助我们写出更好的 React 应用。
