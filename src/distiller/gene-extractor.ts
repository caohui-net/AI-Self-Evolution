import { ObservationRecord } from '../types/observation';
import { Gene, GDIScore } from '../types/gene';

export class GeneExtractor {
  extract(observations: ObservationRecord[]): Gene[] {
    const genes: Gene[] = [];

    for (const obs of observations) {
      if (!obs.outcome.success) continue;

      const pattern = this.extractPattern(obs);
      const gdi = this.calculateGDI(obs, observations);

      genes.push({
        id: `gene-${obs.sessionId}-${Date.now()}`,
        pattern,
        context: obs.context.techStack,
        gdi: gdi.overall,
        source: obs.projectPath,
        extractedAt: new Date().toISOString()
      });
    }

    return genes.filter(g => g.gdi > 0.5);
  }

  private extractPattern(obs: ObservationRecord): string {
    return `${obs.patterns.problemType}:${obs.patterns.solutionApproach}`;
  }

  private calculateGDI(obs: ObservationRecord, all: ObservationRecord[]): GDIScore {
    const generality = this.calcGenerality(obs, all);
    const diversity = this.calcDiversity(obs, all);
    const impact = obs.outcome.success ? 1.0 : 0.0;

    return {
      generality,
      diversity,
      impact,
      overall: (generality + diversity + impact) / 3
    };
  }

  private calcGenerality(obs: ObservationRecord, all: ObservationRecord[]): number {
    const similar = all.filter(o =>
      o.patterns.problemType === obs.patterns.problemType
    ).length;
    return Math.min(similar / 5, 1.0);
  }

  private calcDiversity(obs: ObservationRecord, all: ObservationRecord[]): number {
    const uniqueStacks = new Set(obs.context.techStack);
    const totalStacks = new Set(all.flatMap(o => o.context.techStack));
    return uniqueStacks.size / Math.max(totalStacks.size, 1);
  }
}
