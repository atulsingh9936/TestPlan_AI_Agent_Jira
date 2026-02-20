import JiraApi from 'jira-client';
import { dbAsync } from '../database/db.js';

class JiraClientService {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  async initializeClient() {
    try {
      const baseUrl = await dbAsync.get("SELECT value FROM settings WHERE key = 'jira_base_url'");
      const username = await dbAsync.get("SELECT value FROM settings WHERE key = 'jira_username'");
      const apiToken = await dbAsync.get("SELECT value FROM settings WHERE key = 'jira_api_token'");

      if (baseUrl && username && apiToken) {
        // Clean up the base URL
        let host = baseUrl.value.trim()
          .replace('https://', '')
          .replace('http://', '')
          .replace(/\/$/, ''); // Remove trailing slash

        this.client = new JiraApi({
          protocol: 'https',
          host: host,
          username: username.value.trim(),
          password: apiToken.value.trim(),
          apiVersion: '3',
          strictSSL: true
        });
        
        console.log(`JIRA client initialized for: ${host}`);
      }
    } catch (error) {
      console.error('Failed to initialize JIRA client:', error);
    }
  }

  isConfigured() {
    return this.client !== null;
  }

  async testConnection() {
    try {
      if (!this.isConfigured()) {
        return { success: false, error: 'JIRA not configured' };
      }
      const user = await this.client.getCurrentUser();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async fetchTicket(ticketKey) {
    try {
      if (!this.isConfigured()) {
        throw new Error('JIRA client not configured');
      }

      console.log(`Fetching ticket: ${ticketKey}`);
      
      const issue = await this.client.findIssue(ticketKey.toUpperCase(), 'description,status,priority,assignee,labels');
      
      const ticketData = {
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        description: this.extractTextFromADF(issue.fields.description),
        priority: issue.fields.priority?.name || 'Unknown',
        status: issue.fields.status?.name || 'Unknown',
        assignee: issue.fields.assignee?.displayName || 'Unassigned',
        labels: JSON.stringify(issue.fields.labels || []),
        acceptanceCriteria: this.extractAcceptanceCriteria(issue.fields),
        raw_data: JSON.stringify(issue)
      };

      // Save to database
      await dbAsync.run(`
        INSERT OR REPLACE INTO jira_tickets 
        (id, key, summary, description, priority, status, assignee, labels, acceptance_criteria, raw_data, fetched_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        ticketData.id, ticketData.key, ticketData.summary, ticketData.description,
        ticketData.priority, ticketData.status, ticketData.assignee,
        ticketData.labels, ticketData.acceptanceCriteria, ticketData.raw_data
      ]);

      // Update recent tickets
      await dbAsync.run(`
        INSERT OR REPLACE INTO recent_tickets (ticket_key, ticket_id, accessed_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `, [ticketData.key, ticketData.id]);

      console.log(`Ticket fetched successfully: ${ticketData.key}`);
      return { success: true, data: ticketData };
    } catch (error) {
      console.error(`Error fetching ticket ${ticketKey}:`, error);
      
      // Provide more helpful error messages
      let errorMessage = error.message;
      if (error.message.includes('Issue does not exist')) {
        errorMessage = `Ticket "${ticketKey}" not found or you don't have permission to view it.`;
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please check your JIRA API token.';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  async searchTickets(query = '', maxResults = 10) {
    try {
      if (!this.isConfigured()) {
        throw new Error('JIRA client not configured');
      }

      const jql = query ? `text ~ "${query}"` : 'order by created DESC';
      const result = await this.client.searchJira(jql, { maxResults });
      
      return { 
        success: true, 
        issues: result.issues.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status?.name,
          priority: issue.fields.priority?.name
        }))
      };
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, error: error.message };
    }
  }

  async getProjects() {
    try {
      if (!this.isConfigured()) {
        throw new Error('JIRA client not configured');
      }

      const projects = await this.client.listProjects();
      return { 
        success: true, 
        projects: projects.map(p => ({
          key: p.key,
          name: p.name,
          id: p.id
        }))
      };
    } catch (error) {
      console.error('Get projects error:', error);
      return { success: false, error: error.message };
    }
  }

  extractTextFromADF(adf) {
    if (!adf) return '';
    if (typeof adf === 'string') return adf;
    
    let text = '';
    if (adf.content) {
      for (const node of adf.content) {
        text += this.extractTextFromNode(node) + '\n';
      }
    }
    return text.trim();
  }

  extractTextFromNode(node) {
    if (!node) return '';
    if (node.text) return node.text;
    if (node.content) {
      return node.content.map(child => this.extractTextFromNode(child)).join('');
    }
    return '';
  }

  extractAcceptanceCriteria(fields) {
    const description = this.extractTextFromADF(fields.description);
    const match = description.match(/acceptance criteria:?(.+?)(?=\n\n|$)/is);
    return match ? match[1].trim() : '';
  }

  async getRecentTickets(limit = 5) {
    try {
      const tickets = await dbAsync.all(`
        SELECT rt.ticket_key, rt.accessed_at, jt.summary
        FROM recent_tickets rt
        LEFT JOIN jira_tickets jt ON rt.ticket_id = jt.id
        ORDER BY rt.accessed_at DESC
        LIMIT ?
      `, [limit]);
      return tickets;
    } catch (error) {
      return [];
    }
  }
}

export default new JiraClientService();
