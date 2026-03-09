# 🚀 TOTO Trip - 快速启动指南

---

## ⚡ 5分钟快速启动

### 启动V2（推荐 - 开箱即用）

```bash
# 1. 打开终端，进入v2目录
cd /Volumes/X9\ Pro/tototrip/v2

# 2. 启动（依赖已安装）
npm run dev

# 3. 打开浏览器
open http://localhost:3000
```

**就这么简单！** ✅ AI对话完全可用

---

## 📁 项目说明

### v2/ - 新版本（简化架构）✅ 推荐
- ✅ AI对话（Claude 3 Haiku）
- ✅ 流式响应（打字机效果）
- ✅ 现代化UI（渐变设计）
- ✅ 无需后端
- ❌ 功能较基础（无地图/行程管理）

### webapp/ - 原版（功能完整）⚠️ 需要后端
- ✅ 完整功能（地图、行程、预算）
- ✅ UI已改进（新消息气泡、动画）
- ❌ 需要GraphQL后端API
- ❌ 当前无法启动（缺少API URL）

---

## 🎯 当前状态

| 项目 | 状态 | 可用性 |
|------|------|--------|
| **V2** | ✅ 完成 | 立即可用 |
| **Webapp** | ⚠️ 代码已改进 | 需要后端 |

---

## 💡 下一步

### 选项1：体验V2（现在就可以）
```bash
cd /Volumes/X9\ Pro/tototrip/v2
npm run dev
```
试试AI对话，看看UI改进效果！

### 选项2：增强V2功能（推荐）
添加v1的功能到v2：
- [ ] AI地点推荐卡片
- [ ] 地图集成
- [ ] 预算计算
- [ ] Supabase数据持久化

查看 `PROJECT_STATUS.md` 了解详细计划

### 选项3：修复Webapp
需要：
1. 获取或搭建GraphQL后端
2. 配置环境变量
3. 连接后端API

---

## 🔑 重要文件

- **PROJECT_STATUS.md** - 完整项目记录
- **v2/.env** - API密钥配置（已设置）
- **v2/README.md** - V2详细文档

---

## ❓ 遇到问题？

### V2不工作
1. 检查 `v2/.env` 文件存在
2. 确认API key正确
3. 重启服务器

### Webapp报错
正常！需要后端API。使用V2代替。

---

**开始体验：** `cd /Volumes/X9\ Pro/tototrip/v2 && npm run dev` 🚀
