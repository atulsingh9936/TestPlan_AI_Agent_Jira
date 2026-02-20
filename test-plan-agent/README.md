# Test Plan AI Agent

A full-stack web application that automates test plan creation by integrating JIRA ticket data with LLM-powered analysis using customizable templates.

## Features

- **JIRA Integration**: Fetch tickets directly from JIRA
- **LLM Providers**: Support for both Groq (cloud) and Ollama (local) LLMs
- **PDF Templates**: Upload and use custom test plan templates
- **Real-time Generation**: Stream LLM responses for faster feedback
- **Export Options**: Copy to clipboard or download as Markdown

## Project Structure

```
test-plan-agent/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── database/  # SQLite database
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # JIRA, LLM, PDF services
│   │   └── server.js  # Main entry point
│   └── package.json
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── templates/         # PDF template storage
```

## Quick Start

### 1. Backend Setup

Open PowerShell/Command Prompt in `test-plan-agent/backend`:

```bash
cd C:\Users\Apex\Documents\AitesterBlueprint\Project7-TestPlan_AI_Agent_Jira\test-plan-agent\backend
npm install
npm start
```

Backend will start on `http://localhost:3001`

### 2. Frontend Setup

Open another PowerShell/Command Prompt in `test-plan-agent/frontend`:

```bash
cd C:\Users\Apex\Documents\AitesterBlueprint\Project7-TestPlan_AI_Agent_Jira\test-plan-agent\frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:5173`

### 3. Open Browser

Navigate to `http://localhost:5173` to use the application.

## Configuration

1. **JIRA**: Go to Settings → JIRA Configuration
   - Base URL: `https://your-domain.atlassian.net`
   - Username: Your email
   - API Token: From [Atlassian Account](https://id.atlassian.com/manage-profile/security/api-tokens)

2. **LLM Provider**: Go to Settings → LLM Provider
   - **Groq**: Enter API key from [Groq Console](https://console.groq.com/keys)
   - **Ollama**: Ensure Ollama is running locally on `http://localhost:11434`

## Usage

1. Enter a JIRA ticket ID (e.g., `VWO-123`)
2. Click "Fetch" to load ticket details
3. Select a template (optional)
4. Click "Generate Test Plan"
5. Copy or download the generated test plan

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/settings/jira` | GET/POST | JIRA configuration |
| `/api/settings/llm` | GET/POST | LLM configuration |
| `/api/jira/fetch` | POST | Fetch JIRA ticket |
| `/api/templates` | GET | List templates |
| `/api/templates/upload` | POST | Upload PDF template |
| `/api/testplan/generate` | POST | Generate test plan |

## Technologies

- **Backend**: Node.js, Express, SQLite3
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Integrations**: JIRA REST API, Groq API, Ollama API
