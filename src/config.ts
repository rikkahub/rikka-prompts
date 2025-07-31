export interface Config {
  openai?: {
    apiKey?: string;
    baseURL?: string;
  };
  google?: {
    apiKey?: string;
  };
  defaultTimeout?: number;
  defaultParallel?: boolean;
  outputFormat?: "console" | "json" | "html";
  outputFile?: string;
}

function getEnvVar(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  if (typeof Bun !== "undefined" && Bun.env) {
    return Bun.env[key];
  }
  return undefined;
}

export const config: Config = {
  openai: {
    apiKey: getEnvVar("OPENAI_API_KEY"),
    baseURL: getEnvVar("OPENAI_BASE_URL"),
  },
  google: {
    apiKey: getEnvVar("GOOGLE_API_KEY"),
  },
  defaultTimeout: parseInt(getEnvVar("DEFAULT_TIMEOUT") || "30000"),
  defaultParallel: getEnvVar("DEFAULT_PARALLEL") === "true",
  outputFormat: (getEnvVar("OUTPUT_FORMAT") as Config["outputFormat"]) || "console",
  outputFile: getEnvVar("OUTPUT_FILE"),
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