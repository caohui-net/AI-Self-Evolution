import { ObserverEngine } from '../src/observer/observer-engine';
import { MockEvomapAdapter } from '../src/adapters/mock-evomap-adapter';
import * as fs from 'fs';
import * as path from 'path';

describe('ObserverEngine Integration', () => {
  let engine: ObserverEngine;
  const testDir = path.join(__dirname, 'test-project');

  beforeEach(() => {
    engine = new ObserverEngine();
    engine.setEvomapAdapter(new MockEvomapAdapter());
    fs.mkdirSync(testDir, { recursive: true });

    const pkg = {
      dependencies: { express: '^4.0.0' },
      devDependencies: { typescript: '^5.0.0' }
    };
    fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify(pkg));
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  test('observes and matches external capsules', async () => {
    const record = await engine.observe(
      testDir,
      'session-123',
      'implement JWT authentication',
      ['edit', 'write'],
      ['executor'],
      true,
      'tests passed',
      ['auth.ts']
    );

    expect(record.context.techStack).toContain('typescript');
    expect(record.externalMatches).toBeDefined();
    expect(record.externalMatches!.length).toBeGreaterThan(0);

    const authMatch = record.externalMatches!.find(m => m.capsuleId === 'cap-001');
    expect(authMatch).toBeDefined();
    expect(authMatch!.recommendAction).toBe('apply');
  });

  test('saves observation to disk', async () => {
    await engine.observe(
      testDir,
      'session-456',
      'add API retry',
      ['edit'],
      ['executor'],
      true,
      'working',
      []
    );

    const obsDir = path.join(testDir, '.omc', 'evolution', 'observations');
    expect(fs.existsSync(obsDir)).toBe(true);
    const files = fs.readdirSync(obsDir);
    expect(files.length).toBe(1);
  });

  test('works without evomap adapter', async () => {
    const engineNoAdapter = new ObserverEngine();

    const record = await engineNoAdapter.observe(
      testDir,
      'session-789',
      'test task',
      ['read'],
      [],
      true,
      'done',
      []
    );

    expect(record.externalMatches).toEqual([]);
  });

  test('filters out ignore recommendations', async () => {
    const record = await engine.observe(
      testDir,
      'session-999',
      'unrelated task',
      ['bash'],
      [],
      false,
      'failed',
      []
    );

    const ignoreMatches = record.externalMatches?.filter(m => m.recommendAction === 'ignore');
    expect(ignoreMatches?.length || 0).toBe(0);
  });
});

