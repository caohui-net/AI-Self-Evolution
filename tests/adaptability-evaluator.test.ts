import { AdaptabilityEvaluator } from '../src/observer/adaptability-evaluator';

describe('AdaptabilityEvaluator', () => {
  let evaluator: AdaptabilityEvaluator;

  beforeEach(() => {
    evaluator = new AdaptabilityEvaluator();
  });

  test('perfect match returns high score', () => {
    const score = evaluator.evaluate(
      ['typescript', 'react'],
      ['typescript', 'react'],
      'authentication',
      'authentication'
    );

    expect(score.techStackMatch).toBe(1.0);
    expect(score.problemRelevance).toBe(1.0);
    expect(score.overallScore).toBeGreaterThan(0.8);
  });

  test('partial match returns medium score', () => {
    const score = evaluator.evaluate(
      ['typescript', 'react'],
      ['typescript', 'vue'],
      'authentication',
      'authentication'
    );

    expect(score.techStackMatch).toBe(0.5);
    expect(score.overallScore).toBeGreaterThan(0.5);
  });

  test('no match returns low score', () => {
    const score = evaluator.evaluate(
      ['python'],
      ['typescript', 'react'],
      'api-integration',
      'authentication'
    );

    expect(score.techStackMatch).toBe(0);
    expect(score.overallScore).toBeLessThan(0.5);
  });

  test('empty capsule tech stack returns zero match', () => {
    const score = evaluator.evaluate(
      ['typescript'],
      [],
      'authentication',
      'authentication'
    );

    expect(score.techStackMatch).toBe(0);
  });

  test('different problem types reduce relevance', () => {
    const score = evaluator.evaluate(
      ['typescript'],
      ['typescript'],
      'authentication',
      'validation'
    );

    expect(score.problemRelevance).toBe(0.5);
  });
});
