import * as fs from 'fs';
import * as path from 'path';
import { Gene } from '../types/gene';

export class GeneInjector {
  private readonly globalPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.claude');

  async injectGene(gene: Gene, projectPath?: string): Promise<void> {
    if (gene.gdi > 0.8) {
      await this.injectGlobal(gene);
    } else if (gene.gdi >= 0.6 && projectPath) {
      await this.injectProject(gene, projectPath);
    }
  }

  private async injectGlobal(gene: Gene): Promise<void> {
    const targetDir = path.join(this.globalPath, 'agents');
    fs.mkdirSync(targetDir, { recursive: true });

    const filename = `learned-${gene.id}.md`;
    const content = this.formatGeneAsAgent(gene);

    fs.writeFileSync(path.join(targetDir, filename), content, 'utf-8');
  }

  private async injectProject(gene: Gene, projectPath: string): Promise<void> {
    const targetDir = path.join(projectPath, '.omc', 'genes');
    fs.mkdirSync(targetDir, { recursive: true });

    const filename = `gene-${gene.id}.json`;
    fs.writeFileSync(
      path.join(targetDir, filename),
      JSON.stringify(gene, null, 2),
      'utf-8'
    );
  }

  private formatGeneAsAgent(gene: Gene): string {
    return `# ${gene.pattern}

## Context
${gene.context.join('\n')}

## Quality Score (GDI)
${gene.gdi.toFixed(2)}

## Source
${gene.source}

## Extracted
${gene.extractedAt}
`;
  }
}
