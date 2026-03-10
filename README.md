# AI Self-Evolution System

基于 GEP (Genome Evolution Protocol) 的 AI Agent 自主进化系统

## 项目简介

本项目实现了一个开源的 AI 自主进化框架，灵感来自 EvoMap.ai 和 Test-Time Training 理论。通过结构化的知识编码（Gene）和经验封装（Capsule），使 AI Agent 能够：

- 🧬 **自我诊断**：检测运行时信号，识别改进机会
- 🔄 **自主进化**：根据反馈自动优化策略
- 📦 **知识共享**：封装成功经验，跨 Agent 复用
- 🎯 **持续学习**：积累历史经验，避免重复错误

## 核心特性

- ✅ **GEP 协议实现**：完整的基因组进化协议
- ✅ **七阶段生命周期**：Detect → Select → Mutate → Hypothesize → Execute → Evaluate → Solidify
- ✅ **记忆图机制**：因果记忆，经验驱动决策
- ✅ **内容可寻址**：SHA-256 哈希，确保完整性
- ✅ **可移植性**：.gepx 档案格式，跨平台迁移

## 快速开始

```bash
# 克隆项目
git clone https://github.com/yourusername/AI-Self-Evolution.git
cd AI-Self-Evolution

# 安装依赖
npm install

# 运行示例
npm run example
```

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

🚧 **当前阶段：** 项目调研完成，准备进入架构设计阶段

- [x] 项目调研
- [ ] 架构设计
- [ ] 核心引擎开发
- [ ] CLI 工具
- [ ] 文档完善
- [ ] MVP 发布

## 贡献

欢迎贡献代码、文档或建议！

## 许可证

MIT License

## 联系方式

- GitHub Issues: [提交问题](https://github.com/yourusername/AI-Self-Evolution/issues)
- Email: your.email@example.com

---

**灵感来源：** EvoMap.ai | **理论基础：** Test-Time Training (UC Berkeley)
