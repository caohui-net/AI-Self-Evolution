import { TechStackDetector } from '../src/observer/tech-stack-detector';
import * as fs from 'fs';
import * as path from 'path';

describe('TechStackDetector', () => {
  let detector: TechStackDetector;
  const testDir = path.join(__dirname, 'test-project');

  beforeEach(() => {
    detector = new TechStackDetector();
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  test('detects TypeScript from package.json', () => {
    const pkg = { devDependencies: { typescript: '^5.0.0' } };
    fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify(pkg));

    const stack = detector.detect(testDir);
    expect(stack).toContain('typescript');
  });

  test('detects multiple technologies', () => {
    const pkg = {
      dependencies: { react: '^18.0.0', express: '^4.0.0' },
      devDependencies: { typescript: '^5.0.0' }
    };
    fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify(pkg));

    const stack = detector.detect(testDir);
    expect(stack).toContain('react');
    expect(stack).toContain('express');
    expect(stack).toContain('typescript');
  });

  test('detects Python from requirements.txt', () => {
    fs.writeFileSync(path.join(testDir, 'requirements.txt'), 'flask==2.0.0');

    const stack = detector.detect(testDir);
    expect(stack).toContain('python');
  });

  test('detects Go from go.mod', () => {
    fs.writeFileSync(path.join(testDir, 'go.mod'), 'module example.com/app');

    const stack = detector.detect(testDir);
    expect(stack).toContain('golang');
  });

  test('returns empty array for unknown project', () => {
    const stack = detector.detect(testDir);
    expect(stack).toEqual([]);
  });
});
