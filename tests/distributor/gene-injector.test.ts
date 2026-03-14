import * as fs from 'fs';
import * as path from 'path';
import { GeneInjector } from '../../src/distributor/gene-injector';
import { Gene } from '../../src/types/gene';

describe('GeneInjector', () => {
  let injector: GeneInjector;
  let testDir: string;

  beforeEach(() => {
    injector = new GeneInjector();
    testDir = path.join(__dirname, '..', '..', 'test-output');
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should inject high-quality gene globally', async () => {
    const gene: Gene = {
      id: 'test-001',
      pattern: 'Test Pattern',
      context: ['context1', 'context2'],
      gdi: 0.85,
      source: 'test-project',
      extractedAt: '2026-03-15T00:00:00Z'
    };

    await injector.injectGene(gene);

    const globalPath = path.join(
      process.env.HOME || process.env.USERPROFILE || '',
      '.claude',
      'agents',
      'learned-test-001.md'
    );

    expect(fs.existsSync(globalPath)).toBe(true);
    const content = fs.readFileSync(globalPath, 'utf-8');
    expect(content).toContain('Test Pattern');
    expect(content).toContain('0.85');

    // Cleanup
    fs.unlinkSync(globalPath);
  });

  it('should inject medium-quality gene to project', async () => {
    const gene: Gene = {
      id: 'test-002',
      pattern: 'Project Pattern',
      context: ['context1'],
      gdi: 0.7,
      source: 'test-project',
      extractedAt: '2026-03-15T00:00:00Z'
    };

    await injector.injectGene(gene, testDir);

    const projectPath = path.join(testDir, '.omc', 'genes', 'gene-test-002.json');
    expect(fs.existsSync(projectPath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
    expect(content.id).toBe('test-002');
    expect(content.gdi).toBe(0.7);
  });

  it('should skip low-quality gene', async () => {
    const gene: Gene = {
      id: 'test-003',
      pattern: 'Low Quality',
      context: [],
      gdi: 0.5,
      source: 'test-project',
      extractedAt: '2026-03-15T00:00:00Z'
    };

    await injector.injectGene(gene, testDir);

    const projectPath = path.join(testDir, '.omc', 'genes', 'gene-test-003.json');
    expect(fs.existsSync(projectPath)).toBe(false);
  });
});
