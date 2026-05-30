# 个人作品集博客系统

这是一个基于 React 的个人作品集与博客站点，已经从原始作品集模板扩展为可后台维护、可 Docker 部署的完整版本。它适合用来展示项目、写技术笔记，并通过轻量 Node.js 后端保存后台编辑的数据。

## 主要功能

- 作品集首页：包含个人简介、项目展示、技能、联系入口和响应式导航。
- 技术博客：支持 Markdown、GFM 表格/列表、代码高亮、文章详情页和标签筛选。
- 后台管理：提供 `/admin/login` 和管理面板，可维护站点资料、项目、首页展示、博客文章和 SEO 信息。
- 图片上传：后台文章编辑器支持上传图片，文件保存到 `DATA_DIR/uploads`，文章中自动插入 Markdown 图片语法。
- 富文本预览：后台写作区支持 Markdown 实时预览，前台用统一的 `RichText` 渲染内容。
- 项目管理：项目支持中英文内容、排序、首页展示开关、首屏展示开关、演示链接、源码链接和关联文章。
- 默认数据回退：没有挂载数据或数据文件为空时，会读取 `server/defaults` 里的默认文章、项目和站点配置；挂载目录里有真实数据时，优先读取挂载数据。
- 多语言内容：内置中英文文案结构，站点基础页面、博客列表和项目内容都支持语言切换。
- 视觉组件：新增 `InfiniteMenu`、`TextType`、`GlowCard`、`BorderGlow`、`ChromaGrid` 等动效组件，用于首屏、卡片和联系页协作网络展示。
- Docker 部署：前端构建产物和 Node 后端打包在同一个服务中，支持 `docker compose up -d --build`。

## 技术栈

- React 18
- React Router
- CSS Modules
- Font Awesome
- GSAP
- React Markdown / Remark GFM / Rehype Raw
- React Syntax Highlighter
- Node.js HTTP Server
- Docker / Docker Compose

## 本地开发

安装依赖：

```bash
npm install
```

启动前端开发服务：

```bash
npm start
```

启动后端服务：

```bash
npm run server
```

前端开发服务默认代理到 `http://localhost:8080`，后端需要配置环境变量后才能启动。

## 环境变量

本地创建 `.env` 文件，真实值不要提交到 Git。`.gitignore` 已经忽略 `.env`。

```env
PORT=8080
DATA_DIR=/app/data
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-strong-password
SESSION_SECRET=replace-with-a-random-secret-at-least-32-characters-long
```

说明：

- `ADMIN_PASSWORD` 必填。
- `SESSION_SECRET` 必填，长度至少 32 个字符。
- `DATA_DIR` 是后台数据目录，Docker 中默认是 `/app/data`。
- EmailJS 相关变量仍可按 `.env-example` 配置，用于联系表单发送邮件。

## 后台入口

后台登录地址：

```text
/admin/login
```

后台能力：

- 修改站点名称、简介、头像、社交链接和 SEO。
- 新增、编辑、删除博客文章。
- 上传文章图片并插入正文。
- 新增、编辑、删除项目。
- 调整项目在首页和首屏菜单中的显示顺序。

## 数据目录

运行时数据不会提交到仓库，默认存放在 `data/` 或 Docker 的 `/app/data`。

主要文件：

- `posts.json`：后台文章数据。
- `projects.json`：后台项目数据。
- `site-config.json`：站点配置数据。
- `uploads/`：后台上传图片。

读取优先级：

1. 如果挂载目录中有非空数据文件，读取挂载数据。
2. 如果文件不存在、数组为空或对象为空，读取 `server/defaults` 默认数据。
3. 后台保存后，会写入挂载目录，后续优先使用保存后的数据。

## Docker 部署

构建并启动：

```bash
docker compose up -d --build
```

访问地址：

- 站点首页：`http://localhost:8080`
- 后台登录：`http://localhost:8080/admin/login`
- 博客页：`http://localhost:8080/blog`

`docker-compose.yml` 会把本地 `./data` 挂载到容器 `/app/data`，所以后台编辑内容可以在重建容器后保留。

## 目录结构

```text
public/                 静态资源与默认 Markdown 文章
server/                 Node.js 后端服务
server/defaults/        空数据时使用的默认文章、项目和站点配置
src/components/         页面组件和动效组件
src/context/            全局上下文
src/data/               前端默认配置与多语言文案
src/services/           后台 API 调用与数据服务
src/styles/             CSS Modules 和全局样式
```

## 安全注意事项

- 不要提交 `.env`、`data/`、`build/`、`node_modules/`、`output/`。
- 后台密码和 `SESSION_SECRET` 必须通过环境变量配置。
- 公开部署时建议放在 HTTPS 反向代理后面。
- 需要定期备份 `DATA_DIR`，尤其是 `posts.json`、`projects.json`、`site-config.json` 和 `uploads/`。

## 许可

本项目基于 MIT License。原模板版权归属保留在 `LICENSE` 中。
