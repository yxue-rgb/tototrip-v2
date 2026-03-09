# TotoTrip - 项目摸底报告

**摸底日期**: 2026-02-27
**摸底人**: Morty 🛸

---

## 📌 一句话定义

**AI 旅行伙伴，专为外国人来中国旅游设计。**

> "Your 24/7 AI travel companion that understands both you and China"

---

## 🎯 核心问题

外国人来中国旅游面临：语言障碍、支付系统（微信/支付宝）、没有 Google Maps、VPN、买火车票等独特挑战。现有旅游产品都不是专门为这个场景设计的。

---

## 📁 项目结构

```
tototrip/
├── v2/          ← 主力版本（推荐，可运行）
├── webapp/      ← 老版本（功能更全但需要后端）
└── demo-repository/  ← GitHub 演示（可忽略）
```

### V2（主力）
- **技术栈**: Next.js 15 + TypeScript + Tailwind + shadcn/ui + Zustand
- **AI**: 原用 Claude 3 Haiku（Anthropic API）
- **数据库**: Supabase（auth + 持久化）
- **地图**: Leaflet/OpenStreetMap
- **状态**: ✅ 可运行，有基础 AI 对话 + 地点推荐卡片 + 地图 + 保存地点

### V2 已实现功能
- ✅ AI 聊天对话（流式 SSE）
- ✅ 地点推荐卡片（LocationCard）
- ✅ 地图标记（Leaflet）
- ✅ 保存地点到旅程
- ✅ Supabase Auth（注册/登录）
- ✅ 聊天历史持久化（sessions + messages）
- ✅ 旅程管理 CRUD

### V2 缺少的功能
- ❌ 行程 Timeline 视图
- ❌ 预算计算
- ❌ 分享/PDF 导出
- ❌ 离线模式
- ❌ 多语言 i18n

### Webapp（老版本）
- **技术栈**: Next.js + GraphQL + Prisma + Auth0 + Mapbox
- **状态**: ⚠️ 需要独立 GraphQL 后端，当前无法启动
- **价值**: 有完整的地图、行程管理、预算计算、i18n 实现，可参考

---

## 🔑 环境变量

### V2 需要
- `ANTHROPIC_API_KEY` — 原配的（可能已过期）
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

### Webapp 需要（暂不用）
- GraphQL 后端 URL、Auth0、Mapbox key 等

---

## 💡 关键决策

1. V2 是主力方向（简化架构，单一代码库）
2. 原 Anthropic API key 可能需要更换为 Gemini（与品酒顾问统一）
3. Supabase 用于 auth + 数据持久化
4. 目标市场：外国人来中国旅游

---

## 📊 项目成熟度评估

| 维度 | 评分 | 说明 |
|------|------|------|
| 产品定义 | ⭐⭐⭐⭐⭐ | PRD 非常详细，用户画像清晰 |
| 代码实现 | ⭐⭐⭐ | V2 基础功能完成，需要补地图/行程 |
| 部署状态 | ⭐ | 未部署，本地开发阶段 |
| 设计/UI | ⭐⭐⭐ | 基础渐变设计，需提升 |
| 数据库 | ⭐⭐⭐ | Supabase schema 已定义 |

---

## 🚀 接手后建议

1. **先跑起来**: `cd v2 && npm install && npm run dev`
2. **更换 AI 后端**: Anthropic → Gemini 2.5 Pro（统一公司技术栈）
3. **确认 Supabase 状态**: 检查是否有活跃的 Supabase 项目
4. **优先补充**: 地图体验 + 行程 Timeline
5. **部署**: 同样 Vercel + Zeabur 双部署

---

*由 Morty 摸底整理 | 瑞莫科技*
