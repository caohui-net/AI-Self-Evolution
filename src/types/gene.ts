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
