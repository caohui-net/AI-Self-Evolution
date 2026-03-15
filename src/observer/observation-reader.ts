import * as fs from 'fs';
import * as path from 'path';
import { ObservationRecord } from '../types';

export class ObservationReader {
  private observationsDir: string;

  constructor(projectRoot: string) {
    this.observationsDir = path.join(projectRoot, '.omc', 'observations');
  }

  async readRecent(hoursBack: number = 24): Promise<ObservationRecord[]> {
    if (!fs.existsSync(this.observationsDir)) {
      return [];
    }

    const cutoff = Date.now() - (hoursBack * 60 * 60 * 1000);
    const files = fs.readdirSync(this.observationsDir)
      .filter(f => f.startsWith('obs-') && f.endsWith('.json'));

    const observations: ObservationRecord[] = [];

    for (const file of files) {
      const filePath = path.join(this.observationsDir, file);
      const timestamp = parseInt(file.replace('obs-', '').replace('.json', ''));

      if (timestamp >= cutoff) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const obs = JSON.parse(content);
          observations.push(obs);
        } catch (err) {
          console.warn(`Skipping malformed observation: ${file}`);
        }
      }
    }

    return observations;
  }
}
