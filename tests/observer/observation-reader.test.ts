import { ObservationReader } from '../../src/observer/observation-reader';
import * as fs from 'fs';
import * as path from 'path';

describe('ObservationReader', () => {
  const testDir = path.join(__dirname, '../../.omc/observations');
  const testFile = path.join(testDir, `obs-${Date.now()}.json`);

  beforeAll(() => {
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(testFile, JSON.stringify({
      sessionId: 'test-session',
      timestamp: new Date().toISOString(),
      projectPath: 'test-project',
      context: {
        task: 'test-task',
        tools: ['Read'],
        agents: [],
        techStack: ['typescript']
      },
      patterns: {
        problemType: 'analysis',
        solutionApproach: 'Read',
        constraints: []
      },
      outcome: {
        success: true,
        evidence: 'Read',
        artifacts: ['test.ts']
      }
    }));
  });

  afterAll(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  it('should read recent observations', async () => {
    const reader = new ObservationReader(path.join(__dirname, '../..'));
    const observations = await reader.readRecent(24);

    expect(observations.length).toBeGreaterThan(0);
    expect(observations[0].sessionId).toBe('test-session');
  });
});
