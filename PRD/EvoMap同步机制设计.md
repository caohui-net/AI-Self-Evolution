# EvoMap 同步机制技术方案

**版本：** v1.1
**日期：** 2026-03-14
**状态：** 设计阶段（待 Premium 账户）

---

## 重要说明

**EvoMap.ai 实际情况：**
- 采用 Credit 积分系统
- Free Plan 可能无完整 API 访问
- Premium Plan 需要 2000 credits/月
- 当前余额：200 credits（需积累 1800）

**当前策略：**
- 使用 MockEvomapAdapter
- 专注内部观察和提炼
- 待升级 Premium 后实现真实 API

详见：`PRD/EvoMap平台调研.md`

---

## 一、架构概览

```
┌─────────────────────────────────────────────────────────┐
│  AI-Self-Evolution (本地)                                │
│  ├── EvomapAdapter (适配器层)                            │
│  │   ├── fetchCapsules() - 拉取胶囊                     │
│  │   └── syncToLocal() - 本地存储                       │
│  │                                                       │
│  ├── CapsuleCache (缓存层)                               │
│  │   ├── .omc/evolution/external/evomap/               │
│  │   └── 24小时过期策略                                  │
│  │                                                       │
│  └── AdaptabilityEvaluator (评估层)                      │
│      └── 技术栈匹配 + 问题相关性                          │
└─────────────────────────────────────────────────────────┘
           ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│  EvoMap.ai API (远程)                                    │
│  ├── GET /api/capsules - 获取胶囊列表                    │
│  ├── GET /api/capsules/:id - 获取单个胶囊                │
│  └── 认证：API Key (环境变量)                            │
└─────────────────────────────────────────────────────────┘
```

---

## 二、数据模型

### 2.1 EvoCapsule 结构

```typescript
interface EvoCapsule {
  id: string;              // 胶囊唯一标识
  name: string;            // 胶囊名称
  description: string;     // 功能描述
  techStack: string[];     // 技术栈标签
  problemType: string;     // 问题类型
  strategy: string;        // 解决策略
  version: string;         // 版本号
  author: string;          // 作者
  successRate: number;     // 历史成功率
  usageCount: number;      // 使用次数
  createdAt: string;       // 创建时间
  updatedAt: string;       // 更新时间
}
```

---

## 三、同步策略

### 3.1 拉取模式（Pull-based）

**触发时机：**
1. 项目首次初始化时
2. 每24小时自动同步一次
3. 用户手动触发同步
4. 观察到新问题类型时

**同步流程：**
```
1. 检查本地缓存是否过期
2. 发送 GET /api/capsules 请求
3. 对比本地版本号
4. 下载新增/更新的胶囊
5. 存储到 .omc/evolution/external/evomap/
6. 更新索引文件
```

### 3.2 增量同步

**版本控制：**
- 本地维护 `sync-manifest.json` 记录已同步胶囊
- 每次只拉取 `updatedAt > lastSyncTime` 的胶囊
- 减少网络传输和存储开销

---

## 四、缓存策略

### 4.1 本地存储结构

```
.omc/evolution/external/
├── evomap/
│   ├── capsules/
│   │   ├── auth-jwt-v1.json
│   │   ├── api-retry-v2.json
│   │   └── ...
│   ├── index.json          # 胶囊索引
│   └── sync-manifest.json  # 同步清单
└── github/                 # 未来扩展
```

### 4.2 过期策略

- **缓存时长：** 24小时
- **过期检查：** 每次观察前检查
- **强制刷新：** 用户可手动触发

---

## 五、API 集成

### 5.1 认证方式

```typescript
// 环境变量
EVOMAP_API_KEY=your_api_key_here
EVOMAP_API_URL=https://api.evomap.ai
```

### 5.2 错误处理

| 错误类型 | HTTP状态码 | 处理策略 |
|---------|-----------|---------|
| 网络超时 | - | 使用本地缓存 |
| 认证失败 | 401 | 提示用户配置API Key |
| 限流 | 429 | 指数退避重试 |
| 服务不可用 | 503 | 降级到本地模式 |

---

## 六、实现计划

### Phase 1.1: Mock 适配器（本周）
- [ ] 实现 MockEvomapAdapter
- [ ] 返回3个示例胶囊
- [ ] 集成到 ObserverEngine
- [ ] 编写单元测试

### Phase 1.2: 真实 API 集成（下周）
- [ ] 实现 HttpEvomapAdapter
- [ ] API 认证和错误处理
- [ ] 增量同步逻辑
- [ ] 缓存管理

---

## 七、成功标准

- [ ] 同步延迟 < 5秒
- [ ] 缓存命中率 > 90%
- [ ] API 失败时自动降级
- [ ] 测试覆盖率 ≥ 80%

