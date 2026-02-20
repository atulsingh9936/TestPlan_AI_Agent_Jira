export interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  description: string;
  priority: string;
  status: string;
  assignee: string;
  labels: string[];
  acceptanceCriteria?: string;
}

export interface JiraSettings {
  baseUrl: string;
  username: string;
  apiToken: string;
}

export interface LLMSettings {
  provider: 'groq' | 'ollama';
  groq: {
    apiKey: string;
    model: string;
    temperature: number;
  };
  ollama: {
    baseUrl: string;
    model: string;
  };
}

export interface Template {
  id: string;
  name: string;
  filename: string;
  content?: string;
  sections?: Array<{ title: string; content: string }>;
  created_at: string;
}

export interface TestPlan {
  id: string;
  content: string;
  metadata: {
    provider: string;
    modelUsed: string;
    tokensUsed: number;
    generationTimeMs: number;
  };
}

export interface RecentTicket {
  ticket_key: string;
  ticket_id: string;
  summary?: string;
  accessed_at: string;
}
