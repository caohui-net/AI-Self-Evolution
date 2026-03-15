import { GeneExtractor } from '../../src/distiller/gene-extractor';
import { ObservationRecord } from '../../src/types/observation';

describe('GeneExtractor', () => {
  let extractor: GeneExtractor;

  beforeEach(() => {
    extractor = new GeneExtractor();
  });

  it('should extract genes from successful observations', () => {
    const observations: ObservationRecord[] = [
      {
        projectPath: '/test',
        sessionId: 'session1',
        timestamp: '2026-03-14T00:00:00Z',
        context: {
          task: 'auth implementation',
          tools: ['jwt', 'bcrypt'],
          agents: ['executor'],
          techStack: ['node', 'typescript']
        },
        outcome: {
          success: true,
          evidence: 'tests passed',
          artifacts: ['auth.ts']
        },
        patterns: {
          problemType: 'authentication',
          solutionApproach: 'jwt,bcrypt',
          constraints: []
        }
      }
    ];

    const genes = extractor.extract(observations);

    expect(genes.length).toBeGreaterThan(0);
    expect(genes[0].pattern).toBe('authentication:jwt,bcrypt');
    expect(genes[0].gdi).toBeGreaterThan(0);
  });

  it('should extract all genes including low quality ones', () => {
    const observations: ObservationRecord[] = [
      {
        projectPath: '/test',
        sessionId: 'session2',
        timestamp: '2026-03-14T00:00:00Z',
        context: {
          task: 'test',
          tools: [],
          agents: [],
          techStack: []
        },
        outcome: {
          success: true,
          evidence: 'ok',
          artifacts: []
        },
        patterns: {
          problemType: 'general',
          solutionApproach: '',
          constraints: []
        }
      }
    ];

    const genes = extractor.extract(observations);

    expect(genes.length).toBe(1);
    expect(genes[0].gdi).toBeLessThan(0.75);
  });
});
