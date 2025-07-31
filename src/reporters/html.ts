import type { TestRun, TestResult } from "../types.ts";
import { BaseReporter } from "./base.ts";

export class HtmlReporter extends BaseReporter {
  generate(testRun: TestRun): string {
    const { summary, results } = testRun;
    const passRate = this.calculatePassRate(summary.passed, summary.total);
    
    const passedResults = results.filter(r => r.passed);
    const failedResults = results.filter(r => !r.passed);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rikka Prompts Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .title { color: #333; margin-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 0.9em; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 1.2em; font-weight: bold; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #eee; }
        .test-group { margin-bottom: 20px; }
        .provider-title { font-weight: bold; color: #495057; margin-bottom: 10px; }
        .test-item { background: #f8f9fa; margin: 8px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #ccc; }
        .test-item.pass { border-left-color: #28a745; }
        .test-item.fail { border-left-color: #dc3545; }
        .test-name { font-weight: bold; }
        .test-details { font-size: 0.9em; color: #666; margin-top: 5px; }
        .assertion { margin: 5px 0; font-size: 0.85em; }
        .assertion.fail { color: #dc3545; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🤖 Rikka Prompts Test Report</h1>
            <p>Run ID: ${testRun.id}</p>
            <p>Generated: ${testRun.endTime.toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-value">${summary.total}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-value pass">${summary.passed}</div>
                <div class="stat-label">Passed (${passRate}%)</div>
            </div>
            <div class="stat-card">
                <div class="stat-value fail">${summary.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.formatDuration(summary.duration)}s</div>
                <div class="stat-label">Duration</div>
            </div>
        </div>

        ${passedResults.length > 0 ? this.generateResultsSection("✅ Passed Tests", passedResults, true) : ''}
        ${failedResults.length > 0 ? this.generateResultsSection("❌ Failed Tests", failedResults, false) : ''}
    </div>
</body>
</html>`;
  }

  getFileExtension(): string {
    return "html";
  }

  private generateResultsSection(title: string, results: TestResult[], passed: boolean): string {
    const groupedResults = this.groupResultsByProvider(results);
    
    let html = `<div class="section">
        <h2 class="section-title">${title}</h2>`;
    
    for (const [provider, providerResults] of Object.entries(groupedResults)) {
      html += `<div class="test-group">
            <div class="provider-title">📊 ${provider} (${providerResults.length} tests)</div>`;
      
      for (const result of providerResults) {
        html += `<div class="test-item ${passed ? 'pass' : 'fail'}">
                <div class="test-name">${result.promptName}</div>
                <div class="test-details">
                    Model: ${result.model} | Response Time: ${result.responseTime}ms
                </div>`;
        
        if (result.error) {
          html += `<div class="error">Error: ${result.error}</div>`;
        } else if (!passed) {
          const failedAssertions = result.assertions.filter(a => !a.passed);
          for (const assertion of failedAssertions) {
            html += `<div class="assertion fail">• ${assertion.message}</div>`;
          }
        }
        
        html += `</div>`;
      }
      
      html += `</div>`;
    }
    
    html += `</div>`;
    return html;
  }
}