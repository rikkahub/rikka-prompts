# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Run tests**: `bun run index.ts` - Execute all test suites
- **CLI interface**: `bun run cli.ts` - Run with command-line options
- **Development mode**: `bun run --watch index.ts` - Run with file watching

### CLI Options
- `--providers openai,google` - Select specific AI providers
- `--suites "Creative Writing"` - Run specific test suites
- `--parallel/--no-parallel` - Control parallel execution
- `--timeout 60000` - Set timeout in milliseconds
- `--verbose` - Enable detailed output
- `--format json/html` - Output format
- `--output report.html` - Save results to file

## Architecture

This is an AI prompt testing framework built with Bun and TypeScript. The system tests prompts against multiple AI providers (OpenAI, Google) using configurable assertions.

### Core Components

- **TestEngine** (`test-engine.ts`): Main orchestrator that executes prompts against AI models and runs assertions
- **Providers** (`providers.ts`): AI model configuration and instantiation for OpenAI and Google
- **Assertions** (`assertions/`): Validation logic including basic checks and AI-based evaluations
- **Test Suites** (`prompts/`): Organized collections of prompts for different domains (creative writing, code generation)

### Data Flow

1. Test suites define prompts with associated assertions
2. TestEngine executes prompts against configured AI models
3. Responses are validated using assertion functions
4. Results are aggregated and reported with pass/fail status

### Key Types

- `PromptConfig`: Defines a prompt with assertions and metadata
- `TestSuite`: Groups related prompts with configuration
- `TestResult`: Individual test execution result
- `TestRun`: Complete test session with summary statistics

## Environment Setup

Create `.env` file with:
```
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key
```

## Test Development

New prompts should be added to existing suites in `prompts/` directory. Each prompt requires:
- Unique ID and descriptive name
- The prompt text
- Array of assertion functions to validate responses
- Optional context messages and provider/model restrictions