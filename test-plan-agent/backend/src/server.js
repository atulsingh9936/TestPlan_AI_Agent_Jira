import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import settingsRoutes from './routes/settings.js';
import jiraRoutes from './routes/jira.js';
import templatesRoutes from './routes/templates.js';
import testplanRoutes from './routes/testplan.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/settings', settingsRoutes);
app.use('/api/jira', jiraRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/testplan', testplanRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test Plan Agent Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   - Settings: /api/settings`);
  console.log(`   - JIRA:     /api/jira`);
  console.log(`   - Templates:/api/templates`);
  console.log(`   - TestPlan: /api/testplan`);
});

export default app;
