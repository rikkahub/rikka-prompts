import type { AssertionFunction, AssertionResult, AssertionContext } from "./index.ts";

export const contains = (expectedText: string, caseSensitive = false): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    const response = caseSensitive ? context.response : context.response.toLowerCase();
    const expected = caseSensitive ? expectedText : expectedText.toLowerCase();
    
    const passed = response.includes(expected);
    
    return {
      passed,
      message: passed 
        ? `Response contains expected text: "${expectedText}"`
        : `Response does not contain expected text: "${expectedText}"`,
      details: { expectedText, caseSensitive },
    };
  };
};

export const notContains = (unexpectedText: string, caseSensitive = false): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    const response = caseSensitive ? context.response : context.response.toLowerCase();
    const unexpected = caseSensitive ? unexpectedText : unexpectedText.toLowerCase();
    
    const passed = !response.includes(unexpected);
    
    return {
      passed,
      message: passed 
        ? `Response correctly does not contain: "${unexpectedText}"`
        : `Response incorrectly contains: "${unexpectedText}"`,
      details: { unexpectedText, caseSensitive },
    };
  };
};

export const matchesRegex = (pattern: RegExp): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    const passed = pattern.test(context.response);
    
    return {
      passed,
      message: passed 
        ? `Response matches regex pattern: ${pattern.toString()}`
        : `Response does not match regex pattern: ${pattern.toString()}`,
      details: { pattern: pattern.toString() },
    };
  };
};

export const lengthBetween = (minLength: number, maxLength: number): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    const length = context.response.length;
    const passed = length >= minLength && length <= maxLength;
    
    return {
      passed,
      message: passed 
        ? `Response length (${length}) is within expected range (${minLength}-${maxLength})`
        : `Response length (${length}) is outside expected range (${minLength}-${maxLength})`,
      details: { actualLength: length, minLength, maxLength },
    };
  };
};

export const startsWith = (expectedStart: string, caseSensitive = false): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    const response = caseSensitive ? context.response : context.response.toLowerCase();
    const expected = caseSensitive ? expectedStart : expectedStart.toLowerCase();
    
    const passed = response.startsWith(expected);
    
    return {
      passed,
      message: passed 
        ? `Response starts with: "${expectedStart}"`
        : `Response does not start with: "${expectedStart}"`,
      details: { expectedStart, caseSensitive },
    };
  };
};

export const endsWith = (expectedEnd: string, caseSensitive = false): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    const response = caseSensitive ? context.response : context.response.toLowerCase();
    const expected = caseSensitive ? expectedEnd : expectedEnd.toLowerCase();
    
    const passed = response.endsWith(expected);
    
    return {
      passed,
      message: passed 
        ? `Response ends with: "${expectedEnd}"`
        : `Response does not end with: "${expectedEnd}"`,
      details: { expectedEnd, caseSensitive },
    };
  };
};

export const isValidJson = (): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    try {
      JSON.parse(context.response);
      return {
        passed: true,
        message: "Response is valid JSON",
        details: { parsedSuccessfully: true },
      };
    } catch (error) {
      return {
        passed: false,
        message: `Response is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
        details: { error },
      };
    }
  };
};

export const wordCount = (minWords: number, maxWords?: number): AssertionFunction => {
  return (context: AssertionContext): AssertionResult => {
    const words = context.response.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;
    
    const passed = maxWords 
      ? count >= minWords && count <= maxWords
      : count >= minWords;
    
    const range = maxWords ? `${minWords}-${maxWords}` : `at least ${minWords}`;
    
    return {
      passed,
      message: passed 
        ? `Response word count (${count}) is within expected range (${range})`
        : `Response word count (${count}) is outside expected range (${range})`,
      details: { actualWordCount: count, minWords, maxWords },
    };
  };
};