import * as fs from 'fs';
import * as path from 'path';
import { Gene, ExecutableGene } from '../types/gene';

export class SkillInjector {
  private readonly globalAgentsPath = path.join(process.env.HOME || '', '.claude', 'agents');

  async injectAsSkill(gene: Gene, projectPath?: string): Promise<void> {
    const execGene = this.toExecutableGene(gene);

    if (gene.gdi >= 0.75) {
      this.writeSkillMd(execGene, this.globalAgentsPath);
    } else if (gene.gdi >= 0.55 && projectPath) {
      const projectSkillsDir = path.join(projectPath, '.omc', 'skills');
      this.writeSkillMd(execGene, projectSkillsDir);
    } else if (projectPath) {
      this.archiveGene(gene, projectPath);
    }
  }

  private toExecutableGene(gene: Gene): ExecutableGene {
    const slug = gene.pattern
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 64);

    return {
      ...gene,
      skill: {
        name: slug,
        description: `Learned pattern: ${gene.pattern}`.slice(0, 1024),
        version: '1.0.0',
        triggers: {
          fallback_for_tools: gene.context.slice(0, 3),
        },
        instructions: this.buildInstructions(gene),
        improvementCount: 0,
      },
    };
  }

  private buildInstructions(gene: Gene): string {
    const meta = gene.metadata;
    return [
      `## Pattern\n${gene.pattern}`,
      `## Context\n${gene.context.join(', ')}`,
      meta ? `## Quality\nReliability: ${meta.reliability.toFixed(2)}, Reusability: ${meta.reusability.toFixed(2)}, Impact: ${meta.impact.toFixed(2)}` : '',
      meta?.evidence.length ? `## Evidence\n${meta.evidence.join('\n')}` : '',
      `## Source\n${gene.source}`,
    ].filter(Boolean).join('\n\n');
  }

  private writeSkillMd(gene: ExecutableGene, dir: string): void {
    fs.mkdirSync(dir, { recursive: true });
    const { skill } = gene;
    const frontmatter = [
      '---',
      `name: ${skill.name}`,
      `description: "${skill.description.replace(/"/g, "'")}"`,
      `version: ${skill.version}`,
      'metadata:',
      '  hermes:',
      skill.triggers.fallback_for_tools?.length
        ? `    fallback_for_tools: [${skill.triggers.fallback_for_tools.join(', ')}]`
        : '',
      '---',
    ].filter(l => l !== '').join('\n');

    const content = `${frontmatter}\n\n${skill.instructions}\n`;
    fs.writeFileSync(path.join(dir, `${skill.name}.md`), content, 'utf-8');
  }

  private archiveGene(gene: Gene, projectPath: string): void {
    const dir = path.join(projectPath, '.omc', 'observations', 'archived');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, `archived-${gene.id}.json`),
      JSON.stringify(gene, null, 2),
      'utf-8'
    );
  }
}
