import type { TestSuite } from "../types.ts";
import { creativeWritingPrompts } from "./creative-writing.ts";
import { codeGenerationPrompts } from "./code-generation.ts";

export const testSuites: TestSuite[] = [
  {
    name: "Creative Writing",
    description: "Test prompts for creative writing tasks including story generation, dialogue, and poetry",
    prompts: creativeWritingPrompts,
    config: {
      timeout: 30000,
      parallel: true,
    },
  },
  {
    name: "Code Generation",
    description: "Test prompts for various code generation tasks across different programming languages",
    prompts: codeGenerationPrompts,
    config: {
      timeout: 45000,
      parallel: true,
    },
  },
];

export { creativeWritingPrompts, codeGenerationPrompts };