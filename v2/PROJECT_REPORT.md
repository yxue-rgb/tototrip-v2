# TOTO Trip V2 项目报告

**生成日期：** 2026-01-23
**项目版本：** 0.1.0
**框架版本：** Next.js 16.1.1

---

## 一、项目愿景 (Vision)

### 使命
**"让每一位外国游客都能像当地人一样畅游中国"**

### 核心价值
- **AI 陪伴式体验** - 不只是行程规划，而是 24/7 全程旅行伙伴
- **实时智能响应** - 流式 AI 对话，即时回答旅行问题
- **个性化推荐** - 基于用户偏好的景点、餐厅、活动推荐
- **简化复杂度** - 让支付、交通、语言不再成为障碍

### 目标用户
- 首次来中国旅游的外国游客
- 需要深度游建议的旅行者
- 对中国文化感兴趣的探索者

---

## 二、技术架构

### 技术栈
| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | Next.js 16.1.1 (App Router) | React Server Components + Turbopack |
| 编程语言 | TypeScript 5 | 类型安全 |
| 样式 | Tailwind CSS 3.4 | 原子化 CSS |
| UI 组件 | shadcn/ui (Radix) | 无障碍组件库 |
| 动画 | Framer Motion 11 | 流畅动效 |
| 地图 | Leaflet + React Leaflet | 开源地图方案 |
| 状态管理 | Zustand 4.5 | 轻量状态管理 |
| 数据库 | Supabase (PostgreSQL) | BaaS 后端 |
| 认证 | Supabase Auth | OAuth + Email 登录 |
| AI 服务 | DeepSeek / Groq / Claude | 多供应商支持 |

### 架构图
```
┌─────────────────────────────────────────────────────────────┐
│                         用户界面                              │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐   │
│   │  首页   │  │ AI 聊天  │  │ 行程管理 │  │ 地点收藏    │   │
│   └────┬────┘  └────┬────┘  └────┬────┘  └──────┬──────┘   │
└────────┼────────────┼───────────┼───────────────┼───────────┘
         │            │           │               │
┌────────┴────────────┴───────────┴───────────────┴───────────┐
│                    Next.js API Routes                        │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐   │
│   │ /auth/* │  │ /chat   │  │ /trips  │  │ /locations  │   │
│   └────┬────┘  └────┬────┘  └────┬────┘  └──────┬──────┘   │
└────────┼────────────┼───────────┼───────────────┼───────────┘
         │            │           │               │
    ┌────┴────┐  ┌────┴────┐     │               │
    │Supabase │  │ AI APIs │     │               │
    │  Auth   │  │DeepSeek │     │               │
    └─────────┘  │ Groq    │     └───────┬───────┘
                 │ Claude  │             │
                 └─────────┘    ┌────────┴────────┐
                                │   Supabase DB   │
                                │   (PostgreSQL)  │
                                └─────────────────┘
```

---

## 三、已完成功能 (Completed Features)

### 1. 认证系统 ✅
- [x] 邮箱/密码注册
- [x] 邮箱/密码登录
- [x] Google OAuth 登录
- [x] 会话持久化
- [x] 用户资料管理
- [x] 全局认证上下文

### 2. AI 聊天伴侣 ✅
- [x] 流式响应（实时显示）
- [x] 多 AI 供应商支持（DeepSeek/Groq/Claude）
- [x] 智能供应商切换
- [x] 用户可选择 AI 供应商
- [x] 聊天历史持久化
- [x] 自动生成会话标题
- [x] Markdown 格式支持

### 3. 地点管理 ✅
- [x] AI 推荐地点解析
- [x] 地点收藏保存
- [x] 地点详情展示（评分、价格、营业时间等）
- [x] 地点分类系统
- [x] 重复检测
- [x] 地图可视化

### 4. 行程规划 ✅
- [x] 创建行程
- [x] 行程详情查看
- [x] 添加地点到行程
- [x] 行程状态追踪
- [x] 编辑/删除行程

### 5. 用户界面 ✅
- [x] 现代化渐变设计
- [x] 响应式布局（移动端适配）
- [x] 消息动画效果
- [x] 快捷操作按钮
- [x] 会话侧边栏
- [x] 加载状态提示
- [x] Toast 通知

### 6. 会话管理 ✅
- [x] 会话列表
- [x] 会话归档
- [x] 会话删除
- [x] 历史记录加载

---

## 四、发现的问题 (Issues Found)

### 严重问题 (Critical)

| # | 问题 | 位置 | 状态 |
|---|------|------|------|
| 1 | Google OAuth 回调 URL 只配置了 localhost | Supabase Dashboard | ⚠️ 需手动配置 |

### 中等问题 (Medium)

| # | 问题 | 位置 | 建议 |
|---|------|------|------|
| 2 | 没有 React Error Boundary | 全局 | 添加错误边界组件 |
| 3 | 聊天目的地硬编码为 "China" | `chat/[id]/page.tsx:296` | 可保留（项目定位） |
| 4 | 消息保存失败时用户无感知 | `chat/[id]/page.tsx` | 添加错误提示 |
| 5 | Token 提取方式不一致 | API routes | 统一使用一种方式 |
| 6 | 缺少输入验证 | API routes | 添加验证中间件 |

### 轻微问题 (Minor)

| # | 问题 | 说明 |
|---|------|------|
| 7 | 78 个 console.log 语句 | 开发调试用，生产环境可清理 |
| 8 | 访客模式无明确提示 | 未登录用户可能丢失对话 |
| 9 | 无请求速率限制 | 可能被滥用 |
| 10 | 地点分类归一化不完整 | 部分变体未覆盖 |

---

## 五、Action Plan (行动计划)

### Phase 1: 稳定性修复（1-2 天）

#### 1.1 Supabase 配置
- [ ] 在 Supabase Dashboard 添加生产环境回调 URL
- [ ] 配置 `https://tototrip-v2.vercel.app/**`

#### 1.2 错误处理
- [ ] 添加全局 Error Boundary 组件
- [ ] 消息保存失败时显示 toast 提示
- [ ] 统一 API 错误响应格式

#### 1.3 代码清理
- [ ] 移除非必要的 console.log
- [ ] 统一 token 提取方式

### Phase 2: 国内部署准备（2-3 周）

#### 2.1 域名备案
- [ ] 购买国内域名（如 .cn）
- [ ] 提交 ICP 备案申请
- [ ] 等待审核（7-20 个工作日）

#### 2.2 服务器部署
- [ ] 购买阿里云 ECS 或函数计算
- [ ] 配置 HTTPS 证书
- [ ] 部署应用

#### 2.3 微信登录
- [ ] 注册微信开放平台
- [ ] 企业资质认证
- [ ] 创建网站应用
- [ ] 集成微信登录代码

### Phase 3: 功能增强（1-2 周）

#### 3.1 行程增强
- [ ] 日程视图（Timeline）
- [ ] 拖拽排序
- [ ] 预算追踪
- [ ] 行程分享

#### 3.2 地图增强
- [ ] 高德地图集成（国内更快）
- [ ] 路线规划
- [ ] 离线地图

#### 3.3 AI 增强
- [ ] 图片识别（菜单翻译）
- [ ] 语音输入
- [ ] 多语言支持

### Phase 4: 生产就绪（1 周）

#### 4.1 安全加固
- [ ] 添加速率限制
- [ ] 输入验证中间件
- [ ] CSRF 保护
- [ ] 请求日志

#### 4.2 监控
- [ ] 错误追踪（Sentry）
- [ ] 性能监控
- [ ] 用户分析

---

## 六、数据库架构

### 表结构
```sql
-- 用户表
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  home_country TEXT,
  currency_preference TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- 聊天会话表
chat_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  title TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- 聊天消息表
chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT,
  locations JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ
)

-- 收藏地点表
saved_locations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  trip_id UUID REFERENCES trips(id),
  name TEXT,
  description TEXT,
  category TEXT,
  address TEXT,
  city TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  rating DECIMAL,
  price_level INTEGER,
  opening_hours TEXT,
  image_url TEXT,
  ...
)

-- 行程表
trips (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  destination_city TEXT,
  destination_country TEXT DEFAULT 'China',
  start_date DATE,
  end_date DATE,
  total_budget DECIMAL,
  travelers_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'planning',
  ...
)
```

---

## 七、API 端点一览

| 端点 | 方法 | 功能 | 认证 |
|------|------|------|------|
| `/api/auth/signup` | POST | 用户注册 | ❌ |
| `/api/auth/login` | POST | 用户登录 | ❌ |
| `/api/auth/logout` | POST | 退出登录 | ✅ |
| `/api/auth/user` | GET/PATCH | 用户资料 | ✅ |
| `/api/chat` | POST | AI 对话（流式） | ❌ |
| `/api/sessions` | GET/POST | 会话列表/创建 | ✅ |
| `/api/sessions/[id]` | GET/PATCH/DELETE | 会话详情 | ✅ |
| `/api/messages` | POST | 保存消息 | ✅ |
| `/api/locations` | GET/POST | 地点列表/保存 | ✅ |
| `/api/locations/[id]` | DELETE/PATCH | 地点操作 | ✅ |
| `/api/trips` | GET/POST | 行程列表/创建 | ✅ |
| `/api/trips/[id]` | GET/PATCH/DELETE | 行程详情 | ✅ |
| `/api/trips/[id]/locations` | POST/DELETE | 行程地点 | ✅ |

---

## 八、部署状态

| 环境 | URL | 状态 |
|------|-----|------|
| Vercel（海外） | https://tototrip-v2.vercel.app | ✅ 运行中 |
| 本地开发 | http://localhost:3000 | ✅ 可用 |
| 阿里云（国内） | - | ❌ 未部署 |

---

## 九、成本估算

### 当前成本（开发阶段）
| 服务 | 费用 | 说明 |
|------|------|------|
| Vercel | $0 | Hobby 免费套餐 |
| Supabase | $0 | 免费套餐 |
| DeepSeek API | ~$10/月 | 按使用量 |
| **总计** | **~$10/月** | |

### 生产成本估算（1000 用户/月）
| 服务 | 费用 | 说明 |
|------|------|------|
| Vercel Pro | $20/月 | 更高配额 |
| Supabase Pro | $25/月 | 更大存储 |
| AI API | $100-200/月 | 按使用量 |
| 阿里云 ECS | $50-100/月 | 国内部署 |
| 域名 + 备案 | $20/年 | 一次性 |
| **总计** | **$195-345/月** | |

---

## 十、团队建议

### 短期（1-2 周）
1. **修复 OAuth 回调配置** - 立即在 Supabase 添加生产 URL
2. **添加错误边界** - 提升用户体验
3. **开始备案流程** - 国内部署必需

### 中期（1-2 月）
1. **完成微信登录集成** - 国内用户必需
2. **部署阿里云** - 提升国内访问速度
3. **添加高德地图** - 国内地图更准确

### 长期（3-6 月）
1. **图片识别功能** - 菜单/路牌翻译
2. **离线模式** - 无网络时可用
3. **多语言完善** - 支持更多语言
4. **用户增长** - 营销推广

---

## 十一、总结

**项目健康度：★★★★☆ (4/5)**

### 优势
- ✅ 架构清晰，代码质量良好
- ✅ 多 AI 供应商支持，成本可控
- ✅ 核心功能完整，可用性高
- ✅ 现代化 UI，用户体验好

### 待改进
- ⚠️ 需要完成国内部署
- ⚠️ 缺少微信登录
- ⚠️ 需要添加错误监控
- ⚠️ 需要完善测试覆盖

### 结论
TOTO Trip V2 是一个**基础扎实、功能完善**的旅行伴侣应用。当前版本已经可以服务海外用户。下一步重点是**完成国内部署和微信登录**，以服务目标用户群体。

---

**报告生成者：** Claude Code
**项目路径：** `/Volumes/X9 Pro/tototrip/v2`
