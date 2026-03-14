import * as fs from 'fs';
import * as path from 'path';
import { SharedKnowledge, KnowledgeStats } from '../types/knowledge';

const SHARED_KNOWLEDGE_PATH = 'C:\\Users\\Administrator\\Documents\\My Project\\.shared-knowledge';

export class KnowledgeReader {
  /**
   * 读取共享知识索引
   */
  readIndex(): any {
    const indexPath = path.join(SHARED_KNOWLEDGE_PATH, 'index.json');
    return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  }

  /**
   * 读取所有共享知识
   */
  readAll(): SharedKnowledge[] {
    const discoveries: SharedKnowledge[] = [];
    const discoveryDir = path.join(SHARED_KNOWLEDGE_PATH, 'discoveries');

    const files = fs.readdirSync(discoveryDir);

    for (const file of files) {
      const filePath = path.join(discoveryDir, file);

      // 跳过目录
      if (fs.statSync(filePath).isDirectory()) continue;

      const content = fs.readFileSync(filePath, 'utf8');

      // 解析来源标记
      const sourceMatch = content.match(/<!-- 来源项目: (.+?) -->/);
      const fileMatch = content.match(/<!-- 原始文件: (.+?) -->/);
      const timeMatch = content.match(/<!-- 同步时间: (.+?) -->/);

      if (sourceMatch && fileMatch && timeMatch) {
        discoveries.push({
          source: sourceMatch[1],
          file: fileMatch[1],
          timestamp: timeMatch[1],
          content: content,
          type: path.extname(file).slice(1)
        });
      }
    }

    return discoveries;
  }

  /**
   * 按项目读取知识
   */
  readByProject(projectName: string): SharedKnowledge[] {
    return this.readAll().filter(k => k.source === projectName);
  }

  /**
   * 获取知识统计
   */
  getStats(): KnowledgeStats {
    const all = this.readAll();
    const byProject: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const k of all) {
      byProject[k.source] = (byProject[k.source] || 0) + 1;
      byType[k.type] = (byType[k.type] || 0) + 1;
    }

    return {
      totalCount: all.length,
      byProject,
      byType
    };
  }
}
