import type { TestRun } from "../types.ts";
import { BaseReporter } from "./base.ts";

export class JsonReporter extends BaseReporter {
  generate(testRun: TestRun): string {
    return JSON.stringify(testRun, null, 2);
  }

  getFileExtension(): string {
    return "json";
  }
}