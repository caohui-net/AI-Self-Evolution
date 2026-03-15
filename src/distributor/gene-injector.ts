import * as fs from 'fs';
import * as path from 'path';
import { Gene } from '../types/gene';

export class GeneInjector {
  private readonly globalPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.claude');

  async injectGene(gene: Gene, projectPath?: string): Promise<void> {
    if (gene.gdi >= 0.75) {
      await this.injectGlobal(gene);
    } else if (gene.gdi >= 0.55 && projectPath) {
      await this.injectProject(gene, projectPath);
    } else if (projectPath) {
      await this.archiveGene(gene, projectPath);
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
    const metadata = gene.metadata ? `
## Quality Breakdown
- Reliability: ${gene.metadata.reliability.toFixed(2)}
- Reusability: ${gene.metadata.reusability.toFixed(2)}
- Impact: ${gene.metadata.impact.toFixed(2)}

## Evidence
${gene.metadata.evidence.join('\n')}
` : '';

    return `# ${gene.pattern}

## Context
${gene.context.join('\n')}

## Quality Score (GDI)
${gene.gdi.toFixed(2)}
${metadata}
## Source
${gene.source}

## Extracted
${gene.extractedAt}
`;
  }

  private async archiveGene(gene: Gene, projectPath: string): Promise<void> {
    const targetDir = path.join(projectPath, '.omc', 'observations', 'archived');
    fs.mkdirSync(targetDir, { recursive: true });

    const filename = `archived-${gene.id}.json`;
    fs.writeFileSync(
      path.join(targetDir, filename),
      JSON.stringify(gene, null, 2),
      'utf-8'
    );
  }
}
