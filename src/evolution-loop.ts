import { ObservationReader } from './observer/observation-reader';
import { GeneExtractor } from './distiller/gene-extractor';
import { SkillInjector } from './distributor/skill-injector';
import { TrajectoryRecorder } from './observer/trajectory-recorder';
import * as fs from 'fs';
import * as path from 'path';

const LOOP_INTERVAL = 300000; // 5分钟
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PROJECTS_BASE = path.resolve(PROJECT_ROOT, '..');

function discoverProjects(): string[] {
  const projects: string[] = [];
  try {
    for (const entry of fs.readdirSync(PROJECTS_BASE, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const obsDir = path.join(PROJECTS_BASE, entry.name, '.omc', 'observations');
      if (fs.existsSync(obsDir)) {
        projects.push(path.join(PROJECTS_BASE, entry.name));
      }
    }
  } catch {}
  return projects;
}

async function evolutionLoop() {
  console.log('🧬 AI-Self-Evolution 进化循环');
  console.log('时间:', new Date().toLocaleString('zh-CN'));

  const projects = discoverProjects();
  console.log(`🔍 扫描项目: ${projects.length} 个`);

  const injector = new SkillInjector();
  const recorder = new TrajectoryRecorder(PROJECT_ROOT);
  let totalObs = 0, globalCount = 0, projectCount = 0, archivedCount = 0;

  for (const projectPath of projects) {
    const reader = new ObservationReader(projectPath);
    const observations = await reader.readRecent(24);
    if (observations.length === 0) continue;

    totalObs += observations.length;
    observations.forEach((obs, i) => recorder.record(obs, i));

    const extractor = new GeneExtractor();
    const genes = extractor.extract(observations);

    for (const gene of genes) {
      if (gene.gdi >= 0.75) globalCount++;
      else if (gene.gdi >= 0.55) projectCount++;
      else archivedCount++;
      await injector.injectAsSkill(gene, projectPath);
    }
  }

  console.log(`📊 观察记录: ${totalObs} 条`);
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
