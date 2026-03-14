import * as fs from 'fs';
import * as path from 'path';

export class TechStackDetector {
  detect(projectPath: string): string[] {
    const stack: Set<string> = new Set();

    if (fs.existsSync(path.join(projectPath, 'package.json'))) {
      const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps['react']) stack.add('react');
      if (deps['vue']) stack.add('vue');
      if (deps['express']) stack.add('express');
      if (deps['typescript']) stack.add('typescript');
    }

    if (fs.existsSync(path.join(projectPath, 'requirements.txt'))) {
      stack.add('python');
    }

    if (fs.existsSync(path.join(projectPath, 'go.mod'))) {
      stack.add('golang');
    }

    return Array.from(stack);
  }
}
