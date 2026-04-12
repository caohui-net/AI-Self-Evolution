export interface AdaptabilityScore {
  techStackMatch: number;
  problemRelevance: number;
  complexityFit: number;
  dependencyCheck: boolean;
  overallScore: number;
}

export interface ExternalMatch {
  source: 'evomap' | 'github' | 'custom';
  capsuleId: string;
  adaptabilityScore: AdaptabilityScore;
  recommendAction: 'apply' | 'adapt' | 'ignore';
}

export interface UserProfile {
  preferredTools: Record<string, number>;   // tool -> usage count
  successPatterns: string[];                // problem types with high success rate
  failurePatterns: string[];
  lastUpdated: string;
}

export interface ObservationRecord {
  projectPath: string;
  sessionId: string;
  timestamp: string;
  context: {
    task: string;
    tools: string[];
    agents: string[];
    techStack: string[];
  };
  outcome: {
    success: boolean;
    evidence: string;
    artifacts: string[];
  };
  patterns: {
    problemType: string;
    solutionApproach: string;
    constraints: string[];
  };
  externalMatches?: ExternalMatch[];
  userProfile?: UserProfile;
}
