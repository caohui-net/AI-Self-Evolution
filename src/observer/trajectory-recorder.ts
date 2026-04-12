import * as fs from 'fs';
import * as path from 'path';
import { ObservationRecord } from '../types';

export interface TrajectoryEntry {
  prompt_index: number;
  conversations: Array<{ from: 'human' | 'assistant'; value: string }>;
  metadata: { timestamp: string; model: string };
  completed: boolean;
  tool_stats: Record<string, { count: number; success: number; failure: number }>;
}

export class TrajectoryRecorder {
  private outputPath: string;

  constructor(projectRoot: string) {
    this.outputPath = path.join(projectRoot, '.omc', 'trajectories', 'trajectories.jsonl');
  }

  record(obs: ObservationRecord, index: number): void {
    const entry: TrajectoryEntry = {
      prompt_index: index,
      conversations: [
        { from: 'human', value: obs.context.task },
        { from: 'assistant', value: obs.outcome.evidence || '' },
      ],
      metadata: {
        timestamp: obs.timestamp,
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      },
      completed: obs.outcome.success,
      tool_stats: this.buildToolStats(obs),
    };

    fs.mkdirSync(path.dirname(this.outputPath), { recursive: true });
    fs.appendFileSync(this.outputPath, JSON.stringify(entry) + '\n', 'utf-8');
  }

  private buildToolStats(obs: ObservationRecord): TrajectoryEntry['tool_stats'] {
    const stats: TrajectoryEntry['tool_stats'] = {};
    for (const tool of obs.context.tools) {
      stats[tool] = {
        count: 1,
        success: obs.outcome.success ? 1 : 0,
        failure: obs.outcome.success ? 0 : 1,
      };
    }
    return stats;
  }
}
