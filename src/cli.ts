#!/usr/bin/env bun

import { TestEngine } from "./test-engine.ts";
import { testSuites } from "./prompts/index.ts";
import { config, validateConfig } from "./config.ts";
import { getReporter } from "./reporters";
import type { TestExecutionOptions } from "./types.ts";

interface CliOptions {
  providers?: string[];
  parallel?: boolean;
  timeout?: number;
  verbose?: boolean;
  output?: string;
  format?: "console" | "json" | "html" | "markdown";
  help?: boolean;
  suites?: string[];
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];
    
    switch (arg) {
      case "-h":
      case "--help":
        options.help = true;
        break;
      case "-p":
      case "--providers":
        if (next && !next.startsWith("-")) {
          options.providers = next.split(",");
          i++;
        }
        break;
      case "--parallel":
        options.parallel = true;
        break;
      case "--no-parallel":
        options.parallel = false;
        break;
      case "-t":
      case "--timeout":
        if (next && !next.startsWith("-")) {
          options.timeout = parseInt(next);
          i++;
        }
        break;
      case "-v":
      case "--verbose":
        options.verbose = true;
        break;
      case "-o":
      case "--output":
        if (next && !next.startsWith("-")) {
          options.output = next;
          i++;
        }
        break;
      case "-f":
      case "--format":
        if (next && !next.startsWith("-") && ["console", "json", "html", "markdown"].includes(next)) {
          options.format = next as "console" | "json" | "html" | "markdown";
          i++;
        }
        break;
      case "-s":
      case "--suites":
        if (next && !next.startsWith("-")) {
          options.suites = next.split(",");
          i++;
        }
        break;
    }
  }
  
  return options;
}

function printHelp() {
  console.log(`
🤖 Rikka Prompts - AI Automation Testing

USAGE:
  bun run cli.ts [OPTIONS]

OPTIONS:
  -h, --help                    Show this help message
  -p, --providers <list>        Comma-separated list of providers (openai,google)
  -s, --suites <list>          Comma-separated list of test suites to run
  --parallel                   Run tests in parallel (default)
  --no-parallel               Run tests sequentially
  -t, --timeout <ms>           Timeout per test in milliseconds (default: 30000)
  -v, --verbose                Enable verbose output
  -o, --output <file>          Save results to file
  -f, --format <format>        Output format: console, json, html, markdown (default: console)

EXAMPLES:
  bun run cli.ts                                    # Run all tests
  bun run cli.ts --providers openai --verbose      # Run only OpenAI tests with verbose output
  bun run cli.ts --suites "Creative Writing"       # Run only Creative Writing test suite
  bun run cli.ts --format html --output report.html # Generate HTML report
  bun run cli.ts --format markdown --output report.md # Generate Markdown report
  bun run cli.ts --no-parallel --timeout 60000     # Run sequentially with 60s timeout

ENVIRONMENT VARIABLES:
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
  const suitesToRun = options.suites 
    ? testSuites.filter(suite => options.suites!.includes(suite.name))
    : testSuites;
    
  if (suitesToRun.length === 0) {
    console.error("❌ No matching test suites found.");
    if (options.suites) {
      console.error(`Available suites: ${testSuites.map(s => s.name).join(", ")}`);
    }
    process.exit(1);
  }
  
  const testOptions: TestExecutionOptions = {
    providers: options.providers as any,
    parallel: options.parallel ?? config.defaultParallel ?? true,
    timeout: options.timeout ?? config.defaultTimeout ?? 30000,
    verbose: options.verbose ?? false,
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
    const format = options.format || config.outputFormat || "console";
    const reporter = getReporter(format);
    const report = reporter.generate(testRun);
    
    // Output results
    if (options.output || config.outputFile) {
      const outputFile = options.output || config.outputFile!;
      await Bun.write(outputFile, report);
      console.log(`📄 Report saved to: ${outputFile}`);
    }
    
    if (format === "console" || !options.output) {
      console.log(report);
    }
    
    // Exit with appropriate code
    if (testRun.summary.failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}