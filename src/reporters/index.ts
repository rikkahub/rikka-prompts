export type { Reporter } from "./base.ts";
export { ConsoleReporter } from "./console.ts";
export { JsonReporter } from "./json.ts";
export { MarkdownReporter } from "./markdown.ts";
export { HtmlReporter } from "./html.ts";

import { ConsoleReporter } from "./console.ts";
import { JsonReporter } from "./json.ts";
import { MarkdownReporter } from "./markdown.ts";
import { HtmlReporter } from "./html.ts";
import type { Reporter } from "./base.ts";

export function getReporter(format: "console" | "json" | "html" | "markdown"): Reporter {
  switch (format) {
    case "json":
      return new JsonReporter();
    case "html":
      return new HtmlReporter();
    case "markdown":
      return new MarkdownReporter();
    case "console":
    default:
      return new ConsoleReporter();
  }
}