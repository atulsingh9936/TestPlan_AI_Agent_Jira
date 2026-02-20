# Test Plan AI Agent

A full-stack web application that automates test plan creation by integrating JIRA ticket data with LLM-powered analysis using customizable templates.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)

## 🎯 Features

- **JIRA Integration** - Fetch tickets directly from JIRA using REST API
- **Dual LLM Support** - Support for both Groq (cloud) and Ollama (local) LLMs
- **PDF Templates** - Upload and use custom test plan templates
- **AI-Powered Generation** - Generate comprehensive test plans with proper test cases
- **Real-time Streaming** - Stream LLM responses for faster feedback
- **Export Options** - Copy to clipboard or download as Markdown
- **Persistent Storage** - SQLite database for settings and history

## 🏗️ Architecture

```
TestPlan_AI_Agent_Jira/
├── test-plan-agent/           # Main application
│   ├── backend/              # Node.js + Express API
│   │   ├── src/
│   │   │   ├── database/     # SQLite database layer
│   │   │   ├── routes/       # API endpoints
│   │   │   └── services/     # JIRA, LLM, PDF services
│   │   └── package.json
│   ├── frontend/             # React + Vite + TypeScript
│   │   ├── src/
│   │   │   ├── components/   # UI components
│   │   │   ├── pages/        # Dashboard, Settings, Templates
│   │   │   └── services/     # API client
│   │   └── package.json
│   ├── templates/            # PDF template storage
│   └── README.md
├── Prompt/                   # Project documentation
│   ├── prompt.md            # Initial requirements
│   └── conversation.md      # Development log
├── Blast.md                 # B.L.A.S.T. framework guide
├── gemini.md               # Project constitution
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- JIRA account with API token
- Groq API key (for cloud LLM) or Ollama (for local LLM)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/atulsingh9936/TestPlan_AI_Agent_Jira.git
cd TestPlan_AI_Agent_Jira/test-plan-agent
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

#### Option 1: Using start.bat (Windows)
```bash
cd test-plan-agent
start.bat
```

#### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd test-plan-agent/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd test-plan-agent/frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## ⚙️ Configuration

### 1. JIRA Setup

1. Go to **Settings** → **JIRA Configuration**
2. Enter your details:
   - **Base URL**: `https://your-domain.atlassian.net`
   - **Username**: Your email address
   - **API Token**: Generate from [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
3. Click **Test Connection**
4. Click **Save JIRA Settings**

### 2. LLM Provider Setup

#### Option A: Groq (Cloud - Recommended)
1. Get API key from [Groq Console](https://console.groq.com/keys)
2. In Settings → LLM Provider:
   - Select **Groq**
   - Enter API Key
   - Choose model: `llama-3.3-70b-versatile` (recommended)
   - Adjust temperature (0.0 - 1.0)
3. Save settings

#### Option B: Ollama (Local)
1. Install [Ollama](https://ollama.com/)
2. Pull a model: `ollama pull llama3.2`
3. In Settings → LLM Provider:
   - Select **Ollama**
   - Base URL: `http://localhost:11434`
   - Model: `llama3.2`
4. Save settings

### 3. Upload Template (Optional)

1. Go to **Templates** page
2. Upload a PDF test plan template
3. The AI will use this structure when generating test plans

## 📝 Usage

### Generate a Test Plan

1. **Fetch JIRA Ticket**:
   - Enter ticket ID (e.g., `PROJ-123`)
   - Click **Fetch**
   - Review ticket details

2. **Select Template** (optional):
   - Choose from uploaded templates
   - Or use default structure

3. **Generate**:
   - Click **Generate Test Plan**
   - Wait for AI generation
   - Review the generated test plan

4. **Export**:
   - **Copy** to clipboard
   - **Download** as Markdown file

### Test Plan Output Format

The generated test plan includes:

```markdown
# Test Plan for [TICKET-ID]: [Summary]

## 1. Overview
Brief description of the feature being tested

## 2. Test Scope
### In Scope
- Features to be tested

### Out of Scope
- Features not covered

## 3. Test Scenarios
1. Happy path flow
2. Alternative flow
3. Error handling
...

## 4. Detailed Test Cases

### TC-001: [Test Case Title]
**Priority:** High

**Preconditions:**
- Setup requirements

**Test Steps:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
Clear description of expected outcome

**Traceability:** Maps to Acceptance Criteria: AC-1

## 5. Test Data Requirements
- User accounts
- Test inputs

## 6. Entry and Exit Criteria
- When to start/stop testing

## 7. Risks and Mitigation
- Potential risks and strategies
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/settings/jira` | GET/POST | JIRA configuration |
| `/api/settings/jira/test` | POST | Test JIRA connection |
| `/api/settings/llm` | GET/POST | LLM configuration |
| `/api/settings/llm/test-groq` | POST | Test Groq connection |
| `/api/settings/llm/test-ollama` | POST | Test Ollama connection |
| `/api/jira/fetch` | POST | Fetch JIRA ticket by ID |
| `/api/jira/recent` | GET | Get recently fetched tickets |
| `/api/templates` | GET | List uploaded templates |
| `/api/templates/upload` | POST | Upload PDF template |
| `/api/testplan/generate` | POST | Generate test plan |
| `/api/testplan/stream` | GET | Stream test plan generation |

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite3
- **Integrations**: 
  - JIRA REST API (jira-client)
  - Groq API (groq-sdk)
  - Ollama API (ollama)
  - PDF Parsing (pdf-parse)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **HTTP Client**: Axios

## 🔒 Security

- API keys stored in SQLite (not localStorage)
- CORS restricted to localhost
- Input validation for JIRA IDs
- File size limits for uploads (< 5MB)

## 🐛 Troubleshooting

### Backend won't start (Port 3001 in use)
```bash
# Kill processes on port 3001
npx kill-port 3001
```

### JIRA authentication fails
- Verify API token is valid
- Check base URL format (no trailing slash)
- Ensure you have project permissions

### Groq model decommissioned error
- Update to a valid model: `llama-3.3-70b-versatile`
- Check [Groq docs](https://console.groq.com/docs/deprecations) for latest models

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check CORS settings in `backend/src/server.js`

## 📁 Project Structure

### B.L.A.S.T. Framework
This project was built using the **B.L.A.S.T.** methodology:
- **B**lueprint - Discovery and data schema definition
- **L**ink - API verification and connectivity
- **A**rchitect - 3-layer architecture (SOPs/Navigation/Tools)
- **S**tylize - UI/UX refinement
- **T**rigger - Deployment and automation

See `Blast.md` for detailed framework documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [B.L.A.S.T. Framework](https://github.com)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Created by:** Atul Singh  
**GitHub:** [@atulsingh9936](https://github.com/atulsingh9936)
