# 静态站迁移实施基线

状态：已完成（2026-08-09）

本文件记录 DSA Animation 从 Vue 2 + Webpack 2 项目迁移为无构建静态站的实施边界。领域语言见 [`CONTEXT.md`](../CONTEXT.md)，长期架构决定见 [`docs/adr/`](./adr/)。

## 完成结果

- `public/` 已成为唯一部署源，共发布 27 个实体演示入口。
- `maze_dfs3` 因脚本语法损坏、算法实现不一致而未发布。
- `lca-rmq` 因帧生成过程稳定崩溃且无法由现有材料确定修复意图而未发布。
- Vue、Vue Router、Webpack、Babel、jQuery、旧构建产物和重复演示目录已从工作树移除。
- `tests/smoke.mjs` 覆盖所有公开演示的真实浏览器验收。

## 目标

- 仓库检出后无需 Node、npm、Webpack 或其他构建步骤，Nginx 可以直接托管 `public/`。
- 移除 Vue、Vue Router、Webpack、Babel、jQuery 和所有 CDN 依赖。
- 保留现有且可用的算法演示，不在本次迁移中补写缺失算法或重写算法逻辑。
- 新界面尽量保持原有布局和工作流，同时修复明确的可用性问题。

## 非目标

- 不支持手机端。
- 不支持 IE、旧版 Edge 或其他已停止维护的浏览器。
- 不支持部署到 URL 子目录。
- 不兼容 `/#/quickSort` 等旧哈希 URL。
- 不统一或重命名既有算法标识。
- 不把每个算法的 `line.js` 和 `render.js` 改写为 ES Modules。

## 目标结构

```text
repository/
├── public/                         # Nginx document root
│   ├── index.html                  # 直接维护的算法目录
│   ├── favicon.png
│   ├── assets/
│   │   ├── css/                    # 公共布局与播放器样式
│   │   ├── fonts/
│   │   ├── js/                     # 公共原生播放器
│   │   └── vendor/                 # 本地第三方库
│   ├── quickSort/
│   │   ├── index.html
│   │   ├── algorithm.c
│   │   ├── line.js
│   │   ├── render.js
│   │   └── style.css
│   └── ...
├── tests/                          # 不对外托管
├── docs/
├── CONTEXT.md
└── nginx.conf.example
```

每个演示拥有自己的入口、源码、帧数据、渲染逻辑、专属样式和媒体。公共播放器、页面布局、字体和第三方库统一存放在 `/assets/`。

## URL 与导航

- 站点只部署在域名根目录。
- 每个演示使用实体目录和目录索引，规范 URL 带末尾斜杠，例如 `/quickSort/`。
- Nginx 不配置 SPA 回退；不存在的页面返回真实 `404`。
- 算法标识原样保留并区分大小写，例如 `quickSort`、`Golden_Spiral`、`LIS`、`01Knapsack`。
- 首页链接在新标签页打开；演示页不提供返回首页按钮。
- 首页算法目录直接写入静态 `index.html`，不再读取 `categories.txt`。

## 客户端边界

- 支持仍受维护的 Chrome、Edge、Firefox 和 Safari。
- 公共代码可以直接使用 ES Modules、`fetch` 和 `async` 函数。
- 页面以简体中文为主，HTML 使用 `lang="zh-CN"`；通用算法名称和缩写保留原名。
- 正式名称为“数据结构与算法动画”，英文为“Data Structures and Algorithms Animation”，简称“DSA Animation”。
- 以 1920 x 1080 为主要设计尺寸，1280 x 720 为最低支持尺寸。

## 运行时边界

公共播放器适配现有算法脚本的全局接口：

```js
lineExports.init()
render_init()
render(frame.status, duration)
```

算法脚本保持经典脚本形式，只修改资源路径、加载兼容问题和已经确认的阻塞性缺陷。共享播放器使用现代原生 JavaScript，不通过 Vue 事件总线或动态路由协调状态。

## 播放器行为

- 桌面端继续采用动画与源码并排、日志位于动画下方、速度栏在顶部、播放栏在底部的总体布局。
- 顶部速度格改为速度滑块，越向右越快；范围约为每帧 2500 ms 到 500 ms。
- 底部帧格改为帧滑块，并显示当前帧和总帧数。
- 保留播放、暂停、重置、上一帧、下一帧、加速和减速命令。
- 播放时跳帧会先暂停，再移动到目标帧；播放时可以实时调整速度。
- 重置始终暂停播放、返回第 1 帧、清空日志并重新渲染初始状态。
- 位于最后一帧时再次播放，会从第 1 帧重新开始。
- 日志区展示从第 1 帧到当前帧的全部非空讲解；跳帧时重新计算，不能重复追加。
- 帮助和关于内容保留，使用原生 `<dialog>`，不再依赖 jquery.popdown。

## 第三方资源

保留并本地托管：

- D3
- `d3-transform`
- `clone`
- Ace

Ace 只保留 `ace.js`、C/C++ 模式、Solarized Dark 主题和搜索模块，并关闭不需要的 worker。删除 Vue、Vue Router、jQuery、jquery.popdown、Lodash、string-format、无关 Ace 模式和字体演示文件。

## 内容准入

首页只收录通过验证的 Available Demonstration。当前磁盘上的真实演示目录是候选集，不等同于最终可用集。

- 路径、加载顺序和公共播放器兼容问题在迁移中修复。
- 能明确判断意图的简单历史缺陷可以修复并记录。
- 算法逻辑缺失、正确性无法确认或需要重写的演示不进入首页。
- `m` 建设中占位目录、`template` 和不存在的目录不迁移为公开演示。
- 修正线段树单点更新等能够由现有目录明确判定的错误链接。

## 实施阶段

1. 建立 `public/`、公共静态页面、共享播放器和本地依赖。
2. 迁移 `quickSort`，锁定演示入口和旧运行时适配接口。
3. 迁移 `segment_tree_build`、`4queen1`、`lifeGame`，分别验证 SVG、图片和音频资源。
4. 批量迁移其余候选演示，并逐个执行浏览器冒烟检查。
5. 根据检查结果生成最终静态首页。
6. 全部验收通过后删除旧 Vue/Webpack 工程和重复演示目录。

## 验收

每个公开演示必须通过自动化浏览器冒烟检查：

- 页面、公共资源、源码和演示专属资源均加载成功。
- `lineExports.init()` 至少生成一帧。
- 第一帧和最后一帧可以渲染且不抛出 JavaScript 错误。
- 播放、暂停、跳帧、重置和速度调整符合已确认的状态规则。
- 源码可见，当前帧对应的源码行能够高亮。
- 日志内容与当前帧一致。
- 网络请求不包含 CDN、`/dist/` 或 `/dsa/` 旧路径。

另外在 1920 x 1080 和 1280 x 720 检查首页及代表性演示，确认内容不重叠、控制栏不移位、动画和源码区域可用。测试代码放在 `public/` 外，不参与部署，也不成为站点构建依赖。

## Nginx 与缓存

仓库提供 `nginx.conf.example`，覆盖以下约束：

- `public/` 是文档根目录，启用标准目录索引。
- 不存在的资源和演示返回 `404`，不回退到首页。
- 为 JavaScript、CSS、字体、媒体和 `.c` 源码设置正确 MIME 类型。
- HTML、JavaScript、CSS 和 `.c` 文件使用 `Cache-Control: no-cache`，通过 ETag 或 Last-Modified 重新验证。
- 字体、图片和音频可以短期缓存 7 天。
- 对适合的文本资源启用压缩。

## 最终清理

迁移验收通过后，删除旧 `src/`、`dist/`、`dsa/`、`pages/`、Webpack/Babel/npm 配置、旧配置文件、占位内容、无用压缩包和不再引用的静态资源。README 改为直接托管 `public/` 的开发与部署说明；历史实现通过 Git 保留，不在工作树中维护第二份副本。
