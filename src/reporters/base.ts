import type { TestRun, TestResult } from "../types.ts";

export interface Reporter {
  generate(testRun: TestRun): string;
  getFileExtension(): string;
}

export abstract class BaseReporter implements Reporter {
  abstract generate(testRun: TestRun): string;
  abstract getFileExtension(): string;

  protected groupResultsByProvider(results: TestResult[]): Record<string, TestResult[]> {
    return results.reduce((acc, result) => {
      if (!acc[result.provider]) {
        acc[result.provider] = [];
      }
      acc[result.provider].push(result);
      return acc;
    }, {} as Record<string, TestResult[]>);
  }

  protected calculatePassRate(passed: number, total: number): string {
    if (total === 0) return "0.0";
    return (passed / total * 100).toFixed(1);
  }

  protected formatDuration(durationMs: number): string {
    return (durationMs / 1000).toFixed(2);
  }
}