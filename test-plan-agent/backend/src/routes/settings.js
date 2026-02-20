import express from 'express';
import { dbAsync } from '../database/db.js';
import jiraClient from '../services/jira-client.js';
import llmProvider from '../services/llm-provider.js';

const router = express.Router();

// Get JIRA settings
router.get('/jira', async (req, res) => {
  try {
    const baseUrl = await dbAsync.get("SELECT value FROM settings WHERE key = 'jira_base_url'");
    const username = await dbAsync.get("SELECT value FROM settings WHERE key = 'jira_username'");
    
    res.json({
      success: true,
      data: {
        baseUrl: baseUrl?.value || '',
        username: username?.value || '',
        apiToken: '***'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save JIRA settings
router.post('/jira', async (req, res) => {
  try {
    const { baseUrl, username, apiToken } = req.body;
    
    await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['jira_base_url', baseUrl]);
    await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['jira_username', username]);
    await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['jira_api_token', apiToken]);
    
    // Reinitialize JIRA client
    await jiraClient.initializeClient();
    
    res.json({ success: true, message: 'JIRA settings saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test JIRA connection
router.post('/jira/test', async (req, res) => {
  const result = await jiraClient.testConnection();
  res.json(result);
});

// Get LLM settings
router.get('/llm', async (req, res) => {
  try {
    const provider = await dbAsync.get("SELECT value FROM settings WHERE key = 'llm_provider'");
    const groqModel = await dbAsync.get("SELECT value FROM settings WHERE key = 'groq_model'");
    const groqTemp = await dbAsync.get("SELECT value FROM settings WHERE key = 'groq_temperature'");
    const ollamaUrl = await dbAsync.get("SELECT value FROM settings WHERE key = 'ollama_base_url'");
    const ollamaModel = await dbAsync.get("SELECT value FROM settings WHERE key = 'ollama_model'");
    
    res.json({
      success: true,
      data: {
        provider: provider?.value || 'groq',
        groq: {
          apiKey: '***',
          model: groqModel?.value || 'llama-3.3-70b-versatile',
          temperature: parseFloat(groqTemp?.value || '0.7')
        },
        ollama: {
          baseUrl: ollamaUrl?.value || 'http://localhost:11434',
          model: ollamaModel?.value || 'llama3.2'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save LLM settings
router.post('/llm', async (req, res) => {
  try {
    const { provider, groq, ollama } = req.body;
    
    await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['llm_provider', provider]);
    
    if (groq) {
      await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['groq_api_key', groq.apiKey]);
      await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['groq_model', groq.model]);
      await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['groq_temperature', groq.temperature.toString()]);
    }
    
    if (ollama) {
      await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['ollama_base_url', ollama.baseUrl]);
      await dbAsync.run(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, ['ollama_model', ollama.model]);
    }
    
    // Reinitialize LLM providers
    await llmProvider.initializeProviders();
    
    res.json({ success: true, message: 'LLM settings saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test Groq connection
router.post('/llm/test-groq', async (req, res) => {
  const { apiKey } = req.body;
  const result = await llmProvider.testGroqConnection(apiKey);
  res.json(result);
});

// Test Ollama connection
router.post('/llm/test-ollama', async (req, res) => {
  const { baseUrl } = req.body;
  const result = await llmProvider.testOllamaConnection(baseUrl);
  res.json(result);
});

// Get available Ollama models
router.get('/llm/models', async (req, res) => {
  const result = await llmProvider.getOllamaModels();
  res.json(result);
});

export default router;
