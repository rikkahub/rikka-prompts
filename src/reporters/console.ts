import type { TestRun, TestResult } from "../types.ts";
import { BaseReporter } from "./base.ts";

export class ConsoleReporter extends BaseReporter {
  generate(testRun: TestRun): string {
    const { summary, results } = testRun;
    const passRate = this.calculatePassRate(summary.passed, summary.total);
    
    let report = `
🤖 Test Run Report
==================
Run ID: ${testRun.id}
Duration: ${this.formatDuration(summary.duration)}s
Total Tests: ${summary.total}
✅ Passed: ${summary.passed} (${passRate}%)
❌ Failed: ${summary.failed}
Providers: ${testRun.config.providers.join(", ")}
Parallel: ${testRun.config.parallel ? "Yes" : "No"}

`;

    const passedByProvider = this.groupResultsByProvider(results.filter(r => r.passed));
    const failedByProvider = this.groupResultsByProvider(results.filter(r => !r.passed));

    if (Object.keys(passedByProvider).length > 0) {
      report += "✅ Passed Tests by Provider:\n";
      report += "============================\n";
      for (const [provider, providerResults] of Object.entries(passedByProvider)) {
        report += `\n📊 ${provider}: ${providerResults.length} tests\n`;
        for (const result of providerResults) {
          report += `   ✓ ${result.promptName} (${result.model}) - ${result.responseTime}ms\n`;
        }
      }
      report += "\n";
    }

    if (Object.keys(failedByProvider).length > 0) {
      report += "❌ Failed Tests by Provider:\n";
      report += "============================\n";
      for (const [provider, providerResults] of Object.entries(failedByProvider)) {
        report += `\n📊 ${provider}: ${providerResults.length} tests\n`;
        for (const result of providerResults) {
          report += `   ❌ ${result.promptName} (${result.model})\n`;
          if (result.error) {
            report += `      Error: ${result.error}\n`;
          } else {
            result.assertions
              .filter(a => !a.passed)
              .forEach(assertion => {
                report += `      • ${assertion.message}\n`;
              });
          }
        }
      }
    }

    return report;
  }

  getFileExtension(): string {
    return "txt";
  }
}