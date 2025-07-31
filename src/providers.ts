import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export interface AIProvider {
  name: string;
  models: Record<string, LanguageModel>;
  defaultModel: string;
}

export const providers = {
  openai: {
    name: "OpenAI",
    models: {
      "gpt-4.1-mini": openai("gpt-4.1-mini"),
    },
    defaultModel: "gpt-4.1-mini",
  },
  google: {
    name: "Google",
    models: {
      "gemini-2.5-flash": google("gemini-2.5-flash"),
      "gemini-2.5-pro": google("gemini-2.5-pro"),
    },
    defaultModel: "gemini-2.5-flash",
  },
} as const satisfies Record<string, AIProvider>;

export type ProviderName = keyof typeof providers;
export type ModelName<T extends ProviderName> = keyof typeof providers[T]["models"];

export function getModel(providerName: ProviderName, modelName?: string): LanguageModel {
  const provider = providers[providerName];
  const model = modelName || provider.defaultModel;
  
  if (!(model in provider.models)) {
    throw new Error(`Model ${model} not found in provider ${providerName}`);
  }
  
  return provider.models[model as keyof typeof provider.models];
}

export function getAllModels(): Array<{ provider: ProviderName; model: string; instance: LanguageModel }> {
  const result: Array<{ provider: ProviderName; model: string; instance: LanguageModel }> = [];
  
  for (const [providerName, provider] of Object.entries(providers)) {
    for (const [modelName, modelInstance] of Object.entries(provider.models)) {
      result.push({
        provider: providerName as ProviderName,
        model: modelName,
        instance: modelInstance,
      });
    }
  }
  
  return result;
}