# AI Self-Evolution System

基于 GEP (Genome Evolution Protocol) 的 AI Agent 自主进化系统

## 项目简介

本项目实现了一个开源的 AI 自主进化框架，灵感来自 EvoMap.ai 和 Test-Time Training 理论。通过结构化的知识编码（Gene）和经验封装（Capsule），使 AI Agent 能够：

- 🧬 **自我诊断**：检测运行时信号，识别改进机会
- 🔄 **自主进化**：根据反馈自动优化策略
- 📦 **知识共享**：封装成功经验，跨 Agent 复用
- 🎯 **持续学习**：积累历史经验，避免重复错误

## 核心特性

### 已实现功能

- ✅ **三层架构**：观察层 → 提炼层 → 分发层
- ✅ **真实Hook集成**：PostToolUse Hook 自动捕获工具使用观察
- ✅ **研究驱动GDI**：Reliability(40%) + Reusability(30%) + Impact(30%)
- ✅ **分级分发**：
  - 高质量 (GDI ≥ 0.75) → 全局 ~/.claude/agents/
  - 中等质量 (0.55-0.75) → 项目 .omc/genes/
  - 低质量 (< 0.55) → 归档 .omc/observations/archived/
- ✅ **自主运行**：5 分钟循环，基于真实观察生成Genes
- ✅ **测试覆盖**：24 个测试全部通过

### 计划中功能

- 🚧 **EvoMap 集成**：外部胶囊库同步（代码已预留）

## 快速开始

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 运行测试
npm test

# 启动进化循环（后台运行）
npm run auto
```

## 运行状态

系统当前自主运行中：
- **观察来源**: PostToolUse Hook 实时捕获
- **GDI评分**: 研究驱动的三维评分系统
- **循环频率**: 每 5 分钟
- **测试状态**: 24/24 通过
- **最新更新**: 2026-03-15 真实Hook集成完成

## 项目结构

```
AI-Self-Evolution/
├── PRD/                    # 产品需求文档
│   └── 项目调研报告.md
├── docs/                   # 技术文档
├── src/                    # 源代码
├── tests/                  # 测试文件
├── examples/               # 示例代码
└── README.md
```

## 技术栈

- **语言**：TypeScript / Node.js
- **协议**：GEP (Genome Evolution Protocol)
- **存储**：JSONL (本地文件系统)
- **AI**：OpenAI / Anthropic / Google Gemini

## 文档

- [项目调研报告](./PRD/项目调研报告.md)
- [GEP 协议规范](./docs/gep-protocol.md) (待完成)
- [架构设计](./docs/architecture.md) (待完成)
- [开发指南](./docs/development.md) (待完成)

## 参考项目

- [EvoMap.ai](https://evomap.ai) - AI 自我进化基础设施
- [Test-Time Training](https://test-time-training.github.io/) - 理论基础

## 开发状态

✅ **当前阶段：** 真实Hook集成完成，系统基于实际观察自主进化

- [x] 项目调研
- [x] 架构设计（三层架构：观察-提炼-分发）
- [x] 核心引擎开发（Phase 1-3 完成）
- [x] 观察引擎（ObservationReader 读取真实Hook捕获）
- [x] Gene 提炼引擎（研究驱动的GDI评分系统）
- [x] Gene 分发引擎（三级分发：全局/项目/归档）
- [x] 进化循环调度器（5分钟自主运行）
- [x] PostToolUse Hook 实时观察集成
- [x] 测试覆盖（24/24 通过）
- [ ] EvoMap 外部胶囊库集成
- [ ] CLI 工具
- [ ] 文档完善

## 贡献

欢迎贡献代码、文档或建议！

## 许可证

MIT License

## 联系方式

- GitHub Issues: [提交问题](https://github.com/yourusername/AI-Self-Evolution/issues)
- Email: your.email@example.com

---

**灵感来源：** EvoMap.ai | **理论基础：** Test-Time Training (UC Berkeley)
