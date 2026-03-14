import { EvomapAdapter, EvoCapsule } from './evomap-adapter';

export class MockEvomapAdapter implements EvomapAdapter {
  async fetchCapsules(): Promise<EvoCapsule[]> {
    return [
      {
        id: 'cap-001',
        name: 'JWT Authentication',
        description: 'Implement JWT-based authentication',
        techStack: ['typescript', 'express'],
        problemType: 'authentication',
        strategy: 'Use jsonwebtoken library with refresh tokens'
      },
      {
        id: 'cap-002',
        name: 'API Retry Logic',
        description: 'Exponential backoff retry for API calls',
        techStack: ['typescript'],
        problemType: 'api-integration',
        strategy: 'Implement retry with exponential backoff'
      },
      {
        id: 'cap-003',
        name: 'React Form Validation',
        description: 'Client-side form validation',
        techStack: ['react', 'typescript'],
        problemType: 'validation',
        strategy: 'Use react-hook-form with zod schema'
      }
    ];
  }

  async syncToLocal(capsules: EvoCapsule[]): Promise<void> {
    console.log(`Synced ${capsules.length} capsules to local cache`);
  }
}
