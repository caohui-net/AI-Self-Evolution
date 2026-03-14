export interface Gene {
  id: string;
  pattern: string;
  context: string[];
  gdi: number;
  source: string;
  extractedAt: string;
}

export interface GDIScore {
  generality: number;
  diversity: number;
  impact: number;
  overall: number;
}
