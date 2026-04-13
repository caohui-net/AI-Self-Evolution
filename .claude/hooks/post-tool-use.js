#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 从环境变量获取工具调用信息
const toolName = process.env.TOOL_NAME || 'unknown';
const toolArgs = process.env.TOOL_ARGS || '{}';
const toolResult = process.env.TOOL_RESULT || '';
const sessionId = process.env.SESSION_ID || 'unknown';
const projectPath = process.cwd();

// 构造观察记录
const observation = {
  projectPath,
  sessionId,
  timestamp: new Date().toISOString(),
  context: {
    task: `Tool: ${toolName}`,
    tools: [toolName],
    agents: [],
    techStack: []
  },
  outcome: {
    success: !toolResult.includes('error'),
    evidence: toolResult.slice(0, 500),
    artifacts: []
  },
  patterns: {
    problemType: inferProblemType(toolName),
    solutionApproach: toolName,
    constraints: []
  }
};

// 保存到 .omc/observations/
const obsDir = path.join(projectPath, '.omc', 'observations');
fs.mkdirSync(obsDir, { recursive: true });

const filename = `obs-${Date.now()}.json`;
fs.writeFileSync(
  path.join(obsDir, filename),
  JSON.stringify(observation, null, 2)
);

function inferProblemType(tool) {
  if (tool.includes('Read') || tool.includes('Grep')) return 'code-reading';
  if (tool.includes('Edit') || tool.includes('Write')) return 'code-writing';
  if (tool.includes('Bash')) return 'command-execution';
  return 'general';
}
