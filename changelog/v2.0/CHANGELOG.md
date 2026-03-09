# 📋 TotoTrip v2.0 — 变更日志

> 版本：v2.0 基础版
> 开发周期：2026-03-09
> 开发者：Morty (AI) + 开发专员团队

---

## 版本概述
从 demo 级别升级到具备品牌感的完整产品。全面视觉重塑 + AI 后端切换 + 地图重做 + 13 个 bug 修复。

---

## Phase 0: Bug 修复（13项）

### Critical
- 🔴 中文 UI → 全部英文化（目标用户是外国人）
- 🔴 Chat API 无认证 → 添加 Supabase token 验证 + IP 限速 20/min

### High
- 🟠 Tailwind 动态类名不生效 → safelist 修复
- 🟠 Trip Edit 页面崩溃 → 路由和数据加载修复
- 🟠 移动端 sidebar 遮挡内容 → 响应式布局重写
- 🟠 Auth 路由未保护 → middleware 添加认证检查

### Medium
- 🟡 Footer 年份硬编码 → 动态获取
- 🟡 Image domain 白名单缺失 → next.config 添加
- 🟡 Guest 模式 localStorage 冲突 → 隔离存储
- 🟡 Model selector 暴露给用户 → 移除
- 🟡 Hamburger menu 不工作 → 事件绑定修复
- 🟡 其他 2 项小修复

**统计：27 文件改动，+530 行 / -245 行**

---

## Phase 1: 视觉重塑 + 品牌升级

### 新增
- ✅ 全新首页设计 — Hero section（动画渐变 + "Discover China Like Never Before"）
- ✅ 6 个热门城市卡片（Beijing, Shanghai, Chengdu, Xi'an, Guilin, Hangzhou）
- ✅ "Why TotoTrip" 板块 — 6 个中国特有痛点解决方案展示
- ✅ "How It Works" 3 步流程说明
- ✅ CTA section + 品牌 Footer

### 品牌系统
- ✅ 色彩方案：中国红 #E8453C + 金色 #D4A853 + 墨色 #1A1A2E
- ✅ Logo：途字渐变圆形标识
- ✅ 双语品牌："TotoTrip 途图旅行"
- ✅ Design tokens (CSS custom properties)
- ✅ 毛玻璃效果、渐变文字、卡片 hover 动画
- ✅ favicon + OG metadata

### 聊天页升级
- ✅ 品牌化 header + 途字头像
- ✅ 用户消息：墨色渐变 / AI 消息：白色卡片
- ✅ 6 个中国特色 Quick Action 按钮
- ✅ 专业 Welcome Message

---

## Phase 2: AI 交互重塑

### AI 后端
- ✅ 切换至 Gemini 2.5 Pro（替代 Anthropic 多 provider 混乱）
- ✅ Fallback 链：Gemini → DeepSeek → Groq
- ✅ 使用 OpenAI-compatible API，无需新依赖

### System Prompt
- ✅ 完全重写 — 专业中国旅行顾问人格
- ✅ 深度中国知识：支付/交通/VPN/住宿/餐饮/文化
- ✅ 结构化对话流程
- ✅ 中文短语含拼音

---

## Phase 3: 地图重做

- ✅ CartoDB Positron 瓦片（极简白底风格）
- ✅ 自定义 SVG 水滴标记 — 分类颜色 + emoji
  - 🍜 餐厅 橙色 | 🏛️ 景点 红色 | 🏨 酒店 紫色 | 🚄 交通 蓝色 | 🛍️ 购物 粉色
- ✅ 路线虚线连接（按访问顺序）
- ✅ 点击标记弹出详情 popup
- ✅ 地图 ↔ 列表视图切换
- ✅ 标记编号 + 智能缩放

---

## 部署信息

- **平台**：Zeabur
- **域名**：tototrip.zeabur.app
- **Service ID**：69a1be8a79f74da9ed5a8f43
- **Deployment ID**：69a1c350aaa1dbcb5f3831a6
- **部署时间**：2026-03-09 ~02:30 GMT
- **部署命令**：`cd projects/tototrip/v2 && npx next build && zeabur deploy -i=false --service-id 69a1be8a79f74da9ed5a8f43`

### 注意事项
- ⚠️ 不能用 `output: 'standalone'`，和 Zeabur Dockerfile 冲突
- start script: `next start -p ${PORT:-3000}`

---

## 技术栈

- Next.js 16.1.1 + TypeScript
- Tailwind CSS + shadcn/ui
- Gemini 2.5 Pro / DeepSeek / Groq (AI)
- Supabase (Auth + Database)
- Leaflet (地图)
- Zeabur (部署)

---

*记录 by Morty | 2026-03-09*
