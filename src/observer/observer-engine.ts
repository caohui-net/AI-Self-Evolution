import * as fs from 'fs';
import * as path from 'path';
import { ObservationRecord, ExternalMatch } from '../types/observation';
import { TechStackDetector } from './tech-stack-detector';
import { AdaptabilityEvaluator } from './adaptability-evaluator';
import { EvomapAdapter, EvoCapsule } from '../adapters/evomap-adapter';

export class ObserverEngine {
  private techStackDetector: TechStackDetector;
  private adaptabilityEvaluator: AdaptabilityEvaluator;
  private evomapAdapter: EvomapAdapter | null = null;

  constructor() {
    this.techStackDetector = new TechStackDetector();
    this.adaptabilityEvaluator = new AdaptabilityEvaluator();
  }

  setEvomapAdapter(adapter: EvomapAdapter): void {
    this.evomapAdapter = adapter;
  }

  async observe(
    projectPath: string,
    sessionId: string,
    task: string,
    tools: string[],
    agents: string[],
    success: boolean,
    evidence: string,
    artifacts: string[]
  ): Promise<ObservationRecord> {
    const techStack = this.techStackDetector.detect(projectPath);
    const externalMatches = await this.matchExternalCapsules(techStack, task);

    const record: ObservationRecord = {
      projectPath,
      sessionId,
      timestamp: new Date().toISOString(),
      context: { task, tools, agents, techStack },
      outcome: { success, evidence, artifacts },
      patterns: {
        problemType: this.inferProblemType(task),
        solutionApproach: tools.join(','),
        constraints: []
      },
      externalMatches
    };

    await this.saveObservation(projectPath, record);
    return record;
  }

  private async matchExternalCapsules(techStack: string[], task: string): Promise<ExternalMatch[]> {
    if (!this.evomapAdapter) return [];

    const capsules = await this.evomapAdapter.fetchCapsules();
    const matches: ExternalMatch[] = [];

    for (const capsule of capsules) {
      const score = this.adaptabilityEvaluator.evaluate(
        techStack,
        capsule.techStack,
        this.inferProblemType(task),
        capsule.problemType
      );

      matches.push({
        source: 'evomap',
        capsuleId: capsule.id,
        adaptabilityScore: score,
        recommendAction: score.overallScore > 0.7 ? 'apply' : score.overallScore > 0.5 ? 'adapt' : 'ignore'
      });
    }

    return matches.filter(m => m.recommendAction !== 'ignore');
  }

  private inferProblemType(task: string): string {
    if (task.includes('auth')) return 'authentication';
    if (task.includes('api')) return 'api-integration';
    return 'general';
  }

  private async saveObservation(projectPath: string, record: ObservationRecord): Promise<void> {
    const dir = path.join(projectPath, '.omc', 'evolution', 'observations');
    fs.mkdirSync(dir, { recursive: true });
    const filename = `${record.sessionId}-${Date.now()}.json`;
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(record, null, 2));
  }
}

