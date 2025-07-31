#!/usr/bin/env bun

import { TestEngine } from "./test-engine.ts";
import { testSuites } from "./prompts/index.ts";
import { config, validateConfig } from "./config.ts";
import { getReporter } from "./reporters";
import type { TestExecutionOptions } from "./types.ts";

function parseArgs(args: string[]): { help?: boolean } {
  const options: { help?: boolean } = {};
  
  for (const arg of args) {
    if (arg === "-h" || arg === "--help") {
      options.help = true;
      break;
    }
  }
  
  return options;
}

function printHelp() {
  console.log(`
🤖 Rikka Prompts - AI Automation Testing

USAGE:
  bun run cli.ts [--help]

Configuration is now managed via YAML files. Create a config.yml file in your project root.

OPTIONS:
  -h, --help                    Show this help message

CONFIGURATION:
  All test settings are configured via config.yml (default) in your project root.
  
  Example config.yml:
    providers: [openai, google]
    suites: ["Creative Writing", "Code Generation"]
    parallel: true
    timeout: 30000
    verbose: false
    format: console
    output: report.html
    
    openai:
      apiKey: your_openai_api_key
      baseURL: https://api.openai.com/v1
    
    google:
      apiKey: your_google_api_key

ENVIRONMENT VARIABLES (fallback):
  OPENAI_API_KEY               OpenAI API key
  GOOGLE_API_KEY               Google AI API key
  DEFAULT_TIMEOUT              Default timeout in milliseconds
  DEFAULT_PARALLEL             Run tests in parallel by default (true/false)
  OUTPUT_FORMAT                Default output format (console, json, html, markdown)
  OUTPUT_FILE                  Default output file path
`);
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (options.help) {
    printHelp();
    process.exit(0);
  }
  
  console.log("🤖 Rikka Prompts - AI Automation Testing");
  console.log("========================================\n");
  
  // Validate configuration
  const configValidation = validateConfig();
  if (!configValidation.valid) {
    console.error("❌ Configuration errors:");
    configValidation.errors.forEach(error => console.error(`   • ${error}`));
    console.error("\nPlease check your environment variables or create a .env file.");
    console.error("See .env.example for reference.\n");
    process.exit(1);
  }
  
  const engine = new TestEngine();
  
  // Filter test suites if specified
  const suitesToRun = config.suites 
    ? testSuites.filter(suite => config.suites!.includes(suite.name))
    : testSuites;
    
  if (suitesToRun.length === 0) {
    console.error("❌ No matching test suites found.");
    if (config.suites) {
      console.error(`Available suites: ${testSuites.map(s => s.name).join(", ")}`);
    }
    process.exit(1);
  }
  
  const testOptions: TestExecutionOptions = {
    providers: config.providers as any,
    parallel: config.parallel ?? config.defaultParallel ?? true,
    timeout: config.timeout ?? config.defaultTimeout ?? 30000,
    verbose: config.verbose ?? false,
  };
  
  console.log(`Running ${suitesToRun.length} test suite(s):`);
  suitesToRun.forEach(suite => console.log(`  • ${suite.name}`));
  console.log(`Providers: ${testOptions.providers?.join(", ") || "all"}`);
  console.log(`Parallel: ${testOptions.parallel ? "Yes" : "No"}`);
  console.log(`Timeout: ${testOptions.timeout}ms`);
  console.log("");
  
  try {
    const testRun = await engine.runTestSuites(suitesToRun, testOptions);
    
    // Generate report
    const format = config.format || config.outputFormat || "console";
    const reporter = getReporter(format);
    const report = reporter.generate(testRun);
    
    // Output results
    if (config.output || config.outputFile) {
      const outputFile = config.output || config.outputFile!;
      await Bun.write(outputFile, report);
      console.log(`📄 Report saved to: ${outputFile}`);
    }
    
    if (format === "console" || !config.output) {
      console.log(report);
    }
  } catch (error) {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}