import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Settings API
export const settingsApi = {
  getJira: () => api.get('/settings/jira'),
  saveJira: (data: { baseUrl: string; username: string; apiToken: string }) => 
    api.post('/settings/jira', data),
  testJira: () => api.post('/settings/jira/test'),
  
  getLLM: () => api.get('/settings/llm'),
  saveLLM: (data: { provider: string; groq: any; ollama: any }) => 
    api.post('/settings/llm', data),
  testGroq: (apiKey: string) => api.post('/settings/llm/test-groq', { apiKey }),
  testOllama: (baseUrl: string) => api.post('/settings/llm/test-ollama', { baseUrl }),
  getOllamaModels: () => api.get('/settings/llm/models'),
};

// JIRA API
export const jiraApi = {
  fetchTicket: (ticketId: string) => api.post('/jira/fetch', { ticketId }),
  getRecent: () => api.get('/jira/recent'),
};

// Templates API
export const templatesApi = {
  getAll: () => api.get('/templates'),
  getById: (id: string) => api.get(`/templates/${id}`),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/templates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Test Plan API
export const testplanApi = {
  generate: (data: { ticketId: string; templateId?: string; provider?: string; model?: string }) =>
    api.post('/testplan/generate', data),
  streamGenerate: (params: { ticketId: string; templateId?: string; provider?: string; model?: string }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return new EventSource(`${API_BASE_URL}/testplan/stream?${queryParams}`);
  },
  getHistory: () => api.get('/testplan/history'),
};

export default api;
