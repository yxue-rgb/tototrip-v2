# TotoTrip Sprint Status

## ✅ Sprint v3.9 — Map Location Bug Fix（已完成）

### 完成时间: 2026-03-09 12:15 UTC

### Bug 描述
地图不显示地点标记。`🗺️ LOCATIONS RECEIVED` 从未触发。

### 根因分析

系统有**两条并行路径**将 locations 送达地图：

1. **Path A — 后端 SSE 事件**：`route.ts` 在流结束后从 `fullText` 中提取 `<LOCATION_DATA>`，发送 `data: {"locations": [...]}` SSE 事件。前端 `page.tsx` 监听 `parsed.locations` 并设置 `msg.locations`。
2. **Path B — 客户端文本解析**：`MessageList.tsx` 调用 `parseLocationsFromMessage(msg.content)` 从消息文本中解析 `<LOCATION_DATA>`，渲染 `LocationsGrid` 卡片。

**地图的 `allLocations` state（`useEffect`）只使用了 Path A（`msg.locations`）**，完全忽略了 Path B。

当 SSE locations 事件因网络分块、Gemini 响应格式异常、或 JSON 解析失败等原因未送达时，`msg.locations` 为 `undefined`，地图永远空白。而 `LocationsGrid` 卡片可能正常显示（因为它走 Path B 客户端解析）。

### 修复方案

**`app/chat/[id]/page.tsx`** — 双源合并策略：

`useEffect([messages])` 中的 `allLocations` 提取逻辑现在同时使用两个数据源：
- **Source 1**: `msg.locations`（来自 SSE 事件，服务端解析）
- **Source 2**: `parseLocationsFromMessage(msg.content)`（客户端从消息文本解析）

两个源的结果用 `seenIds` 去重合并。即使 SSE 事件丢失，客户端解析仍能可靠地将 locations 送达地图。

同时添加了智能 `flyToTrigger`：当检测到新 location ID（之前不在 `allLocations` 中的）时自动触发地图飞行。

### ITINERARY_DATA 检查（T4）
- `<ITINERARY_DATA>` 不存在同样的问题
- 后端从未提取/发送 itinerary SSE 事件——itinerary 100% 由客户端 `parseItineraryFromMessage()` 在 `MessageList.tsx` 中解析
- `<PLACE_DATA>` 同理，100% 客户端解析
- 只有 `<LOCATION_DATA>` 有双路径不一致问题，已修复

### 修改文件
- `app/chat/[id]/page.tsx` — 添加 `parseLocationsFromMessage` import + 双源合并 useEffect + 智能 flyToTrigger

### Build 状态
- ✅ `npx next build` — 零错误通过

---

## ✅ Sprint v3.8 — Lighthouse Performance Optimization（已完成）

### 完成时间: 2026-03-09 11:43 UTC

### 完成任务

**T1: Bundle Size 分析 + 优化** ✅
- `next.config.mjs` 添加 `experimental.optimizePackageImports` for `lucide-react`, `framer-motion`, `react-leaflet` — tree-shake barrel exports
- `react-markdown` 在 MessageList 中改为 `dynamic(() => import("react-markdown"))` 延迟加载（~60KB gzipped 从初始 bundle 移除）
- 主要大依赖：framer-motion（已 tree-shakeable）、leaflet/react-leaflet（已 dynamic import ssr:false）、react-markdown（现已 lazy）
- AI SDK（openai, groq-sdk, anthropic-ai）只在 API route server-side 使用，不影响 client bundle

**T2: 图片优化** ✅ — 总共节省 ~2.5MB
- `foodie_toto.png`: 757KB → 154KB（resize 3665px → 512px）
- `family_toto.png`: 746KB → 193KB（resize 2317px → 400px）
- `pool_toto.png`: 547KB → 106KB（resize 4145px → 512px）
- `party_toto.png`: 536KB → 93KB（resize 5177px → 512px）
- `nature_toto.png`: 332KB → 119KB（resize 2610px → 512px）
- 所有品牌图片保持 PNG 格式不变，视觉品质无损

**T3: Critical CSS + Font Loading** ✅ — 总共节省 ~2.3MB 字体大小
- 所有 `@font-face` 已使用 `font-display: swap` ✅
- **字体格式升级**: 将 OTF/TTF 转换为 WOFF2（Brotli 压缩）
  - `MetamorBitVF.ttf` 2.0MB → `MetamorBitVF.woff2` 191KB（-90%）
  - `Amelie-Fierce-Regular.otf` 228KB → `woff2` 74KB（-68%）
  - `GraphikArabic-Light.otf` 202KB → `woff2` 81KB（-60%）
  - `GraphikArabic-Semibold.otf` 208KB → `woff2` 84KB（-60%）
- CSS `@font-face` 更新为 woff2 优先 + OTF/TTF fallback
- `layout.tsx` 添加 `<link rel="preload">` 预加载关键字体（Graphik-Light, Amelie-Fierce）
- Tailwind content 配置正确，已覆盖 `pages/`, `components/`, `app/`, `src/` ✅
- Google Font (`Plus Jakarta Sans`) 已用 `next/font` + `display: "swap"` ✅

**T4: Code Splitting 验证** ✅
- `MapPanel`: 已在 `chat/[id]/page.tsx` 用 `dynamic()` + `ssr: false` 加载 ✅
- `LocationMap`: 在 `trips/[id]/page.tsx` 和 `trips/shared/page.tsx` 均已 `dynamic()` ✅
- `react-leaflet` 组件 (MapContainer, TileLayer, Marker, Popup, Polyline): 均已 `dynamic()` + `ssr: false` ✅
- `ItineraryTimeline`, `PlaceCardsGrid`, `SaveTripButton`: 均已在 MessageList 中 `dynamic()` 延迟加载 ✅
- `react-markdown`: 现已改为 `dynamic()` 延迟加载（之前是 static import）

**T5: Lighthouse 优化预期效果**

| 指标 | 预期提升 | 原因 |
|------|----------|------|
| LCP (Largest Contentful Paint) | -1~2s | 字体文件 -2.3MB，图片 -2.5MB |
| FCP (First Contentful Paint) | -0.5~1s | font-display:swap + woff2 + font preload |
| TBT (Total Blocking Time) | -50~100ms | optimizePackageImports tree-shaking |
| CLS (Cumulative Layout Shift) | 无变化 | 已有 font-display:swap |
| 总 Performance Score | +5~15分 | 综合资产优化 |

### 需要线上环境验证的优化
- `compress: true` 效果需要实际 gzip/brotli 传输验证
- font preload 的实际网络瀑布效果
- Vercel Edge 的自动图片优化（next/image 在 CDN 层）
- HTTP/2 push 和 cache 策略的实际生效情况

### Build 状态
- ✅ `npx next build` 零错误通过
- Turbopack 编译 4.2s
- 43 个静态页面生成成功

## ✅ Sprint v3.7 — Dependency Cleanup + Landing Page Polish（已完成）

### 完成时间: 2026-03-09 11:15 UTC

### 完成任务

**T1: 移除未使用依赖** ✅
- grep 确认 `@radix-ui/react-accordion`、`@radix-ui/react-avatar`、`@radix-ui/react-dropdown-menu`、`zustand` 在代码中无任何 import
- 从 `package.json` 中移除，pnpm lockfile 确认这些包从未实际安装（只存在于 package.json）
- Build 通过，零错误

**T2: Landing Page CTA 优化（Reddit 流量准备）** ✅
- Hero 主标语更新："Plan your China trip with AI — in minutes"（zh: "用 AI 规划你的中国之旅 — 几分钟搞定"）
- Hero 副标语更聚焦痛点："Payments, trains, VPN, food, language — the stuff that actually trips up foreigners in China. Toto handles it all."
- CTA 按钮统一改为 "Start Planning Free"（nav + hero + 底部 CTA 全部同步）
- Section 顺序调整：Hero → Trust Badges → Destinations → **Why TotoTrip → How It Works → Social Proof** → CTA
  - 原来 Social Proof 在 Why TotoTrip 之前，现在移到 How It Works 之后
  - 逻辑递进：引起兴趣（Hero）→ 展示目的地 → 解释痛点（Why）→ 展示方案（How）→ 社会证明 → 行动召唤
- i18n en + zh 均已更新

**T3: Share/OG Preview 优化** ✅
- `app/opengraph-image.tsx`：副标语改为 "Plan Your China Trip with AI — in Minutes"，底部 tagline 改为 "Payments · Trains · VPN · Food · Language — Free for Foreigners"
- `app/layout.tsx` metadata 更新：
  - title: "toto — Plan Your China Trip with AI in Minutes"
  - description 加入关键词：AI trip planner, foreigners, WeChat Pay, VPN, itineraries
  - OpenGraph + Twitter card 同步更新
  - `metadataBase` 已设置为 `https://tototrip.com` ✅

**T4: Favicon + PWA Icons 检查** ✅
- 生成 `public/favicon.ico`（16x16, 32x32, 48x48 多尺寸）从现有 `favicon.png`
- `app/layout.tsx` 新增 `icons` metadata 配置：favicon.ico + favicon.png + apple-touch-icon
- apple-touch-icon 指向 `public/brand/window_toto_square.png` ✅
- PWA icons 已存在：`public/icons/icon-192.png`, `icon-512.png` + SVG 版本 ✅

### Build 状态
- `npx next build` ✅ 零错误，43 页面全部生成

---

## ✅ Sprint v3.6 — Analytics + Event Tracking Foundation（已完成）

### 完成时间: 2026-03-09 11:10 UTC

### 完成任务

**T1: Analytics Provider 组件** ✅
- 创建 `components/Analytics.tsx`：client component，使用 `next/script` 注入 Plausible
- 环境变量 `NEXT_PUBLIC_ANALYTICS_ID` 控制开关：有 ID 才加载，否则零开销
- 集成 GDPR consent 检查：只有 `tototrip_cookie_consent === 'accepted'` 才注入 script
- 监听 `storage` 事件 + 自定义 `tototrip_consent_change` 事件实现实时响应
- 已在 `app/layout.tsx` 的 `<head>` 中引入

**T2: Custom Event Tracking Utility** ✅
- 创建 `lib/analytics.ts`：`trackEvent(name, props?)` 工具函数
- 5 个关键位置已集成：
  1. `app/chat/[id]/page.tsx` → `trackEvent('chat_message_sent')` — 用户发送消息时
  2. `app/chat/components/SaveTripButton.tsx` → `trackEvent('trip_saved')` — 保存行程时
  3. `app/page.tsx` → `trackEvent('cta_start_planning')` — 点击 Start Planning CTA
  4. `app/inspiration/page.tsx` → `trackEvent('template_used', { template: name })` — 使用模板
  5. `components/FeedbackWidget.tsx` → `trackEvent('feedback_submitted', { type })` — 提交反馈

**T3: Cookie Consent Banner（GDPR）** ✅
- 创建 `components/CookieConsent.tsx`：底部固定 banner，品牌色系（deep green + mint）
- Accept → `localStorage tototrip_cookie_consent = 'accepted'`，隐藏 banner，加载 analytics
- Decline → `localStorage tototrip_cookie_consent = 'declined'`，隐藏 banner，不加载 analytics
- 已选择过不再显示
- i18n 支持（en + zh）
- 深色模式支持
- framer-motion 进出动画
- 已在 `app/layout.tsx` 引入

### 新增文件
- `lib/analytics.ts` — trackEvent 工具函数
- `components/Analytics.tsx` — Plausible script 注入（consent-aware）
- `components/CookieConsent.tsx` — GDPR cookie consent banner

### 修改文件
- `app/layout.tsx` — 引入 Analytics + CookieConsent
- `app/chat/[id]/page.tsx` — trackEvent('chat_message_sent')
- `app/chat/components/SaveTripButton.tsx` — trackEvent('trip_saved')
- `app/page.tsx` — trackEvent('cta_start_planning')
- `app/inspiration/page.tsx` — trackEvent('template_used')
- `components/FeedbackWidget.tsx` — trackEvent('feedback_submitted')

### Build & Deploy
- ✅ `npx next build` — 零错误，43 页面全部成功生成
- 📌 未部署（由主 agent 统一管理）

---

## ✅ Sprint v3.5 — Mobile UX + Edge Case Testing（已完成）

### 完成时间: 2026-03-09 11:00 UTC

### 完成任务

**T1: Edge Case 修复** ✅
- **API 空响应 fallback**: Gemini 返回空内容时，stream 发送友好 fallback 消息而非空白
- **Stream 断开保护**: ReadableStream 添加 `cancel()` handler + `streamClosed` flag 防止 double-close；streaming error 时发送 graceful 错误消息而非 500 crash
- **localStorage 满保护**: `saveTrip()` 添加二级 fallback — 先尝试删除旧行程腾空间，仍失败则抛出用户友好错误消息；`deleteSavedTrip()` 写入失败时清除 key 防止数据损坏
- **Malformed JSON fallback**: `parsePlaces.ts` / `parseItinerary.ts` / `parseLocations.ts` 已有 JSON5 + try/catch，验证通过 ✅

**T2: Chat Token Limit Protection** ✅
- 添加 sliding window：发送给 Gemini 的消息历史限制为最近 **20 条**
- 防止长对话导致 token 超限、API 报错或费用爆炸
- 变量 `MAX_HISTORY_MESSAGES = 20`，`trimmedMessages` 传入 provider

**T3: Meta Tags & OG Cards 验证** ✅
- `app/layout.tsx`: title/description/OG/Twitter 完整 ✅
- `app/opengraph-image.tsx`: Edge runtime 品牌 OG 图片生成正常 ✅
- `app/destinations/[city]/layout.tsx`: 每个城市独立 title + description + OG image（使用城市 hero 图） ✅
- `app/sitemap.ts`: 包含首页 + toolkit + inspiration + guides + 所有城市页 + about/faq/privacy/terms/auth ✅

**T4: Console 清理** ✅
- 移除 3 处开发调试 `console.log`：
  - `lib/parsePlaces.ts`: "⚠️ Skipping incomplete/malformed PLACE_DATA"
  - `lib/parseLocations.ts`: "✅ Successfully parsed X locations" + "⚠️ Skipping incomplete/malformed JSON block"
  - `lib/parseItinerary.ts`: "⚠️ Skipping incomplete/malformed ITINERARY_DATA"
- 保留所有 API 路由和 AuthContext 的 `console.error`（运行时错误诊断用）
- 保留 `lib/supabase.ts` 的 startup `console.warn`/`console.info`（配置诊断用）

### Build & Deploy
- ✅ `npx next build` — 零错误，43 页面全部成功生成
- 📌 未部署（由主 agent 统一管理）

---

## ✅ Sprint v3.4 — Production Hardening Phase 2（已完成）

### 完成时间: 2026-03-09 10:55 UTC

### 完成任务

**T1: API Rate Limiting** ✅
- 升级 rate limiting 策略：从 20 req/min → **30 req/hour**（IP 维度）
- `checkRateLimit()` 返回结构化数据（`allowed`, `remaining`, `resetAt`）
- 429 响应包含 `Retry-After` header + JSON 友好错误消息
- Chat page 处理 429 响应，显示 i18n 友好提示 + 剩余等待时间
- 新增 i18n keys: `chat.errorRateLimit`（en + zh）

**T2: Request Validation** ✅
- `validateMessages()` 函数校验请求体：
  - `messages` 必须为非空数组
  - 每条 message 必须有 `role`（user/assistant/system）和 `content`（非空 string）
  - 单条消息上限 2000 字符，超限返回具体错误信息
- 返回 400 + `validation_error` JSON 错误

**T3: Security Headers** ✅
- `next.config.mjs` 添加 5 项安全 headers（所有路由生效）：
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**T4: Performance Audit** ✅
- 审查所有 `next/image` 用法：全部 `fill` 图片已有 `sizes` 属性 ✅
- 非首屏图片已有 `loading="lazy"` ✅
- Hero/关键图片已有 `priority` ✅
- `'use client'` 审查：所有标记均因 hooks/framer-motion 合理存在，无可移除项 ✅

### Build & Deploy
- ✅ `npx next build` — 零错误
- 📌 未部署（由主 agent 统一管理）

---

## ✅ Sprint v3.0 — Map & PlaceCard MindTrip 级升级（已完成）

### 完成时间: 2026-03-09 09:15 UTC

### 完成任务

**A. MapPanel.tsx 完全重写** ✅
- CircleMarker → Marker + divIcon（品牌色 SVG pin + Day 分色 + 类型 emoji + 编号角标）
- 富详情弹窗：照片/评分/描述/地址/价格/时长/标签 + View Details & Save 按钮
- Day 过滤器 pills（All / Day 1 / Day 2 / ...）
- 按天着色 dashed polyline 路线连线
- 深色模式 + 移动端适配（260px/290px responsive popup）

**B. PlaceCard.tsx 升级** ✅
- 水平布局：左文字(60%) + 右图片(40%)，移动端竖排
- ImageCarousel 组件：多图轮播 + 左右箭头 + 圆点指示
- 展开详情面板（address/duration/bestTime/tags）
- View Details → 地图 flyTo + popup 自动打开联动

**C. Chat Page 联动增强** ✅
- `selectedLocationId` state 联动 MapPanel
- PlaceCard View Details → flyTo zoom 14 + 1.3s 后打开 popup
- onSaveLocation / onViewDetails callback 完整接线

**D. System Prompt 升级** ✅
- PLACE_DATA 格式扩展：images/address/duration/bestTime/tags/latitude/longitude
- AI 输出更丰富的地点数据

**E. Auth 修复** ✅
- Supabase 域名无法解析（`lbhvrjpmroujdpnaoshu.supabase.co` → DNS failure）
- 临时方案：`isSupabaseEnabled = false` + 隐藏 Login 按钮
- 首页 "Start Planning" CTA 替代 Login/Get Started
- 全功能 guest 模式可用（chat/trips/share 均用 localStorage）

### Build & Deploy
- ✅ `npx next build` — 零错误零警告
- ✅ `zeabur deploy` — 成功部署到 https://tototrip.zeabur.app

---

## ✅ Sprint v2.4 — Chat 体验升级（已完成）

### 完成时间: 2026-03-09 08:32 UTC

### 审查结果

Chat 核心体验已在前序 Sprint 中实现到位。本次验证并微调：

### 完成项

**A. AI 消息头像** ✅（已有）
- Toto 头像（`/brand/totos/plain_toto.png`）：32px 圆形，`ring-2` 边框，深色模式兼容
- 用户头像：28px 圆形 User icon，品牌色背景

**B. 消息气泡视觉区分** ✅（微调）
- AI 消息：左对齐，`bg-white border` / `dark:bg-[#0d2a1f]`，带 Toto 头像
- 用户消息：右对齐，`bg-[#083022] text-white`（从 `#1a4a3a` 更新为品牌主色 `#083022`）
- 用户头像背景同步更新为 `bg-[#083022]`
- Markdown 渲染完整保留（react-markdown + remarkGfm）

**C. 相对时间戳** ✅（已有）
- `formatRelativeTime(ts)` 工具函数：`just now` / `Xm ago` / `Xh ago` / 回退到 HH:MM
- 时间戳显示在气泡右下角，半透明文字

**D. 额外已有功能** ✅
- 长消息折叠（>800字符 Show More/Less）
- AI 消息复制按钮（hover 显示）
- 打字指示器（Toto 头像 + 弹跳圆点动画）
- 完整 i18n 支持

### 部署状态
- ✅ `npx next build` — 零错误
- ✅ `zeabur deploy` — 成功部署到 https://tototrip.zeabur.app

---

## ✅ Sprint v2.3 — 性能 + 移动端 + a11y 快修（已完成）

### 完成时间: 2026-03-09 08:28 UTC

### 审查结果

代码质量已经很高，大部分 checklist 项已到位。做了以下精准修复：

### 完成修复

**A. 性能优化** ✅
- 字体加载策略确认正确：`display: "swap"` + CSS variable
- 首页 logo 已有 `priority`，城市卡片已有 `loading="lazy"` + `sizes`
- 城市目的地页 hero 图已有 `priority` + `sizes="100vw"`
- How It Works toto 吉祥物图片添加 `loading="lazy"`
- Why TotoTrip CTA 的 pool_toto 图片添加 `loading="lazy"`

**B. 移动端修复** ✅
- MessageInput 已有 `pb-[max(1rem,env(safe-area-inset-bottom))]`（iOS 安全区）✅
- MessageList Markdown: `[&_code]:break-all` → `[&_code]:break-words`（修复 CJK 文本断词问题）
- MessageList Markdown: `[&_a]:break-all` → `[&_a]:break-words`（链接断词优化）
- MessageList Markdown: 添加 `[&_table]:block [&_table]:w-full`（表格移动端溢出防护）
- 汉堡菜单已有点击外部关闭（backdrop onClick）✅

**C. a11y 修复** ✅
- ThemeToggle、LanguageToggle、汉堡菜单按钮已有 `aria-label` ✅
- Send 按钮、Back 按钮、Map/Chat 切换按钮已有 `aria-label` ✅
- Copy 按钮已有 `aria-label` ✅
- How It Works toto 图片 alt 改为更描述性文本（"Explore" → "Toto exploring nature" 等）
- pool_toto alt 改为 "Toto mascot relaxing by the pool"
- 所有 Image 标签已有描述性 alt ✅

### 部署状态
Build 成功，Zeabur 部署中。

---

## ✅ Sprint v2.2 — 品牌深度整合（已完成）

### 完成时间: 2026-03-09 08:15 UTC

### 完成任务

**A. 品牌字体一致性升级** ✅
- 全站 section headings 从 `font-extrabold` 统一为 `font-display`（Amelie Fierce）
- 影响页面：首页（Destinations / Social Proof / How It Works / Why TotoTrip）、Inspiration hero + CTA、Toolkit hero + CTA、Destinations 城市页 hero + CTA、Trips 空状态、Chat WelcomeOnboarding、Auth 页标题
- 品牌子标题 `font-subtitle`（MetamorBit）用于步骤编号、标签文字、loading 页
- 统计数字使用 `font-display` 增强品牌辨识度

**B. 品牌色彩系统完善** ✅
- CSS 变量 + Tailwind config 已完全匹配品牌7色（#083022 / #99B7CF / #E7B61B / #E95331 / #E0C4BC / #6BBFAC / #C999C5）
- 色彩系统 v2.0 已部署完备（深色模式适配 ✅）

**C. Toto 吉祥物多样性集成** ✅
- `plain_toto.png` — Chat 头像、SessionList、typing indicator（保持一致性）
- `nature_toto.png` — 404 页面（迷路的探险者概念）+ How It Works Step 1 + Inspiration 空状态
- `foodie_toto.png` — Error 页面 + How It Works Step 2
- `family_toto.png` — Trips 空状态（等待计划） + How It Works Step 3
- `party_toto.png` — Loading 页面（加载的兴奋感）+ Auth 页面
- `pool_toto.png` — Why TotoTrip CTA 行 + Inspiration 自定义 CTA
- 之前只用 `plain_toto.png` → 现在6个吉祥物全部有各自语境

**D. "Why TotoTrip" 痛点板块** ✅ (新增)
- 首页新增完整 "Why TotoTrip" section（在 How It Works 上方）
- 6 大痛点卡片：支付设置 / 高铁购票 / VPN 上网 / 点餐 / 语言翻译 / 安全导航
- 每个卡片有品牌色图标 + 悬浮放大效果
- 底部 CTA 行：pool_toto 吉祥物 + Chat 按钮

**E. Auth 页面品牌化重设计** ✅
- 从默认 shadcn Card 组件 → 品牌设计语言（圆角2xl、品牌色、渐变背景装饰）
- 完整 i18n 支持（t() 函数替换所有硬编码文本）
- party_toto 吉祥物 + font-display 标题 + font-subtitle 副标题
- 自定义 Tab Switcher 替代默认 Tabs（品牌色活跃状态）
- Input 组件品牌化（品牌色 focus ring + border）
- 错误/成功消息品牌化（橙红/薄荷绿配色）

**F. 404 / Error / Loading 页面品牌升级** ✅
- 404: `nature_toto.png` + float 动画 + i18n + font-subtitle 标签
- Error: `foodie_toto.png` + i18n + font-mono-brand 错误 ID
- Loading: `party_toto.png`（更大 80px）+ font-subtitle Loading 文字 + 更粗品牌渐变条

**G. i18n 新增键** ✅
- `notFound.*`（title/description/backHome/chatWithToto/popularPages）— en + zh
- `error.*`（title/description/tryAgain/backHome）— en + zh
- 修复 `zh.socialProof.stats` 键名不匹配 en 的 TypeScript 编译错误

### Build & Deploy
- ✅ `npx next build` — 零错误零警告
- ✅ `zeabur deploy` — 成功部署到 https://tototrip.zeabur.app

### 品牌升级 Checklist 状态更新
- [x] A1-A4: 品牌基础设施（字体、色彩、Logo、吉祥物全部整合）
- [x] B1-B5: 首页品牌化（Why TotoTrip section + font-display headings + 吉祥物多样化）
- [x] C1-C3: Auth/Error/404 品牌化（完整重设计 + i18n）
- [x] D1-D5: 细节打磨（全站 font-display、吉祥物语境化、统计数字品牌字体）

---

## ✅ Sprint v2.1 — UX 审查 & Bug 修复（已完成）

### 完成时间: 2026-03-09 06:55 UTC

### 发现和修复的问题

**Bug 1: PlaceCard 图片 fallback 损坏** 🐛→✅
- `onError` 使用 `classList.add()` 动态添加 Tailwind gradient 类 → Tailwind 不会生成这些动态类
- 修复: 改用 `useState` (`imgError`) 驱动条件渲染，图片加载失败时显示 emoji 占位

**Bug 2: LocationMap Popup Day 数字硬编码** 🐛→✅
- `LocationPopup` 中 `getLocationDay(index, 10)` 硬编码 total=10
- 修复: 传入 `total` prop，使用实际的 `validLocations.length`

**Bug 3: ItineraryTimeline 未使用导入** ⚠️→✅
- `DollarSign` 从 lucide-react 导入但未使用（build warning 风险）
- 修复: 移除未使用的导入

**i18n 问题 4: PlaceCard 硬编码英文** 🌐→✅
- "Save", "Add to Trip", "Added!", toast 消息全部硬编码英文
- 修复: 添加 `useI18n()` hook，新增 `placeCard.*` i18n keys（en + zh）

**i18n 问题 5: ItineraryTimeline 硬编码英文** 🌐→✅
- "Your Trip Itinerary 🐾", "All Days", "Day X", "X stops", "Morning/Afternoon/Evening"
- 修复: 添加 `useI18n()`, 新增 `itinerary.*` i18n keys（en + zh），通过 prop 传递 `t()` 到子组件

**i18n 问题 6: 首页 Hero 硬编码** 🌐→✅
- Quick tags（"Beijing 3 days", "Silk Road" 等）, 搜索框 placeholder, "Plan Trip" 按钮
- 修复: 使用 `t()` 函数 + 新增 `quickTags.*` i18n keys

**i18n 问题 7: Inspiration 页硬编码** 🌐→✅
- "Est. Budget", "Use This Trip", "No templates found" 硬编码
- 修复: 使用已有的 `inspiration.estBudget`, `inspiration.usePlan` keys + 新增 `inspiration.noTemplates`

### 代码审查通过（无需修复）
- ✅ LocationMap Leaflet SSR — 正确使用 `dynamic()` import + `isClient` guard
- ✅ parsePlaces.ts — JSON5 解析，流式标签清理，malformed JSON try/catch
- ✅ parseItinerary.ts — 同样健壮的解析逻辑
- ✅ 深色模式 — 所有组件都有完整的 `dark:` class 覆盖
- ✅ 响应式 — 合理的 `sm:`/`md:`/`lg:` 断点
- ✅ 首页路由跳转 — `handleStartChat` 正确创建 session 并带 `?q=` 参数
- ✅ Inspiration "Use This Trip" — localStorage 保存 + chat 路由正确
- ✅ 全屏模式 — Escape 键关闭 + 正确的 z-index

### Build & Deploy
- ✅ `npx next build` — 零错误零警告
- ✅ `zeabur deploy` — 成功部署

---

## ✅ Sprint v2.0 — UX 重建（已完成）

### 完成时间: 2026-03-09 06:35 UTC

### 完成任务

**Task 1: 交互式地图 2.0** ✅
- LocationMap.tsx 570行重写
- Popup 详情卡片（图+评分+价格）
- 按 Day 分色标记 + polyline
- 地图↔列表联动
- 全屏模式

**Task 2: AI Rich Cards** ✅
- PlaceCard.tsx 新组件 + parsePlaces.ts
- `<PLACE_DATA>` 解析
- 2列桌面/1列移动网格

**Task 3: Day-by-Day 行程** ✅
- ItineraryTimeline.tsx 347行重写
- Day 选择器 pills + 时段分段
- 行程概览 header

**Task 4: 首页 Hero Chat Input** ✅
- 内嵌搜索框 + 4快捷标签
- 精简 section

**Task 5: Inspiration 页重建** ✅
- 10精品行程模板 + 6主题 tabs
- 响应式网格 + "Use This Trip"

**Task 6: 品牌整合** ✅
- CSS 变量 + 品牌名统一

### 部署
- `npx next build` 零错误 ✅
- Zeabur 部署成功 ✅
- 截图存档: `changelog/v2.0-ux/screenshots/`

---

## ✅ Sprint v1.8 — 行程保存 + 分享功能（已完成）

### 完成时间: 2026-03-09 05:35 UTC

### 完成任务

**Task 1: 行程保存（localStorage）** ✅
1. **SaveTripButton 组件** — AI 生成 `<ITINERARY_DATA>` 后，在 ItineraryTimeline 下方显示 "Save Trip" + "Share" 按钮
2. **Trip 数据结构** — `SavedTrip` interface（id, name, cities, days, itinerary, locations, timestamps）
3. **localStorage 持久化** — `tototrip_saved_trips` key
4. **保存成功 Toast** — "Trip saved! ✅"
5. **自动生成行程名** — 从 itinerary 提取城市名，生成如 "Beijing 5-Day Adventure"
6. **城市智能提取** — 支持 50+ 中国城市名匹配

**Task 2: My Trips 页面 `/trips`** ✅
1. **Trip 列表** — 卡片网格显示所有保存的行程（行程名、城市路线、天数、创建时间）
2. **Trip 详情 `/trips/[id]`** — 显示完整 ItineraryTimeline + LocationMap + 分享/删除按钮
3. **删除行程** — 每张卡片 hover 显示删除按钮（确认弹窗）
4. **空状态** — "No saved trips yet. Start chatting to plan your first trip!" + 跳转 Chat 按钮
5. **纯 localStorage** — 不依赖 Supabase/后端，之前的 Supabase trips 页面已简化为重定向

**Task 3: 分享功能** ✅
1. **分享链接** — 行程 base64 编码为 URL（`/trips/shared?data=base64...`），支持 Unicode
2. **分享按钮** — Trip 详情页 + ItineraryTimeline 旁均有分享按钮
3. **共享页面 `/trips/shared`** — 解析 URL 参数，只读显示行程（ItineraryTimeline + LocationMap）
4. **保存共享行程** — 共享页面顶部 "Save This Trip" 按钮，可保存到自己的 localStorage
5. **Toast** — "Link copied! Share it with your travel buddies 🔗"
6. **错误处理** — 无效/过期链接显示友好错误页

### 技术细节
- **新增文件**: `lib/savedTrips.ts`（数据层：类型 + localStorage CRUD + base64 编解码）, `app/chat/components/SaveTripButton.tsx`, `app/trips/shared/page.tsx`
- **重写文件**: `app/trips/page.tsx`（从 Supabase → localStorage 卡片网格）, `app/trips/[id]/page.tsx`（从 Supabase → localStorage 详情页）
- **简化文件**: `app/trips/new/page.tsx`（→ redirect to /chat/new）, `app/trips/[id]/edit/page.tsx`（→ redirect to detail）
- **修改文件**: `app/chat/components/MessageList.tsx`（集成 SaveTripButton）, `messages/en.json` + `messages/zh.json`（新增 `trips.*` i18n keys）
- `npx next build` 零错误 ✅
- Zeabur 部署成功 ✅
- 深色模式支持 ✅
- i18n 支持（en + zh）✅
- 移动端友好 ✅
- 纯前端，不依赖 Supabase ✅

### 新增路由
- `/trips/shared` — 共享行程页面

---

## ✅ Sprint v1.7 — AI System Prompt 优化 + 错误处理 + Loading 体验（已完成）

### 完成时间: 2026-03-09 05:XX UTC

### 完成任务

**Task 1: AI System Prompt 全面优化** ✅
- 全新人格设定：像一个在中国生活了 10 年的外国朋友 + 专业旅行顾问
- 第一次对话主动询问 5 大要素：去哪里、多少天、几个人、预算、兴趣（分 2-3 个问，不一次问完）
- 模糊请求智能引导：不会直接生成 generic itinerary，而是用有趣的问题引导用户细化
- 推荐结构化：名称 + 中文名 + ⭐ 评分 + 📍 位置 + 🚇 交通 + ¥ 价格 + 一句话点评
- 主动提醒中国特有注意事项（支付、VPN、交通卡、文化禁忌、筷子礼仪等）
- `<LOCATION_DATA>` 和 `<ITINERARY_DATA>` 输出自然过渡
- 语言风格：热情实用，有幽默感，不啰嗦
- 安全边界：非旅行话题礼貌拒绝（"I'm built for China travel — that's where I shine! 🐕"）
- 价格锚点（街头小吃 ¥10-30, 餐厅 ¥40-80, 酒店分档等）

**Task 2: 错误处理优化** ✅
1. **Chat API 错误**
   - 友好错误消息（区分离线/临时失败/多次失败三种情况）
   - 重试按钮（出现在输入框上方）
   - 3 次以上失败建议刷新页面
   - 错误计数器跟踪失败次数

2. **网络断开检测** — `OfflineBanner` 组件
   - 离线时顶部显示红色 "You're offline" banner（WifiOff 图标）
   - 恢复在线时显示绿色 "Back online!" banner（自动 3s 消失）
   - 使用 `navigator.onLine` + `online/offline` 事件
   - AnimatePresence 平滑过渡动画

3. **404 页面** — `app/not-found.tsx`
   - 品牌风格的 Toto 吉祥物 + "404 Looks like you're lost! 🐾"
   - 回首页按钮 + Chat with Toto 按钮
   - 热门页面快速导航（Beijing, Shanghai, Chengdu, Inspiration, Toolkit）

4. **全局 Error Boundary** — `app/error.tsx`
   - "Oops, something went sideways! 🐕" 品牌风格错误页
   - Try Again 重试按钮 + Back to Home 按钮
   - Error digest 展示（用于调试）

**Task 3: Loading 体验** ✅
1. **Chat 流式加载** — 全新 TypingIndicator
   - 三个弹跳圆点动画（`typingBounce` keyframe，非简单 fade）
   - "Toto is thinking..." 文字提示
   - Toto 头像添加 float 动画

2. **页面切换 loading** — `app/loading.tsx`
   - 品牌 Toto 吉祥物 + float 动画
   - 渐变加载条（品牌色 gradient shimmer）

3. **图片加载** — `ImageWithSkeleton` 组件
   - 品牌色 skeleton placeholder（`#E0C4BC` pulse）
   - Shimmer 扫光动画
   - 图片加载完成后 opacity 过渡
   - 已应用到：首页城市卡片、目的地详情页景点图片、美食图片、推荐城市图片

### 技术细节
- **新增文件**: `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx`, `components/OfflineBanner.tsx`, `components/ImageWithSkeleton.tsx`
- **修改文件**: `app/api/chat/route.ts`（system prompt 大幅升级）, `app/chat/[id]/page.tsx`（错误重试逻辑）, `app/chat/components/MessageList.tsx`（新 typing indicator）, `app/globals.css`（bouncing dots CSS）, `app/layout.tsx`（OfflineBanner 集成）, `app/page.tsx`（ImageWithSkeleton）, `app/destinations/[city]/page.tsx`（ImageWithSkeleton）, `messages/en.json` + `messages/zh.json`（新 i18n keys）
- `npx next build` 零错误 ✅
- Zeabur 部署成功 ✅
- 深色模式支持 ✅
- i18n 支持（en + zh）✅
- 移动端友好 ✅

---

## ✅ Sprint v1.6 — 城市详情页 + Landing 优化（已完成）

### 完成时间: 2026-03-09 05:XX UTC

### 完成任务

**Task 1: 城市详情页 `/destinations/[city]`** ✅
- 6 个城市详情页（Beijing/Shanghai/Chengdu/Xi'an/Guilin/Hong Kong）
- 每页包含：Hero Banner、Quick Facts、Top Attractions、Local Food、Getting Around、CTA
- 完整中英文 i18n 支持（数据在 `lib/city-data.ts` 硬编码）
- 每个城市独立 SEO metadata（Open Graph + Twitter Cards）
- 静态生成（SSG with `generateStaticParams`）
- 深色模式 + 移动端响应式
- "Plan your trip to [City]" CTA 跳转到 Chat 并预填消息
- 底部"探索更多目的地"推荐其他城市

**Task 2: 首页城市卡片链接** ✅
- 城市卡片点击跳转到 `/destinations/[city]`（而非直接开聊）
- 卡片 hover 效果：箭头图标 + scale 动画（已有）

**Task 3: 导航 "Destinations" 下拉** ✅
- 桌面端：Destinations 按钮 hover 下拉菜单，列出 6 个城市链接
- 移动端：汉堡菜单内展开 6 个城市链接
- 城市详情页内同样有导航下拉

### 技术细节
- 新增文件: `lib/city-data.ts`, `app/destinations/[city]/page.tsx`, `app/destinations/[city]/layout.tsx`
- 更新文件: `app/page.tsx`（导航下拉 + 城市卡片链接）, `app/sitemap.ts`（新增城市页）
- `npx next build` 零错误 ✅
- Zeabur 部署成功 ✅

### 新增路由
- `/destinations/beijing`
- `/destinations/shanghai`
- `/destinations/chengdu`
- `/destinations/xian`
- `/destinations/guilin`
- `/destinations/hongkong`

---

## 上一个 Sprint: 品牌升级 — "从途到 toto"（暂停）

### 备注
品牌升级任务暂停，优先完成 v1.6 城市详情页。品牌升级任务清单保留如下：

- [ ] A1-A4: 品牌基础设施
- [ ] B1-B5: 首页重设计
- [ ] C1-C3: 聊天页品牌化
- [ ] D1-D5: 细节打磨

## 部署状态
- Zeabur: https://tototrip.zeabur.app
- Service ID: 69a1be8a79f74da9ed5a8f43
- Dev: http://localhost:3001
