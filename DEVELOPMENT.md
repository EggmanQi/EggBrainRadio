# EggBrain Radio — 项目说明与开发进度

> 最后更新：2026-10-21
> 仓库：`EggmanQi/EggBrainRadio` · 分支 `main`
> 本地路径：`.../My Blog/EggBrainRadio`

---

## 1. 项目定位

EggBrain Radio 是 Edwin 的独立开发者站点（English-facing），面向海外用户展示 iOS App / 浏览器扩展等独立产品（Work），同时记录 build in public 的过程与思考（Words）。

当前处于**早期骨架阶段**：结构完整、可构建、可部署、可在线写作，但真实内容（产品页、文章）很少。

---

## 2. 技术栈与架构

| 层次 | 选型 | 说明 |
|---|---|---|
| 框架 | Astro ^7.3.2（静态输出） | 无 SSR adapter，构建产物为纯静态 HTML |
| 内容 | Markdown + Content Collections | `src/content/work`、`src/content/words`，Zod schema 校验 |
| 依赖 | `@astrojs/rss`、`@astrojs/sitemap` | RSS 订阅 + sitemap 生成 |
| 部署 | Cloudflare Workers + Assets | `wrangler.toml` 发布 `dist/` 为静态资产 |
| OAuth | `worker/index.js`（Cloudflare Worker） | 处理 Decap CMS 的 GitHub OAuth 回调 `/api/auth` |
| CMS | Decap CMS（自托管 `decap-cms.js`，非 CDN） | 私有在线写作入口 `/admin/` |
| 运行时 | Node ≥ 22.12，ESM | `"type": "module"` |
| 设计 | 手写 CSS，深色主题 | `#0f1412` 背景 + `#7dffb3` 荧光绿，Syne + IBM Plex Sans |

### 数据流（写入路径）

```
/admin (Decap CMS) → GitHub OAuth (/api/auth, Worker 中转)
    → 编辑 Markdown → commit 到 main
    → Cloudflare Git 集成自动执行 npm run build → 重新部署
```

### 站点路由

| 路径 | 内容 |
|---|---|
| `/` | 首页（Hero + 最新 3 条 Work / Words） |
| `/work`、`/work/[slug]` | 项目列表 / 项目详情 |
| `/words`、`/words/[slug]` | 随笔列表 / 文章详情 |
| `/words/feed.xml` | RSS 订阅源 |
| `/tags`、`/tags/[tag]` | 标签总览 / 标签归档（新） |
| `/404` | 404 页（新） |
| `/admin/` | Decap CMS 在线编辑器 |

### 内容模型

- **work**：`title / summary / date / status(shipped·building·archived) / draft / tags / featured / cover / storeUrl / githubUrl / websiteUrl`
- **words**：`title / summary / date / draft / tags`

当前实际内容：2 篇 words + 2 个 work（均为 draft 占位模板，未公开）。

---

## 3. 当前开发进度

以下改动于 **2026-09-29** 执行完毕，`npm run build` 验证通过（11 个页面生成，sitemap 正常输出）。**注意：这些改动目前全部停留在工作区，尚未 commit / push。**

### 3.1 已完成改动

| # | 改动 | 文件 | 状态 |
|---|---|---|---|
| 1 | 删除脚手架残留 `orbital-osiris/` 与废弃 `functions/` 目录 | 目录删除、`.gitignore` | ✅ 完成 |
| 2 | 新增 404 页面（复用 hero 样式） | `src/pages/404.astro` | ✅ 完成 |
| 3 | 接入 `@astrojs/sitemap`，新增 `robots.txt`（Disallow `/admin/`） | `astro.config.mjs`、`public/robots.txt` | ✅ 完成 |
| 4 | 新增标签体系：`/tags/` 总览 + `/tags/[tag]/` 归档（聚合 work + words），文章/项目页 tag 变为可点击链接 | `src/pages/tags/index.astro`、`src/pages/tags/[tag].astro`、`src/pages/words/[slug].astro`、`src/pages/work/[slug].astro` | ✅ 完成 |
| 5 | work collection 新增 `draft` 字段；首页、/work 列表、/work/[slug] 均过滤草稿；Decap CMS 同步增加 Draft 字段与过滤器 | `src/content.config.ts`、`src/pages/index.astro`、`src/pages/work/index.astro`、`src/pages/work/[slug].astro`、`public/admin/config.yml` | ✅ 完成 |
| 6 | 两个 sample 占位页标记 `draft: true`，从公开站点下线（构建产物中 `/work/` 仅剩 index，无 sample 子页） | `src/content/work/sample-ios-app.md`、`sample-browser-extension.md` | ✅ 完成 |
| 7 | 安装 `@astrojs/sitemap ^3.7.4` | `package.json`、`package-lock.json` | ✅ 完成 |

### 3.2 验证记录

- `npm run build` 通过，输出 11 个静态页面（含 `/404.html`、`/tags/*`、sitemap）
- 构建产物确认：`dist/work/` 下无 sample 子页（草稿过滤生效）
- `dist/sitemap-index.xml`、`dist/sitemap-0.xml`、`dist/robots.txt` 均正常生成

### 3.3 Git 状态（重要）

当前 `git status` 显示以上改动 **均未提交**（8 个 M + 1 个 D + 3 个新增路径）。建议下一步：`git add -A && git commit`（可拆分为「chore: cleanup + seo + tags」等提交），确认无误后 push 触发线上重建。

---

## 4. 遗留未处理项

| # | 优先级 | 事项 | 说明 | 风险 | 收益 | 需要的输入 |
|---|---|---|---|---|---|---|
| A1 | 🔴 高 | **域名配置对齐** | `astro.config.mjs` 的 `site` 为 `https://eggbrainradio.com`，但 Decap `base_url` 与当前部署实际指向 `eggbrainradio.eggmanqi.workers.dev`；robots.txt / canonical / RSS / OG 均受影响 | 自定义域名未在 Cloudflare 配好路由则线上 404；改回 workers.dev 需同步 OAuth App 回调 | 所有对外链接与 SEO 信号统一 | 确认 eggbrainradio.com 是否已在 Cloudflare 绑定；或授权改回 workers.dev |
| A2 | 🔴 高 | **提交并推送当前改动** | 3.1 全部改动未 commit，未触发线上重建 | 改动滞留本地，若环境丢失则白做 | 上线全部改进 | 无（确认提交即可） |
| A3 | 🟡 中 | **替换 Work 占位内容** | 两个 sample 页是模板，需替换为真实产品并去掉 `draft: true` | 低（纯内容） | 首屏展示真实产品 | 真实产品信息（名称、简介、商店链接、日期） |
| A4 | 🟡 中 | **补全站点元信息** | `src/consts.ts` 中 `email: ''` 与 `social.x: ''` 为空 | 无 | footer 联系渠道完整 | 真实邮箱 / X(Twitter) 链接 |
| A5 | 🟡 中 | **OAuth origin 安全加固** | `worker/index.js` 中 `postMessage('*')`（第 98、103 行）未限定 origin | origin 判断写错会使 /admin 登录卡死，需本地 + 生产实测 | 防止恶意页面冒充 Decap 接收 GitHub token | 在 `npm run cms` 本地流程实测通过后修改 |
| A6 | 🟡 中 | **隐私政策 / 支持页** | 浏览器扩展上架审核需要隐私政策链接（sample 页自身也标注了此 TODO） | 无 | 满足 Chrome/Safari/App Store 审核要求 | 真实隐私政策内容（或授权模板 + 占位） |
| A7 | 🟢 低 | **导航加入 Tags 入口** | 标签归档页已上线，但 `consts.ts` 的 `nav` 尚无 Tags 链接 | 无 | 标签页可被发现 | 无（确认即可加） |
| A8 | 🟢 低 | **CSS tag hover 微调** | 上一轮有意跳过的非关键样式调整（`.tag` 链接化后的 hover 视觉） | 无 | 视觉一致性 | 无 |

---

## 5. 部署与运维备忘

- 部署方式：**Workers + Assets**（非 Pages Functions），`wrangler.toml` 配置 `run_worker_first = ["/api/*"]`
- 生产写作：GitHub OAuth App（Homepage / Callback 指向站点域名的 `/api/auth`），secrets 存 Cloudflare（`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`）
- 本地写作：取消注释 `config.yml` 中 `local_backend: true`，双终端跑 `npm run dev` + `npm run cms`，**上线前必须注释回去**
- 内容更新：保存即 commit 到 `main`，Cloudflare 自动重建；`draft: true` 的文章不进公开列表与 RSS
- 常用命令：`npm run dev` / `npm run build` / `npm run preview` / `npm run cms`
