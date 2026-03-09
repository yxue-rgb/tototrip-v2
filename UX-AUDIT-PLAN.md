# 🎯 TotoTrip UX 审计 + 重建计划

> 审计人：UX 专家视角 | 对标：MindTrip.ai, Layla.ai
> 日期：2026-03-09 | 当前版本：v1.8

---

## 一、UX 现状审计

### 🔴 严重 UX 问题（必须修）

#### 1. 地图体验落后竞品两代
**现状：** Leaflet 静态标记点 + 简单 polyline，点击无交互
**MindTrip 做法：** 交互式地图，点击标记展开详情卡片（照片+评分+描述），拖拽重排行程
**差距：** ⭐⭐⭐⭐⭐（最大差距）
**修复方案：**
- 点击地图标记 → 弹出详情卡片（图片+评分+一句话+价格）
- 地图上直接显示 Day 1 / Day 2 分组
- 路线用彩色区分不同天
- 地图可全屏展开
- 地图和行程列表联动（hover 列表 → 地图高亮对应点）

#### 2. Chat 页面信息密度低
**现状：** 纯文字气泡，AI 回复是大段文字墙
**MindTrip 做法：** AI 回复内嵌卡片（图片+评分+地图预览+收藏按钮）
**差距：** ⭐⭐⭐⭐
**修复方案：**
- AI 推荐的地点 → 渲染为 Rich Card（图片+⭐评分+📍位置+💰价格）
- 行程 → 渲染为可折叠的 Timeline 卡片（目前有但太简陋）
- 每个推荐自带"收藏"和"加入行程"按钮
- 地图预览缩略图内嵌在回复中

#### 3. 行程规划没有日视图
**现状：** 线性 Timeline，所有天混在一起
**MindTrip/Layla 做法：** Day-by-day 标签页，每天可独立编辑
**差距：** ⭐⭐⭐⭐
**修复方案：**
- 顶部 Day 选择器（Day 1 | Day 2 | Day 3...）
- 每天独立显示景点列表 + 地图
- 支持拖拽重排景点顺序
- 时间轴显示建议游览时间（上午/下午/晚上）

#### 4. 无协作功能
**现状：** 纯单人使用
**MindTrip 做法：** 邀请朋友、群聊、投票
**差距：** ⭐⭐⭐（v2 以后再做，但要预留架构）
**暂不处理，记入长期 roadmap**

#### 5. Inspiration 页太空
**现状：** 有页面但内容少
**MindTrip 做法：** 热门行程模板网格，按目的地/主题分类，一键 fork
**差距：** ⭐⭐⭐
**修复方案：**
- 预设 8-10 个精品行程模板（Beijing 3-Day Classic, Silk Road 7-Day, etc.）
- 按主题分类（文化/美食/自然/冒险）
- 每个模板显示：封面图+城市+天数+亮点+预算范围
- 一键"Use This Trip"→ 复制到 My Trips 并可自定义

### 🟠 中等 UX 问题

#### 6. 导航结构不清晰
**现状：** Chat / Destinations / Trips / Inspiration / Toolkit — 入口多但关系不明
**修复方案：**
- 简化主导航为 4 个：**Explore（首页）| Plan（Chat）| My Trips | Toolkit**
- Inspiration 合并到 Explore 页
- Destinations 从下拉改为 Explore 页的一个 section

#### 7. 首页转化路径太长
**现状：** Hero → 滚动一堆 section → 最底部 CTA
**Layla 做法：** 首屏直接是 Chat 入口
**修复方案：**
- Hero 区域直接嵌入 mini chat input（"Where do you want to go in China?"）
- 输入即跳转到 Chat 页开始规划
- 减少首页 section 数量（6→4：Hero+Cities+HowItWorks+Social Proof）

#### 8. 移动端 Chat 体验
**现状：** 基本可用但不够丝滑
**修复方案：**
- Bottom sheet 式的地图（从底部上滑展开）
- 全屏沉浸式 Chat（隐藏导航栏，只显示返回箭头）
- 快速操作按钮固定在键盘上方

#### 9. 无 Onboarding 问卷
**现状：** 直接开聊
**MindTrip 做法：** Travel Style Quiz → 生成个性化推荐
**修复方案：**
- 首次进入 Chat 时 3 步快速问卷：
  1. "What brings you to China?" (Business/Culture/Food/Adventure/Everything)
  2. "Travel style?" (Budget/Mid-range/Luxury)
  3. "How long?" (Weekend/1 week/2+ weeks)
- 基于答案预填 AI context

### 🟢 Nice-to-have

#### 10. 收据/预订管理
**MindTrip 有：** 上传收据、邮件转发预订确认
**TotoTrip：** 暂不做，但记入 roadmap

#### 11. 价格比较 / 预订
**Layla 有：** 实时机票酒店价格
**TotoTrip：** 太早，暂不做

---

## 二、竞品优势同步清单

| 功能 | MindTrip | Layla | TotoTrip 现状 | 优先级 |
|------|----------|-------|--------------|--------|
| 交互式地图 | ✅ 丰富 | ✅ 基础 | ❌ 静态标记 | 🔴 P0 |
| AI 回复内嵌卡片 | ✅ 图+评分+按钮 | ✅ 结构化输出 | ❌ 纯文字 | 🔴 P0 |
| Day-by-day 行程 | ✅ Tab式 | ✅ 可编辑 | ❌ 线性列表 | 🔴 P0 |
| 行程模板/灵感 | ✅ 社区分享 | ❌ 无 | ⚠️ 空页面 | 🟠 P1 |
| Travel Quiz | ✅ 有 | ❌ 无 | ❌ 无 | 🟠 P1 |
| 照片集成 | ✅ 每个地点有图 | ✅ 有 | ⚠️ 部分 | 🟠 P1 |
| 协作规划 | ✅ 群聊+投票 | ❌ 无 | ❌ 无 | 🟢 P2 |
| 预订集成 | ✅ 酒店+餐厅 | ✅ 全部 | ❌ 无 | 🟢 P2 |
| 移动 App | ✅ iOS | ✅ iOS+Android | ❌ PWA only | 🟢 P3 |

---

## 三、Sprint 执行计划

### Sprint v2.0 — UX 重建（核心）

**目标：** 把地图、Chat 卡片、行程日视图提升到 MindTrip 水平

#### Task 1: 交互式地图 2.0 ⏱️ ~2h
- [ ] 点击标记 → 弹出 Popup 卡片（图片+名称+评分+类型图标+价格）
- [ ] 地图标记按 Day 分色（Day 1 = teal, Day 2 = pink, Day 3 = purple...）
- [ ] 路线 polyline 也按 Day 分色
- [ ] 地图↔列表联动（hover 高亮）
- [ ] 地图全屏模式（expand button）
- [ ] Mobile: 底部 sheet 式地图（半屏/全屏切换）

#### Task 2: AI Rich Cards ⏱️ ~2h
- [ ] 新组件 `PlaceCard` — 地点推荐卡片（图片+名称+中文名+⭐评分+📍+💰+一句话）
- [ ] AI 输出 `<PLACE_DATA>` 标签 → 前端渲染为 PlaceCard 网格
- [ ] 每张卡片带"❤️ Save"和"📋 Add to Trip"按钮
- [ ] 更新 System Prompt 输出 `<PLACE_DATA>` 格式
- [ ] 卡片点击展开详情（更多照片+评价+交通+建议时长）

#### Task 3: Day-by-Day 行程视图 ⏱️ ~2h
- [ ] 顶部 Day 选择器（横向滚动 pill 按钮）
- [ ] 每天独立视图：时间轴（上午/下午/晚上）+ 景点列表
- [ ] 拖拽排序（react-beautiful-dnd 或 dnd-kit）
- [ ] 每天的地图只显示当天景点
- [ ] 行程概览：总天数 + 城市路线 + 预算估算

#### Task 4: 首页 UX 精简 ⏱️ ~1h
- [ ] Hero 嵌入 mini chat input（直接开始规划）
- [ ] 减少 section 到 4 个（Hero+Cities+HowItWorks+Testimonials）
- [ ] Cities section 改为"Popular Destinations"卡片网格
- [ ] 移除冗余的 CTA section

#### Task 5: Inspiration 页重建 ⏱️ ~1.5h
- [ ] 8-10 个预设精品行程模板
- [ ] 按主题分类 tabs（All/Culture/Food/Nature/Adventure）
- [ ] 每个模板：封面图+城市+天数+亮点标签+预算范围
- [ ] "Use This Trip" → fork 到 My Trips
- [ ] 模板数据硬编码在 `lib/trip-templates.ts`

#### Task 6: 品牌整合（并行） ⏱️ ~1h
- [ ] 替换色系：当前临时色 → 官方 Toto 品牌色
- [ ] 集成字体：Amelie Fierce (display) + Graphik (body)
- [ ] 首页加入 Toto 吉祥物插图
- [ ] 统一品牌名为 "toto"（全小写）

### 总估时：~9.5h

---

## 四、版本备份要求

- ✅ v1.8 截图已存档（`changelog/v1.8/screenshots/`）
- [ ] 每个 Sprint 完成后截图 + changelog
- [ ] 部署前 build 验证

---

## 五、成功标准

- [ ] 地图交互体验接近 MindTrip（点击展开、分色、联动）
- [ ] AI 回复不再是纯文字墙（Rich Cards）
- [ ] 行程有 Day-by-Day 视图
- [ ] 体验官评分 ≥ 4.0/5
- [ ] 首页首屏有 Chat 入口
- [ ] Inspiration 页有真实内容
