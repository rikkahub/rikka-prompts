# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a RikkaHub prompt testing repository (中文：此仓库用于测试 RikkaHub 的 Prompt 效果) built around the promptfoo evaluation framework. The repository is designed to test and compare prompt performance across multiple AI providers.

## Project Structure

- `promptfooconfig.yaml` - Main configuration file defining prompts, providers, and test cases
- `promptfoo.md` - Documentation containing promptfoo code snippets and examples
- `README.md` - Setup instructions (in Chinese)
- `promptfoo-errors.log` - Error log file

## Common Commands

### Setup
```bash
# Set environment variables for API keys
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key
```

### Running Evaluations
```bash
# Run prompt evaluation
npx promptfoo@latest eval

# View results in web interface
npx promptfoo@latest view
```

## Configuration Architecture

The main configuration is in `promptfooconfig.yaml`:

- **Prompts**: Tweet generation prompts with variable substitution (`{{topic}}`)
  - Standard tweet prompt
  - Concise/funny tweet prompt

- **Providers**: Multiple AI models for comparison
  - OpenAI: gpt-4o-mini, gpt-4o, gpt-4.1
  - Google: gemini-2.0-flash, gemini-2.5-flash

- **Tests**: Evaluation scenarios with assertions
  - Topic-based tests (avocado toast, new york city)
  - Contains checks (`icontains` for "avocado")
  - Length preference (shorter outputs favored)
  - LLM-rubric evaluation (humor assessment)

## Testing Approach

The repository uses automated assertions to evaluate model outputs:
- Content verification (required keywords)
- Length optimization (preferring concise responses)
- Quality assessment via LLM rubrics
- Cross-model performance comparison

## Documentation Notes

- promptfoo is a prompt testing framework.
- `promptfoo.md` is the usage documentation for promptfoo.