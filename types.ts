import type { LanguageModel } from "ai";
import type { AssertionFunction, AssertionResult } from "./assertions/index.ts";
import type { ProviderName } from "./providers.ts";

export interface PromptConfig {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  context?: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  providers?: ProviderName[];
  models?: Record<ProviderName, string[]>;
  assertions: AssertionFunction[];
  metadata?: Record<string, any>;
}

export interface TestResult {
  promptId: string;
  promptName: string;
  provider: ProviderName;
  model: string;
  response: string;
  responseTime: number;
  assertions: AssertionResult[];
  passed: boolean;
  timestamp: Date;
  error?: string;
}

export interface TestSuite {
  name: string;
  description?: string;
  prompts: PromptConfig[];
  globalAssertions?: AssertionFunction[];
  config?: {
    timeout?: number;
    retries?: number;
    parallel?: boolean;
  };
}

export interface TestRun {
  id: string;
  suiteNames: string[];
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    duration: number;
  };
  startTime: Date;
  endTime: Date;
  config: {
    providers: ProviderName[];
    parallel: boolean;
    timeout: number;
  };
}

export interface PromptContext {
  prompt: string;
  context?: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  model: LanguageModel;
  provider: ProviderName;
  modelName: string;
}

export interface TestExecutionOptions {
  providers?: ProviderName[];
  models?: Record<ProviderName, string[]>;
  timeout?: number;
  retries?: number;
  parallel?: boolean;
  verbose?: boolean;
}