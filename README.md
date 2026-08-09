# 数据结构与算法动画

数据结构与算法动画（Data Structures and Algorithms Animation，简称 DSA Animation）是一个无需构建的静态网站。每个算法演示同时展示动画、C/C++ 源码与逐帧讲解。

## 运行

站点文件全部位于 `public/`，开发时可以用任意静态文件服务器直接托管：

```bash
python3 -m http.server 4173 --directory public
```

访问 <http://127.0.0.1:4173/>。算法使用实体目录入口，例如快速排序位于 <http://127.0.0.1:4173/quickSort/>。

部署站点不需要 Node.js、npm、Webpack 或其他构建步骤，也不应将请求回退到首页。

## Nginx 部署

1. 将仓库中的 `public/` 作为 Nginx 文档根目录。
2. 参考 `nginx.conf.example` 修改 `server_name` 和绝对 `root` 路径。
3. 使用 `nginx -t` 检查配置后重载 Nginx。

站点只支持部署在域名根目录。规范算法 URL 带末尾斜杠；旧的 `/#/quickSort` 哈希地址不再兼容。

## 浏览器验收

验收脚本仅使用 Node.js 内置模块和本机 Chromium，不属于部署依赖。先启动静态服务器，再运行：

```bash
node tests/smoke.mjs
```

自定义服务器地址或 Chromium 路径：

```bash
DSA_BASE_URL=http://127.0.0.1:8080 CHROMIUM_BIN=/usr/bin/chromium node tests/smoke.mjs
```

脚本会检查全部 27 个公开演示的资源请求、首末帧渲染、源码高亮、讲解日志、播放状态、跳帧、重置、速度和对话框。

## 维护演示

每个演示长期维护一份实体入口：

```text
public/<algorithm-id>/
├── index.html
├── algorithm.c
├── line.js
├── render.js
└── style.css
```

图片、SVG 和音频等专属素材也放在演示目录内。公共播放器与本地第三方资源位于 `public/assets/`。

旧算法脚本继续提供以下全局接口：

```js
lineExports.init()
render_init()
render(status, duration)
```

添加演示后，需要在 `public/index.html` 中加入静态目录链接，并让完整浏览器验收通过。架构边界和迁移背景见 `docs/` 与 `CONTEXT.md`。

## 浏览器范围

界面面向桌面端，主要设计尺寸为 1920 × 1080，最低支持 1280 × 720。支持仍受维护的 Chrome、Edge、Firefox 和 Safari，不考虑手机端或历史浏览器兼容。

## 本地第三方资源

- D3 v3
- d3-transform
- clone
- Ace（仅保留 C/C++ 模式、Solarized Dark 主题和搜索模块）

项目许可证见 `LICENSE`。
