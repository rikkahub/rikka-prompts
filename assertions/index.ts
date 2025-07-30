import { generateText } from "ai";
import { getModel } from "../providers.ts";
import type { LanguageModel } from "ai";

export interface AssertionResult {
  passed: boolean;
  message: string;
  details?: any;
}

export interface AssertionContext {
  prompt: string;
  response: string;
  model: string;
  provider: string;
}

export type AssertionFunction = (context: AssertionContext) => Promise<AssertionResult> | AssertionResult;

export class AssertionRunner {
  private aiModel: LanguageModel;

  constructor(aiModel?: LanguageModel) {
    this.aiModel = aiModel || getModel("openai", "gpt-4.1-mini");
  }

  async runAssertion(assertion: AssertionFunction, context: AssertionContext): Promise<AssertionResult> {
    try {
      return await assertion(context);
    } catch (error) {
      return {
        passed: false,
        message: `Assertion failed with error: ${error instanceof Error ? error.message : String(error)}`,
        details: { error },
      };
    }
  }

  async runAssertions(
    assertions: AssertionFunction[],
    context: AssertionContext
  ): Promise<AssertionResult[]> {
    return Promise.all(assertions.map(assertion => this.runAssertion(assertion, context)));
  }

  async aiAssertion(
    judgmentPrompt: string,
    context: AssertionContext
  ): Promise<AssertionResult> {
    try {
      const { text: judgment } = await generateText({
        model: this.aiModel,
        prompt: `
Given the following context:
- Original Prompt: ${context.prompt}
- AI Response: ${context.response}
- Model: ${context.model}
- Provider: ${context.provider}

Please evaluate: ${judgmentPrompt}

Respond with only "PASS" or "FAIL" followed by a brief explanation on the next line.
`,
      });

      const lines = judgment.trim().split('\n');
      const result = lines[0]?.toUpperCase();
      const explanation = lines.slice(1).join('\n').trim();

      return {
        passed: result === "PASS",
        message: explanation || "No explanation provided",
        details: { aiJudgment: judgment },
      };
    } catch (error) {
      return {
        passed: false,
        message: `AI assertion failed: ${error instanceof Error ? error.message : String(error)}`,
        details: { error },
      };
    }
  }
}