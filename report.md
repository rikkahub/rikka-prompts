# 🤖 Test Run Report

**Run ID:** test-run-1753930961108  
**Duration:** 42.06s  
**Total Tests:** 14  
**✅ Passed:** 5 (35.7%)  
**❌ Failed:** 9  
**Providers:** openai, google  
**Parallel:** Yes  

## ✅ Passed Tests

### 📊 openai (2 tests)

✅ **Haiku Generator** (gpt-4.1-mini) - 1837ms

✅ **Python Function Generator** (gpt-4.1-mini) - 7355ms

### 📊 google (3 tests)

✅ **Haiku Generator** (gemini-2.5-flash) - 6654ms

✅ **Python Function Generator** (gemini-2.5-flash) - 14799ms

✅ **React Component Generator** (gemini-2.5-flash) - 18289ms

## ❌ Failed Tests

### 📊 openai (5 tests)

❌ **Story Opening Generator** (gpt-4.1-mini) - 2553ms
   > • Response does not contain expected text: "mystery"

❌ **Character Dialogue** (gpt-4.1-mini) - 3616ms
   > • Response does not contain expected text: """
   > • Response word count (240) is outside expected range (50-200)

❌ **JSON Schema Generator** (gpt-4.1-mini) - 3079ms
   > • Response is not valid JSON: JSON Parse error: Unrecognized token '`'

❌ **SQL Query Generator** (gpt-4.1-mini) - 2333ms
   > • Response does not match regex pattern: /SELECT\s+.*\s+FROM/i

❌ **React Component Generator** (gpt-4.1-mini) - 4071ms
   > • Response does not contain expected text: "interface"

### 📊 google (4 tests)

❌ **Story Opening Generator** (gemini-2.5-flash) - 8285ms
   > • Response does not contain expected text: "mystery"

❌ **Character Dialogue** (gemini-2.5-flash) - 23769ms
   > • Response does not contain expected text: "shopkeeper"
   > • Response word count (1244) is outside expected range (50-200)

❌ **JSON Schema Generator** (gemini-2.5-flash) - 11642ms
   > • Response is not valid JSON: JSON Parse error: Unrecognized token '`'

❌ **SQL Query Generator** (gemini-2.5-flash) - 10231ms
   > • Response does not match regex pattern: /SELECT\s+.*\s+FROM/i

