import type { TestRun, TestResult } from "../types.ts";
import { BaseReporter } from "./base.ts";

export class MarkdownReporter extends BaseReporter {
  generate(testRun: TestRun): string {
    const { summary, results } = testRun;
    const passRate = this.calculatePassRate(summary.passed, summary.total);
    
    let report = `# 🤖 Test Run Report\n\n`;
    
    report += `**Run ID:** ${testRun.id}  \n`;
    report += `**Duration:** ${this.formatDuration(summary.duration)}s  \n`;
    report += `**Total Tests:** ${summary.total}  \n`;
    report += `**✅ Passed:** ${summary.passed} (${passRate}%)  \n`;
    report += `**❌ Failed:** ${summary.failed}  \n`;
    report += `**Providers:** ${testRun.config.providers.join(", ")}  \n`;
    report += `**Parallel:** ${testRun.config.parallel ? "Yes" : "No"}  \n\n`;

    const passedResults = results.filter(r => r.passed);
    const failedResults = results.filter(r => !r.passed);

    if (passedResults.length > 0) {
      report += this.generateResultsSection("## ✅ Passed Tests", passedResults, true);
    }

    if (failedResults.length > 0) {
      report += this.generateResultsSection("## ❌ Failed Tests", failedResults, false);
    }

    return report;
  }

  getFileExtension(): string {
    return "md";
  }

  private generateResultsSection(title: string, results: TestResult[], passed: boolean): string {
    const groupedResults = this.groupResultsByProvider(results);
    
    let markdown = `${title}\n\n`;
    
    for (const [provider, providerResults] of Object.entries(groupedResults)) {
      markdown += `### 📊 ${provider} (${providerResults.length} tests)\n\n`;
      
      for (const result of providerResults) {
        const status = passed ? "✅" : "❌";
        markdown += `${status} **${result.promptName}** (${result.model}) - ${result.responseTime}ms\n`;
        
        if (result.error) {
          markdown += `   > 🚨 **Error:** ${result.error}\n`;
        } else if (!passed) {
          const failedAssertions = result.assertions.filter(a => !a.passed);
          for (const assertion of failedAssertions) {
            markdown += `   > • ${assertion.message}\n`;
          }
        }
        
        markdown += `\n`;
      }
    }
    
    return markdown;
  }
}