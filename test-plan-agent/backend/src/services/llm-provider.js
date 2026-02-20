import Groq from 'groq-sdk';
import ollama from 'ollama';
import { dbAsync } from '../database/db.js';

class LLMProviderService {
  constructor() {
    this.groqClient = null;
    this.ollamaConfig = { baseUrl: 'http://localhost:11434' };
    this.initializeProviders();
  }

  async initializeProviders() {
    try {
      const groqKey = await dbAsync.get("SELECT value FROM settings WHERE key = 'groq_api_key'");
      if (groqKey) {
        this.groqClient = new Groq({ apiKey: groqKey.value });
      }

      const ollamaUrl = await dbAsync.get("SELECT value FROM settings WHERE key = 'ollama_base_url'");
      if (ollamaUrl) {
        this.ollamaConfig.baseUrl = ollamaUrl.value;
      }
    } catch (error) {
      console.error('Failed to initialize LLM providers:', error);
    }
  }

  async testGroqConnection(apiKey) {
    try {
      const client = new Groq({ apiKey });
      const models = await client.models.list();
      return { success: true, models: models.data.map(m => m.id) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testOllamaConnection(baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/api/tags`);
      if (!response.ok) throw new Error('Failed to connect to Ollama');
      const data = await response.json();
      return { success: true, models: data.models.map(m => m.name) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getOllamaModels() {
    try {
      const response = await fetch(`${this.ollamaConfig.baseUrl}/api/tags`);
      if (!response.ok) throw new Error('Failed to fetch Ollama models');
      const data = await response.json();
      return { success: true, models: data.models.map(m => m.name) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  parseTemplateSections(template) {
    // Extract sections from template if available
    if (template.sections && Array.isArray(template.sections) && template.sections.length > 0) {
      return template.sections;
    }
    
    // Parse from raw text
    const text = template.content || template.rawText || '';
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Look for headers (numbered or uppercase)
      if (/^\d+\./.test(trimmed) || /^[A-Z][A-Z\s]{3,}/.test(trimmed)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { title: trimmed, content: [] };
      } else if (currentSection && trimmed) {
        currentSection.content.push(trimmed);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections.length > 0 ? sections : [
      { title: '1. Overview', content: [] },
      { title: '2. Test Scope', content: [] },
      { title: '3. Test Scenarios', content: [] },
      { title: '4. Test Cases', content: [] },
      { title: '5. Test Data', content: [] },
      { title: '6. Entry/Exit Criteria', content: [] },
      { title: '7. Risks & Assumptions', content: [] }
    ];
  }

  async generateTestPlan(ticketData, template, provider, model, onChunk = null) {
    const startTime = Date.now();
    
    // Parse template sections
    const templateSections = this.parseTemplateSections(template);
    const sectionStructure = templateSections.map(s => s.title).join('\n');
    
    const systemPrompt = `You are an expert QA Engineer with 10+ years of experience. Your task is to generate a comprehensive, professional test plan that STRICTLY follows the provided template structure.

CRITICAL RULES:
1. Follow the template section structure EXACTLY - use the same section headers
2. Each test case must have: TC-ID, Description, Preconditions, Steps (numbered), Expected Result
3. Map acceptance criteria to SPECIFIC test cases with clear traceability
4. Include BOTH positive and negative test scenarios
5. Add edge cases and boundary value analysis
6. Use professional QA terminology
7. Format output in proper Markdown with clear hierarchy`;

    const userPrompt = `## JIRA TICKET INFORMATION

**Ticket ID:** ${ticketData.key}
**Summary:** ${ticketData.summary}
**Priority:** ${ticketData.priority}
**Status:** ${ticketData.status}

**Description:**
${ticketData.description || 'No description provided'}

**Acceptance Criteria:**
${ticketData.acceptanceCriteria || 'No acceptance criteria provided'}

---

## TEMPLATE STRUCTURE (MUST FOLLOW EXACTLY)

${sectionStructure}

---

## TEMPLATE REFERENCE CONTENT

${template.content || template.rawText || 'Standard test plan format'}

---

## GENERATION INSTRUCTIONS

Generate a complete test plan with the following structure:

### 1. Overview
- Brief description of the feature being tested
- Reference to JIRA ticket: ${ticketData.key}
- Test plan version and date

### 2. Test Scope
#### In Scope
- Features to be tested based on the ticket
- Functionality covered

#### Out of Scope  
- Features explicitly not covered

### 3. Test Scenarios (High Level)
List 5-10 test scenarios covering:
- Happy path flows
- Alternative flows
- Error handling
- Edge cases

### 4. Detailed Test Cases
For each scenario, create specific test cases with this EXACT format:

| TC-ID | Test Case Title | Priority |
|-------|----------------|----------|
| TC-001 | [Clear, descriptive title] | High/Medium/Low |

**Preconditions:**
- List setup requirements

**Test Steps:**
1. Step 1 description
2. Step 2 description
3. Step 3 description

**Expected Result:**
- Clear description of expected outcome

**Traceability:** Maps to Acceptance Criteria: [AC reference]

### 5. Test Data Requirements
- Specific data needed for testing
- User accounts, test inputs, etc.

### 6. Entry and Exit Criteria
- When to start testing
- When to stop testing

### 7. Risks and Mitigation
- Potential risks
- Mitigation strategies

---

**REMEMBER:**
- Generate at least 8-12 detailed test cases
- Each test case must be executable
- Include negative test cases (invalid inputs, error conditions)
- Include boundary value test cases
- Map each test case to specific acceptance criteria`;

    try {
      let content = '';
      let tokensUsed = 0;

      if (provider === 'groq') {
        if (!this.groqClient) throw new Error('Groq not configured');
        
        const stream = await this.groqClient.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: model || 'llama-3.3-70b-versatile',
          temperature: 0.5,
          max_tokens: 4000,
          stream: true
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          content += delta;
          tokensUsed += 1;
          if (onChunk) onChunk(delta);
        }
      } else if (provider === 'ollama') {
        const response = await ollama.chat({
          model: model || 'llama3.2',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: true
        });

        for await (const chunk of response) {
          const delta = chunk.message?.content || '';
          content += delta;
          tokensUsed += 1;
          if (onChunk) onChunk(delta);
        }
      } else {
        throw new Error(`Unknown provider: ${provider}`);
      }

      const generationTime = Date.now() - startTime;

      return {
        success: true,
        content,
        metadata: {
          provider,
          modelUsed: model,
          tokensUsed,
          generationTimeMs: generationTime
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new LLMProviderService();
