import type { PromptConfig } from "../types.ts";
import { contains, lengthBetween, wordCount } from "../assertions/basic.ts";

export const creativeWritingPrompts: PromptConfig[] = [
  {
    id: "story-opening",
    name: "Story Opening Generator",
    description: "Generate an engaging opening paragraph for a mystery story",
    prompt: "Write an engaging opening paragraph for a mystery story set in a small coastal town. Include a sense of foreboding and introduce a main character.",
    assertions: [
      lengthBetween(200, 800),
      wordCount(30, 150),
      contains("mystery", false),
      contains("town", false),
    ],
  },
  {
    id: "character-dialogue",
    name: "Character Dialogue",
    description: "Generate realistic dialogue between two characters",
    prompt: "Write a dialogue between a detective and a suspicious shopkeeper. The detective is investigating a recent theft, and the shopkeeper is nervous but trying to appear helpful.",
    context: [
      {
        role: "system",
        content: "You are a creative writing assistant. Focus on creating realistic, character-driven dialogue that reveals personality and advances the plot."
      }
    ],
    assertions: [
      contains("detective", false),
      contains("shopkeeper", false),
      contains("\"", true), // Should contain dialogue quotes
      wordCount(50, 200),
    ],
  },
  {
    id: "poem-haiku",
    name: "Haiku Generator",
    description: "Generate a haiku about nature",
    prompt: "Write a haiku about autumn leaves falling. Follow the traditional 5-7-5 syllable structure.",
    assertions: [
      contains("autumn", false),
      contains("leaves", false),
      wordCount(8, 15), // Haikus are typically 10-17 words
      lengthBetween(30, 100),
    ],
  }
];