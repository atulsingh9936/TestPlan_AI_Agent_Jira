import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbAsync } from '../database/db.js';
import jiraClient from '../services/jira-client.js';
import llmProvider from '../services/llm-provider.js';
import pdfService from '../services/pdf-service.js';

const router = express.Router();

// Generate test plan
router.post('/generate', async (req, res) => {
  try {
    const { ticketId, templateId, provider, model } = req.body;
    
    if (!ticketId) {
      return res.status(400).json({ success: false, error: 'Ticket ID is required' });
    }
    
    // Fetch ticket data
    const ticketResult = await jiraClient.fetchTicket(ticketId);
    if (!ticketResult.success) {
      return res.status(400).json(ticketResult);
    }
    
    // Get template
    let template = { content: 'Standard test plan structure' };
    if (templateId) {
      const templateResult = await pdfService.getTemplateById(templateId);
      if (templateResult.success && templateResult.template) {
        template = templateResult.template;
      }
    }
    
    // Get provider settings
    const providerSetting = await dbAsync.get("SELECT value FROM settings WHERE key = 'llm_provider'");
    const actualProvider = provider || providerSetting?.value || 'groq';
    
    let modelToUse = model;
    if (!modelToUse) {
      if (actualProvider === 'groq') {
        const groqModel = await dbAsync.get("SELECT value FROM settings WHERE key = 'groq_model'");
        modelToUse = groqModel?.value || 'llama-3.3-70b-versatile';
      } else {
        const ollamaModel = await dbAsync.get("SELECT value FROM settings WHERE key = 'ollama_model'");
        modelToUse = ollamaModel?.value || 'llama3.2';
      }
    }
    
    // Generate test plan
    const result = await llmProvider.generateTestPlan(
      ticketResult.data,
      template,
      actualProvider,
      modelToUse
    );
    
    if (!result.success) {
      return res.status(500).json(result);
    }
    
    // Save to database
    const planId = uuidv4();
    await dbAsync.run(`
      INSERT INTO test_plans (id, ticket_id, template_id, content, provider, model_used, tokens_used, generation_time_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      planId,
      ticketResult.data.id,
      templateId,
      result.content,
      result.metadata.provider,
      result.metadata.modelUsed,
      result.metadata.tokensUsed,
      result.metadata.generationTimeMs
    ]);
    
    res.json({
      success: true,
      data: {
        id: planId,
        content: result.content,
        metadata: result.metadata
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stream test plan generation
router.get('/stream', async (req, res) => {
  const { ticketId, templateId, provider, model } = req.query;
  
  if (!ticketId) {
    return res.status(400).json({ success: false, error: 'Ticket ID is required' });
  }
  
  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  try {
    // Fetch ticket data
    const ticketResult = await jiraClient.fetchTicket(ticketId);
    if (!ticketResult.success) {
      res.write(`data: ${JSON.stringify({ error: ticketResult.error })}\n\n`);
      res.end();
      return;
    }
    
    // Get template
    let template = { content: 'Standard test plan structure' };
    if (templateId) {
      const templateResult = await pdfService.getTemplateById(templateId);
      if (templateResult.success && templateResult.template) {
        template = templateResult.template;
      }
    }
    
    // Get provider settings
    const providerSetting = await dbAsync.get("SELECT value FROM settings WHERE key = 'llm_provider'");
    const actualProvider = provider || providerSetting?.value || 'groq';
    
    let modelToUse = model;
    if (!modelToUse) {
      if (actualProvider === 'groq') {
        const groqModel = await dbAsync.get("SELECT value FROM settings WHERE key = 'groq_model'");
        modelToUse = groqModel?.value || 'llama-3.3-70b-versatile';
      } else {
        const ollamaModel = await dbAsync.get("SELECT value FROM settings WHERE key = 'ollama_model'");
        modelToUse = ollamaModel?.value || 'llama3.2';
      }
    }
    
    let fullContent = '';
    
    // Generate with streaming
    const result = await llmProvider.generateTestPlan(
      ticketResult.data,
      template,
      actualProvider,
      modelToUse,
      (chunk) => {
        fullContent += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    );
    
    if (result.success) {
      // Save to database
      const planId = uuidv4();
      await dbAsync.run(`
        INSERT INTO test_plans (id, ticket_id, template_id, content, provider, model_used, tokens_used, generation_time_ms)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        planId,
        ticketResult.data.id,
        templateId,
        fullContent,
        result.metadata.provider,
        result.metadata.modelUsed,
        result.metadata.tokensUsed,
        result.metadata.generationTimeMs
      ]);
      
      res.write(`data: ${JSON.stringify({ done: true, id: planId, metadata: result.metadata })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: result.error })}\n\n`);
    }
    
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Get test plan history
router.get('/history', async (req, res) => {
  try {
    const plans = await dbAsync.all(`
      SELECT tp.*, jt.key as ticket_key, jt.summary
      FROM test_plans tp
      JOIN jira_tickets jt ON tp.ticket_id = jt.id
      ORDER BY tp.created_at DESC
      LIMIT 20
    `);
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
