---
title: 技术栈清单
date: "2026-05-28"
description: 轻量记录公开项目里的 TypeScript、Vue、JavaScript、Python、Java、CSS 和 Docker。
---

# 技术栈清单

这篇笔记记录 `Featured Project` 和当前个人站点的公开技术栈。

## Featured Project

仓库主要由 TypeScript 和 Vue 构成，并包含 JavaScript、Python、Java、CSS、HTML 和 Docker。

这个结构说明项目既有前端产品实现，也有一些配套服务、脚本或部署层内容。

```text
主要：TypeScript, Vue
辅助：JavaScript, Python, Java
界面：CSS, HTML
运行：Docker
```

## 个人博客

当前个人站点使用 React、React Router、CSS Modules、Markdown 文件和黑白视觉系统。

第一版刻意保持简单：

- 个人信息和项目链接放在数据文件里。
- 文章以 Markdown 文件形式放在 `public/posts` 下。
- 项目卡片直接连接在线体验和源码仓库。
- 视觉上保持黑白编辑感。

## 维护记录

当前模板基于 Create React App。它可以运行，但依赖链偏旧。正式公开部署前，可以考虑做依赖清理，或迁移到 Vite / Next.js。
