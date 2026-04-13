#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const toolName = process.env.TOOL_NAME || 'unknown';
const toolResult = process.env.TOOL_RESULT || '';
const sessionId = process.env.SESSION_ID || 'unknown';
const projectPath = process.cwd();

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
    success: !toolResult.toLowerCase().includes('error'),
    evidence: toolResult.slice(0, 500),
    artifacts: []
  },
  patterns: {
    problemType: inferProblemType(toolName),
    solutionApproach: toolName,
    constraints: []
  }
};

// 写入各自项目目录
const obsDir = path.join(projectPath, '.omc', 'observations');
fs.mkdirSync(obsDir, { recursive: true });
fs.writeFileSync(
  path.join(obsDir, `obs-${Date.now()}.json`),
  JSON.stringify(observation, null, 2)
);

function inferProblemType(tool) {
  if (tool.includes('Read') || tool.includes('Grep')) return 'code-reading';
  if (tool.includes('Edit') || tool.includes('Write')) return 'code-writing';
  if (tool.includes('Bash')) return 'command-execution';
  return 'general';
}
