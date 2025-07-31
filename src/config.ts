export interface Config {
  openai?: {
    apiKey?: string;
    baseURL?: string;
  };
  google?: {
    apiKey?: string;
  };
  providers?: string[];
  suites?: string[];
  parallel?: boolean;
  timeout?: number;
  verbose?: boolean;
  format?: "console" | "json" | "html" | "markdown";
  output?: string;
  defaultTimeout?: number;
  defaultParallel?: boolean;
  outputFormat?: "console" | "json" | "html" | "markdown";
  outputFile?: string;
}

import * as YAML from 'yaml';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

function getEnvVar(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  if (typeof Bun !== "undefined" && Bun.env) {
    return Bun.env[key];
  }
  return undefined;
}

function loadYamlConfig(configPath: string = 'config.yml'): Partial<Config> {
  const fullPath = join(process.cwd(), configPath);
  
  if (!existsSync(fullPath)) {
    return {};
  }
  
  try {
    const yamlContent = readFileSync(fullPath, 'utf8');
    return YAML.parse(yamlContent) || {};
  } catch (error) {
    console.warn(`Warning: Failed to parse YAML config file ${configPath}:`, error);
    return {};
  }
}

const yamlConfig = loadYamlConfig();

export const config: Config = {
  openai: {
    apiKey: yamlConfig.openai?.apiKey || getEnvVar("OPENAI_API_KEY"),
    baseURL: yamlConfig.openai?.baseURL || getEnvVar("OPENAI_BASE_URL"),
  },
  google: {
    apiKey: yamlConfig.google?.apiKey || getEnvVar("GOOGLE_API_KEY"),
  },
  providers: yamlConfig.providers,
  suites: yamlConfig.suites,
  parallel: yamlConfig.parallel,
  timeout: yamlConfig.timeout,
  verbose: yamlConfig.verbose,
  format: yamlConfig.format,
  output: yamlConfig.output,
  defaultTimeout: yamlConfig.timeout || parseInt(getEnvVar("DEFAULT_TIMEOUT") || "30000"),
  defaultParallel: yamlConfig.parallel ?? (getEnvVar("DEFAULT_PARALLEL") === "true"),
  outputFormat: yamlConfig.format || (getEnvVar("OUTPUT_FORMAT") as Config["outputFormat"]) || "console",
  outputFile: yamlConfig.output || getEnvVar("OUTPUT_FILE"),
};

export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.openai?.apiKey && !config.google?.apiKey) {
    errors.push("At least one API key must be provided (OPENAI_API_KEY or GOOGLE_API_KEY)");
  }
  
  if (config.openai?.apiKey && !config.openai.apiKey.startsWith("sk-")) {
    errors.push("OpenAI API key appears to be invalid (should start with 'sk-')");
  }
  
  if (config.defaultTimeout && (config.defaultTimeout < 1000 || config.defaultTimeout > 300000)) {
    errors.push("Default timeout should be between 1000ms (1s) and 300000ms (5min)");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}