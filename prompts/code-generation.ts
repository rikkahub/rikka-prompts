import type { PromptConfig } from "../types.ts";
import { contains, matchesRegex, isValidJson, lengthBetween } from "../assertions/basic.ts";

export const codeGenerationPrompts: PromptConfig[] = [
  {
    id: "python-function",
    name: "Python Function Generator",
    description: "Generate a Python function with proper documentation",
    prompt: "Write a Python function that calculates the factorial of a number. Include proper docstring documentation and handle edge cases.",
    assertions: [
      contains("def", true),
      contains("factorial", false),
      contains("\"\"\"", true), // Docstring
      contains("return", true),
      matchesRegex(/def\s+\w+\s*\(/), // Function definition pattern
    ],
  },
  {
    id: "json-schema",
    name: "JSON Schema Generator",
    description: "Generate a valid JSON schema",
    prompt: "Create a JSON schema for validating user profile data with fields: name (required string), age (optional integer 0-120), email (required email format), and hobbies (optional array of strings).",
    assertions: [
      isValidJson(),
      contains("\"type\"", true),
      contains("\"properties\"", true),
      contains("\"required\"", true),
      contains("name", false),
      contains("email", false),
    ],
  },
  {
    id: "sql-query",
    name: "SQL Query Generator",
    description: "Generate a SQL query with proper syntax",
    prompt: "Write a SQL query to find all customers who have made purchases in the last 30 days, including their total purchase amount. Assume tables: customers (id, name, email), orders (id, customer_id, order_date, total_amount).",
    assertions: [
      contains("SELECT", false),
      contains("FROM", false),
      contains("JOIN", false),
      contains("WHERE", false),
      contains("customers", false),
      contains("orders", false),
      matchesRegex(/SELECT\s+.*\s+FROM/i),
    ],
  },
  {
    id: "react-component",
    name: "React Component Generator",
    description: "Generate a React functional component",
    prompt: "Create a React functional component called 'UserCard' that displays user information (name, email, avatar). Use TypeScript and include proper prop types.",
    assertions: [
      contains("interface", true),
      contains("UserCard", true),
      contains("React", true),
      contains("export", true),
      matchesRegex(/const\s+\w+.*=.*=>/), // Arrow function pattern
      contains("name", false),
      contains("email", false),
    ],
  }
];