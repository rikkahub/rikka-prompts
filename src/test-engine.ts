import { generateText } from "ai";
import type { LanguageModel } from "ai";
import { getModel, getAllModels, type ProviderName } from "./providers.ts";
import { AssertionRunner, type AssertionContext } from "./assertions/index.ts";
import type {
  PromptConfig,
  TestResult,
  TestSuite,
  TestRun,
  PromptContext,
  TestExecutionOptions,
} from "./types.ts";

export class TestEngine {
  private assertionRunner: AssertionRunner;

  constructor() {
    this.assertionRunner = new AssertionRunner();
  }

  async executePrompt(context: PromptContext): Promise<{ response: string; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      const messages = context.context || [];
      const userMessage = { role: "user" as const, content: context.prompt };
      
      const { text: response } = await generateText({
        model: context.model,
        messages: [...messages, userMessage],
      });

      const responseTime = Date.now() - startTime;
      
      return { response, responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      throw new Error(`Failed to execute prompt: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async testPrompt(
    promptConfig: PromptConfig,
    provider: ProviderName,
    modelName: string,
    options: TestExecutionOptions = {}
  ): Promise<TestResult> {
    const startTime = new Date();
    
    try {
      const model = getModel(provider, modelName);
      
      const context: PromptContext = {
        prompt: promptConfig.prompt,
        context: promptConfig.context,
        model,
        provider,
        modelName,
      };

      const { response, responseTime } = await this.executePrompt(context);
      
      const assertionContext: AssertionContext = {
        prompt: promptConfig.prompt,
        response,
        model: modelName,
        provider,
      };

      const assertions = await this.assertionRunner.runAssertions(
        promptConfig.assertions,
        assertionContext
      );

      const passed = assertions.every(assertion => assertion.passed);

      return {
        promptId: promptConfig.id,
        promptName: promptConfig.name,
        provider,
        model: modelName,
        response,
        responseTime,
        assertions,
        passed,
        timestamp: startTime,
      };
    } catch (error) {
      return {
        promptId: promptConfig.id,
        promptName: promptConfig.name,
        provider,
        model: modelName,
        response: "",
        responseTime: 0,
        assertions: [],
        passed: false,
        timestamp: startTime,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async runTestSuite(
    testSuite: TestSuite,
    options: TestExecutionOptions = {}
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    const targetProviders = options.providers || Object.keys(providers) as ProviderName[];
    const parallel = options.parallel ?? testSuite.config?.parallel ?? false;

    const testTasks: Promise<TestResult>[] = [];

    for (const promptConfig of testSuite.prompts) {
      const promptProviders = promptConfig.providers || targetProviders;
      
      for (const provider of promptProviders) {
        const models = options.models?.[provider] || 
                      promptConfig.models?.[provider] || 
                      [providers[provider].defaultModel];
        
        for (const model of models) {
          const testTask = this.testPrompt(promptConfig, provider, model, options);
          
          if (parallel) {
            testTasks.push(testTask);
          } else {
            const result = await testTask;
            results.push(result);
            if (options.verbose) {
              console.log(`✓ ${promptConfig.name} - ${provider}/${model}: ${result.passed ? 'PASS' : 'FAIL'}`);
            }
          }
        }
      }
    }

    if (parallel && testTasks.length > 0) {
      const parallelResults = await Promise.all(testTasks);
      results.push(...parallelResults);
      
      if (options.verbose) {
        parallelResults.forEach(result => {
          console.log(`✓ ${result.promptName} - ${result.provider}/${result.model}: ${result.passed ? 'PASS' : 'FAIL'}`);
        });
      }
    }

    return results;
  }

  async runTestSuites(
    testSuites: TestSuite[],
    options: TestExecutionOptions = {}
  ): Promise<TestRun> {
    const runId = `test-run-${Date.now()}`;
    const startTime = new Date();
    
    const allResults: TestResult[] = [];
    
    for (const suite of testSuites) {
      if (options.verbose) {
        console.log(`Running test suite: ${suite.name}`);
      }
      
      const suiteResults = await this.runTestSuite(suite, options);
      allResults.push(...suiteResults);
    }
    
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    const passed = allResults.filter(r => r.passed).length;
    const failed = allResults.length - passed;
    
    return {
      id: runId,
      suiteNames: testSuites.map(s => s.name),
      results: allResults,
      summary: {
        total: allResults.length,
        passed,
        failed,
        duration,
      },
      startTime,
      endTime,
      config: {
        providers: options.providers || Object.keys(providers) as ProviderName[],
        parallel: options.parallel ?? false,
        timeout: options.timeout ?? 30000,
      },
    };
  }

}

// Import providers for the test engine
import { providers } from "./providers.ts";