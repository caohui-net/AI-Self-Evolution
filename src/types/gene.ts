export interface Gene {
  id: string;
  pattern: string;
  context: string[];
  gdi: number;
  source: string;
  extractedAt: string;
  metadata?: {
    reliability: number;
    reusability: number;
    impact: number;
    evidence: string[];
  };
}

export interface GDIScore {
  reliability: number;
  reusability: number;
  impact: number;
  overall: number;
}

// hermes-agent SKILL.md 兼容的可执行基因
export interface ExecutableGene extends Gene {
  skill: {
    name: string;           // slug, max 64 chars
    description: string;    // max 1024 chars
    version: string;
    triggers: {
      fallback_for_tools?: string[];
      requires_tools?: string[];
    };
    instructions: string;   // SKILL.md body content
    improvementCount: number;
  };
}
