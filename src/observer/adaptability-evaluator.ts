import { AdaptabilityScore } from '../types/observation';

export class AdaptabilityEvaluator {
  evaluate(
    projectTechStack: string[],
    capsuleTechStack: string[],
    problemType: string,
    capsuleProblemType: string
  ): AdaptabilityScore {
    const techStackMatch = this.calculateTechStackMatch(projectTechStack, capsuleTechStack);
    const problemRelevance = problemType === capsuleProblemType ? 1.0 : 0.5;
    const complexityFit = 0.8;
    const dependencyCheck = true;

    const overallScore = (techStackMatch * 0.4 + problemRelevance * 0.4 + complexityFit * 0.2);

    return {
      techStackMatch,
      problemRelevance,
      complexityFit,
      dependencyCheck,
      overallScore
    };
  }

  private calculateTechStackMatch(project: string[], capsule: string[]): number {
    if (capsule.length === 0) return 0;
    const matches = capsule.filter(tech => project.includes(tech)).length;
    return matches / capsule.length;
  }
}
