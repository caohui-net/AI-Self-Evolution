import { KnowledgeReader } from '../src/consumer/knowledge-reader';

describe('KnowledgeReader', () => {
  const reader = new KnowledgeReader();

  test('should read knowledge index', () => {
    const index = reader.readIndex();
    expect(index).toHaveProperty('projects');
    expect(index).toHaveProperty('updated');
  });

  test('should read all shared knowledge', () => {
    const knowledge = reader.readAll();
    expect(knowledge.length).toBeGreaterThan(0);
    expect(knowledge[0]).toHaveProperty('source');
    expect(knowledge[0]).toHaveProperty('content');
  });

  test('should get knowledge stats', () => {
    const stats = reader.getStats();
    expect(stats.totalCount).toBeGreaterThan(0);
    expect(stats.byProject).toHaveProperty('EvoMap-Integration');
  });

  test('should read knowledge by project', () => {
    const evomap = reader.readByProject('EvoMap-Integration');
    expect(evomap.length).toBeGreaterThan(0);
    expect(evomap[0].source).toBe('EvoMap-Integration');
  });
});
