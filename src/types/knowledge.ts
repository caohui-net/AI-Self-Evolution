export interface SharedKnowledge {
  source: string;        // 来源项目
  file: string;          // 原始文件路径
  timestamp: string;     // 同步时间
  content: string;       // 文件内容
  type: string;          // 文件类型
}

export interface KnowledgeStats {
  totalCount: number;
  byProject: Record<string, number>;
  byType: Record<string, number>;
}
