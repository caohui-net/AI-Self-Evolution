# EvoMap.ai 平台调研报告

**调研日期：** 2026-03-14
**状态：** 测试期

---

## 一、平台概况

EvoMap.ai 是一个**社区驱动的 AI 能力共享平台**，采用 Credit 积分系统。

**核心特点：**
- 基于 GEP 协议的 Gene/Capsule 共享
- Credit 积分经济体系
- 社区贡献激励机制
- 目前处于测试期（暂无付费充值）

---

## 二、Credit 系统

### 2.1 账户等级

| 等级 | 费用 | 当前状态 |
|------|------|---------|
| Free | 0 credits | ✓ 当前 |
| Premium | 2000 credits/月 | 需要 1800 credits |

**当前余额：** 200 credits

### 2.2 获取 Credits 途径

**一次性奖励：**
- 注册账号：+100 credits ✓
- 首次连接节点：+50 credits（待完成）

**持续性收入：**
- 回答 Bounties 悬赏：按悬赏金额（最快途径）
- 发布资产被推广：+100 credits
- 资产被复用：+5 credits/次（被动收入）
- 提交验证报告：+20 credits

---

## 三、API 访问情况

### 3.1 当前限制

**Free Plan 限制：**
- 可能无法访问完整 API
- 需要升级到 Premium（2000 credits/月）

### 3.2 节点连接

**技能指南获取：**
```bash
curl -s https://evomap.ai/skill.md
```

**节点注册：**
- 发送 hello 消息注册节点
- 立即获得 +50 credits

---

## 四、对本项目的影响

### 4.1 短期策略（当前）

**暂不依赖 EvoMap API：**
- 使用 MockEvomapAdapter
- 专注内部观察和提炼
- 从自己项目积累 Gene

### 4.2 中期策略（积累 Credits）

**快速获取 Credits：**
1. 连接节点：+50 credits（立即可做）
2. 回答 Bounties：多答多得
3. 发布高质量 Capsule：+100 credits + 持续收益

**目标：** 积累到 2000 credits，升级 Premium

### 4.3 长期策略（API 集成）

**Premium 解锁后：**
- 实现真实 EvomapAdapter
- 同步社区 Gene/Capsule
- 双向贡献（上传 + 下载）

---

## 五、建议行动

### 立即可做（+50 credits）
```bash
# 1. 获取技能指南
curl -s https://evomap.ai/skill.md

# 2. 注册节点（发送 hello）
# 具体步骤见技能指南
```

### 短期目标（+1800 credits）
1. 回答 Bounties 悬赏
2. 发布本项目的 Gene/Capsule
3. 参与社区验证

### 长期目标
- 升级到 Premium
- 实现完整 API 集成
- 建立双向能力共享

---

## 六、技术实现调整

### 保留的设计
- ✓ EvomapAdapter 接口
- ✓ 适配性评估算法
- ✓ 本地缓存机制

### 推迟的实现
- ❌ 真实 API 集成（等 Premium）
- ❌ 自动同步机制（等 API 访问）

### 当前方案
- ✓ 使用 Mock 适配器
- ✓ 专注内部提炼
- ✓ 构建独立能力库

---

**结论：**
EvoMap.ai 是有价值的平台，但需要先积累 Credits。
当前阶段专注于内部能力积累，待升级 Premium 后再集成外部 API。
