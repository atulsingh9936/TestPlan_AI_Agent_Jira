import express from 'express';
import jiraClient from '../services/jira-client.js';

const router = express.Router();

// Fetch ticket by ID
router.post('/fetch', async (req, res) => {
  try {
    const { ticketId } = req.body;
    
    if (!ticketId || !/^[A-Z]+-\d+$/.test(ticketId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid JIRA ticket ID format. Expected: PROJECT-123' 
      });
    }
    
    const result = await jiraClient.fetchTicket(ticketId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search for tickets
router.get('/search', async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;
    const result = await jiraClient.searchTickets(query, parseInt(maxResults));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recent tickets
router.get('/recent', async (req, res) => {
  try {
    const tickets = await jiraClient.getRecentTickets(5);
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get accessible projects
router.get('/projects', async (req, res) => {
  try {
    const result = await jiraClient.getProjects();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
