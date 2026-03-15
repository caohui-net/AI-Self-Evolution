import { ObservationRecord } from '../types/observation';
import { Gene } from '../types/gene';
import { GDICalculator } from './gdi-calculator';

export class GeneExtractor {
  private gdiCalculator: GDICalculator;

  constructor(existingGenes: Gene[] = []) {
    this.gdiCalculator = new GDICalculator(existingGenes);
  }

  extract(observations: ObservationRecord[]): Gene[] {
    const genes: Gene[] = [];

    for (const obs of observations) {
      const gdi = this.gdiCalculator.calculate(obs, observations);

      genes.push({
        id: `gene-${obs.sessionId}-${Date.now()}`,
        pattern: `${obs.patterns.problemType}:${obs.patterns.solutionApproach}`,
        context: obs.context.techStack,
        gdi: gdi.overall,
        source: obs.projectPath,
        extractedAt: new Date().toISOString(),
        metadata: {
          reliability: gdi.reliability,
          reusability: gdi.reusability,
          impact: gdi.impact,
          evidence: obs.outcome.artifacts
        }
      });
    }

    return genes;
  }
}
