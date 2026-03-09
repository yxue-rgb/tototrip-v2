# v1.8 Changelog — 行程保存 + 分享 + AI优化 + 错误处理

**日期**: 2026-03-09 05:35 UTC
**部署**: Zeabur ✅ (tototrip.zeabur.app)

## 功能清单（v1.1 → v1.8 全量）

### v1.8 — 行程保存 + 分享
- 行程保存到 localStorage（SaveTripButton 组件）
- My Trips 页面（卡片网格 + 详情 + 删除）
- 分享链接（base64 编码 URL + 共享只读页面）
- 保存共享行程到自己的 localStorage

### v1.7 — AI 优化 + 错误处理 + Loading
- AI System Prompt 全面优化（中国旅行专家人设）
- 网络离线检测 + OfflineBanner
- 404 页面 + Error Boundary（品牌风格）
- Loading 页面 + TypingIndicator（弹跳动画）
- ImageWithSkeleton 组件（骨架屏加载）

### v1.6 — 城市详情页
- 6 个城市详情页（Beijing/Shanghai/Chengdu/Xi'an/Guilin/Hong Kong）
- Destinations 导航下拉菜单
- 独立 SEO metadata

### v1.5 — 品牌视觉升级
- Toto 品牌系统（Logo + 吉祥物 + 品牌色）
- 首页完全重设计

### v1.4 — 地图重做
- CartoDB Positron 英文地图瓦片
- 自定义 SVG 标记 pin（类型图标+颜色）
- 路线 polyline + 智能缩放

### v1.3 — AI 换 Gemini 2.5 Pro
- 从 Anthropic/DeepSeek/Groq 多源切换到 Gemini 2.5 Pro 单源
- Fallback chain: Gemini → DeepSeek → Groq

### v1.2 — Bug 修复
- 修复 v1.1 体验报告所有 bug

### v1.1 — 首轮品牌 + 功能
- Hero 重设计 + 城市卡片 + Social Proof
- Chat API 认证 + Rate Limit
- 深色模式全面支持

## 截图
- `screenshots/homepage-desktop.png`
- `screenshots/homepage-full.png`
- `screenshots/homepage-mobile.png`
- `screenshots/chat-desktop.png`
- `screenshots/chat-mobile.png`
