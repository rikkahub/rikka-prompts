import { TestEngine } from "./test-engine.ts";
import { testSuites } from "./prompts/index.ts";
import type { TestExecutionOptions } from "./types.ts";

async function main() {
  console.log("🤖 Rikka Prompts - AI Automation Testing");
  console.log("========================================\n");

  const engine = new TestEngine();
  
  const options: TestExecutionOptions = {
    parallel: true,
    verbose: true,
    timeout: 60000,
  };

  try {
    console.log("Starting test execution...\n");
    
    const testRun = await engine.runTestSuites(testSuites, options);
    
    console.log("\n" + "=".repeat(50));
    console.log(engine.generateReport(testRun));
    
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