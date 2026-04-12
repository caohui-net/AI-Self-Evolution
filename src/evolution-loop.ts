import { ObservationReader } from './observer/observation-reader';
import { GeneExtractor } from './distiller/gene-extractor';
import { SkillInjector } from './distributor/skill-injector';
import { TrajectoryRecorder } from './observer/trajectory-recorder';
import * as path from 'path';

const LOOP_INTERVAL = 300000; // 5分钟
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function evolutionLoop() {
  console.log('🧬 AI-Self-Evolution 进化循环');
  console.log('时间:', new Date().toLocaleString('zh-CN'));

  // Phase 1: 读取真实观察记录
  const reader = new ObservationReader(PROJECT_ROOT);
  const observations = await reader.readRecent(24);

  console.log(`📊 观察记录: ${observations.length} 条`);

  if (observations.length === 0) {
    console.log('⚠️  无观察记录，等待下一轮');
    return;
  }

  // Phase 2: 提炼 Genes
  const extractor = new GeneExtractor();
  const genes = extractor.extract(observations);
  console.log(`🧬 提炼 Genes: ${genes.length} 个`);

  // Phase 3: 记录轨迹（Batch Runner）
  const recorder = new TrajectoryRecorder(PROJECT_ROOT);
  observations.forEach((obs, i) => recorder.record(obs, i));

  // Phase 4: 分发为可执行 Skill（hermes-agent 兼容）
  const injector = new SkillInjector();
  let globalCount = 0, projectCount = 0, archivedCount = 0;

  for (const gene of genes) {
    if (gene.gdi >= 0.75) globalCount++;
    else if (gene.gdi >= 0.55) projectCount++;
    else archivedCount++;

    await injector.injectAsSkill(gene, PROJECT_ROOT);
  }

  console.log(`💉 分发: ${globalCount} 全局Skill, ${projectCount} 项目Skill, ${archivedCount} 归档`);
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
