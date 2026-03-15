import { ObservationRecord, Gene } from '../types';

export interface GDIScore {
  reliability: number;
  reusability: number;
  impact: number;
  overall: number;
}

export class GDICalculator {
  private existingGenes: Gene[];

  constructor(existingGenes: Gene[] = []) {
    this.existingGenes = existingGenes;
  }

  calculate(obs: ObservationRecord, allObs: ObservationRecord[]): GDIScore {
    const reliability = this.calcReliability(obs);
    const reusability = this.calcReusability(obs, allObs);
    const impact = this.calcImpact(obs);

    return {
      reliability,
      reusability,
      impact,
      overall: (reliability * 0.4) + (reusability * 0.3) + (impact * 0.3)
    };
  }

  private calcReliability(obs: ObservationRecord): number {
    const evidenceQuality = obs.outcome.artifacts.length > 0 ? 1.0 :
                           obs.outcome.evidence ? 0.5 : 0.0;

    const consistencyScore = this.checkConsistency(obs);

    const outcomeValidation = obs.outcome.success &&
                             obs.outcome.artifacts.length > 0 ? 1.0 : 0.5;

    return (evidenceQuality * 0.4) + (consistencyScore * 0.3) + (outcomeValidation * 0.3);
  }

  private checkConsistency(obs: ObservationRecord): number {
    const pattern = `${obs.patterns.problemType}:${obs.patterns.solutionApproach}`;
    const matchingGenes = this.existingGenes.filter(g => g.pattern === pattern);
    if (matchingGenes.length === 0) return 1.0;

    const contradictions = matchingGenes.filter(g =>
      g.context.some((t: string) => !obs.context.techStack.includes(t))
    );
    return 1.0 - (contradictions.length / matchingGenes.length) * 0.5;
  }

  private calcReusability(obs: ObservationRecord, allObs: ObservationRecord[]): number {
    const patternGenerality = this.calcPatternGenerality(obs, allObs);
    const solutionDiversity = this.calcSolutionDiversity(obs, allObs);
    const contextClarity = obs.patterns.constraints.length > 0 ? 1.0 : 0.5;
    return (patternGenerality * 0.5) + (solutionDiversity * 0.3) + (contextClarity * 0.2);
  }

  private calcPatternGenerality(obs: ObservationRecord, allObs: ObservationRecord[]): number {
    const sameApproach = allObs.filter(o =>
      o.patterns.solutionApproach === obs.patterns.solutionApproach
    );
    const uniqueProblems = new Set(sameApproach.map(o => o.patterns.problemType)).size;
    return Math.min(uniqueProblems / 3, 1.0);
  }

  private calcSolutionDiversity(obs: ObservationRecord, allObs: ObservationRecord[]): number {
    const sameProblem = allObs.filter(o =>
      o.patterns.problemType === obs.patterns.problemType
    );
    const uniqueSolutions = new Set(sameProblem.map(o => o.patterns.solutionApproach)).size;
    const thisApproachCount = sameProblem.filter(o =>
      o.patterns.solutionApproach === obs.patterns.solutionApproach
    ).length;
    return uniqueSolutions > 1 ? 1.0 - (thisApproachCount / sameProblem.length) * 0.5 : 0.5;
  }

  private calcImpact(obs: ObservationRecord): number {
    const complexityHandled = obs.outcome.artifacts.length > 3 ? 1.0 :
                              obs.outcome.artifacts.length > 1 ? 0.7 : 0.4;
    const efficiencyGain = obs.context.tools.length > 2 ? 0.8 : 0.5;
    const scopeOfChange = Math.min(obs.outcome.artifacts.length / 5, 1.0);
    return (complexityHandled * 0.4) + (efficiencyGain * 0.3) + (scopeOfChange * 0.3);
  }
}
