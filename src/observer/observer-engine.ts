import * as fs from 'fs';
import * as path from 'path';
import { ObservationRecord, ExternalMatch, UserProfile } from '../types/observation';
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

    const problemType = this.inferProblemType(task);
    const userProfile = this.buildUserProfile(projectPath, tools, success, problemType);

    const record: ObservationRecord = {
      projectPath,
      sessionId,
      timestamp: new Date().toISOString(),
      context: { task, tools, agents, techStack },
      outcome: { success, evidence, artifacts },
      patterns: {
        problemType,
        solutionApproach: tools.join(','),
        constraints: []
      },
      externalMatches,
      userProfile
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

  private buildUserProfile(projectPath: string, tools: string[], success: boolean, problemType: string): UserProfile {
    const profilePath = path.join(projectPath, '.omc', 'user-profile.json');
    let profile: UserProfile = {
      preferredTools: {},
      successPatterns: [],
      failurePatterns: [],
      lastUpdated: new Date().toISOString()
    };

    if (fs.existsSync(profilePath)) {
      try { profile = JSON.parse(fs.readFileSync(profilePath, 'utf-8')); } catch {}
    }

    for (const tool of tools) {
      profile.preferredTools[tool] = (profile.preferredTools[tool] || 0) + 1;
    }

    if (success && !profile.successPatterns.includes(problemType)) {
      profile.successPatterns.push(problemType);
    } else if (!success && !profile.failurePatterns.includes(problemType)) {
      profile.failurePatterns.push(problemType);
    }

    profile.lastUpdated = new Date().toISOString();
    fs.mkdirSync(path.dirname(profilePath), { recursive: true });
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
    return profile;
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

