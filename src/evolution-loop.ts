import { KnowledgeReader } from './consumer/knowledge-reader';
import { GeneExtractor } from './distiller/gene-extractor';
import { GeneInjector } from './distributor/gene-injector';
import { ObservationRecord } from './types/observation';

const LOOP_INTERVAL = 300000; // 5分钟

async function evolutionLoop() {
  console.log('🧬 AI-Self-Evolution 进化循环');
  console.log('时间:', new Date().toLocaleString('zh-CN'));

  // Phase 1: 读取共享知识
  const reader = new KnowledgeReader();
  const knowledge = reader.readAll();
  const stats = reader.getStats();

  console.log(`📚 共享知识: ${stats.totalCount} 条`);
  console.log('📊 分布:', JSON.stringify(stats.byProject));

  // Phase 2: 提炼 Genes（模拟观察记录）
  const observations: ObservationRecord[] = knowledge.slice(0, 10).map((k, i) => ({
    sessionId: `session-${Date.now()}-${i}`,
    timestamp: k.timestamp,
    projectPath: k.source,
    context: {
      task: 'knowledge-sharing',
      tools: ['sync-knowledge'],
      agents: ['auto-sync'],
      techStack: ['typescript', 'node']
    },
    patterns: {
      problemType: 'knowledge-sharing',
      solutionApproach: 'auto-sync',
      constraints: []
    },
    outcome: {
      success: true,
      evidence: 'synced',
      artifacts: [k.file]
    }
  }));

  const extractor = new GeneExtractor();
  const genes = extractor.extract(observations);
  console.log(`🧬 提炼 Genes: ${genes.length} 个`);

  // Phase 3: 分发 Genes
  const injector = new GeneInjector();
  for (const gene of genes) {
    await injector.injectGene(gene, gene.source);
  }
  console.log(`💉 分发完成`);
  console.log('✅ 本轮完成\n');
}

async function main() {
  while (true) {
    try {
      await evolutionLoop();
    } catch (error) {
      console.error('❌ 错误:', error);
    }
    await new Promise(resolve => setTimeout(resolve, LOOP_INTERVAL));
  }
}

main();
