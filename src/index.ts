import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { KnowledgeReader } from './consumer/knowledge-reader';
import { GeneExtractor } from './distiller/gene-extractor';

dotenv.config();

const LOOP_INTERVAL = parseInt(process.env.LOOP_INTERVAL_MS || '60000');

async function runEvolutionLoop() {
  console.log(`[${new Date().toISOString()}] 启动进化循环...`);

  try {
    const sharedPath = process.env.SHARED_KNOWLEDGE_PATH;
    if (!sharedPath || !fs.existsSync(sharedPath)) {
      console.log('共享知识目录不存在，跳过本轮');
      return;
    }

    const reader = new KnowledgeReader();
    const stats = reader.getStats();
    console.log(`读取到 ${stats.totalCount} 条共享知识`);

    if (stats.totalCount === 0) {
      console.log('暂无新知识，等待下一轮');
      return;
    }

    console.log('进化循环完成');
  } catch (error) {
    console.error('进化循环出错:', error);
  }
}

async function main() {
  console.log('AI-Self-Evolution 自动学习循环已启动');
  console.log(`循环间隔: ${LOOP_INTERVAL}ms`);

  await runEvolutionLoop();

  setInterval(async () => {
    await runEvolutionLoop();
  }, LOOP_INTERVAL);
}

main().catch(console.error);
