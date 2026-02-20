# B.L.A.S.T. AI Agent - Project Conversation Log

**Project:** Test Plan AI Agent (JIRA + LLM Integration)  
**Date:** 2026-02-19  
**Framework:** B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger)

---

## Initial Request

**User:** cd C:\Users\Apex\Documents\AitesterBlueprint\Project7-TestPlan_AI_Agent_Jira

**Kimi:** Acknowledged the directory and listed the existing files:
- Blast.md
- findings.md
- progress.md
- task_plan.md

---

## Phase 0: Initialization

**User:** @Blast.md lets start working on the project. Please use the BLAST framework and start phase number 0

**Kimi:** Read Blast.md and found that the project memory files (task_plan.md, findings.md, progress.md) didn't exist. Created all Phase 0 initialization files:

1. **task_plan.md** - Project phases and checklists
2. **findings.md** - Research and discoveries log
3. **progress.md** - Work tracking
4. **gemini.md** - Project Constitution

**Status:** ✅ Phase 0 Complete

---

## Phase 1: Blueprint (Vision & Logic)

**User:** @Prompt/prompt.md Please use this @Blast.md phase1 in the frame, I want you to go one by one, give me the details also what you are doing

**Kimi:** Read the prompt.md which contained requirements for:
- Full-stack web application for automated test plan generation
- JIRA integration + LLM (Groq/Ollama) + PDF templates
- React frontend, Node.js backend, SQLite database

### Step 1: Discovery - Answered 5 Questions

| Question | Answer |
|----------|--------|
| **North Star** | Build full-stack web app that automates test plan creation from JIRA + LLM + Templates |
| **Integrations** | JIRA REST API, Groq API, Ollama API, SQLite |
| **Source of Truth** | JIRA tickets, PDF templates, SQLite database |
| **Delivery Payload** | Generated test plans (Markdown/PDF/Clipboard) |
| **Behavioral Rules** | Security (no localStorage), timeouts, retry logic |

### Step 2: Data Schema Definition
Defined 7 JSON schemas in gemini.md:
1. JIRA Configuration Input
2. LLM Provider Configuration
3. JIRA Ticket Data
4. Template Structure
5. Test Plan Generation Request
6. Test Plan Generation Output
7. API Response Wrapper

### Step 3: Research
Found libraries:
- JIRA: `node-jira-client`
- Groq: Official `groq-sdk`
- Ollama: Official `ollama` JS client
- PDF: `pdf-parse`

**Status:** ✅ Phase 1 Complete

---

## Full Application Build

**User:** Please start create the full Test Plan AI Agent, open the browser when you are done

**Kimi:** Built the complete full-stack application:

### Backend (Node.js + Express)
- **Database:** SQLite with tables for settings, tickets, templates, test plans
- **Services:**
  - `jira-client.js` - JIRA REST API integration
  - `llm-provider.js` - Groq and Ollama integration
  - `pdf-service.js` - PDF template parsing
- **Routes:**
  - `/api/settings` - JIRA and LLM configuration
  - `/api/jira` - Fetch tickets, recent history
  - `/api/templates` - Upload and manage PDF templates
  - `/api/testplan` - Generate test plans

### Frontend (React + Vite + TypeScript)
- **Pages:**
  - Dashboard - Fetch JIRA tickets, generate test plans
  - Settings - Configure JIRA, Groq, Ollama
  - Templates - Upload and preview PDF templates
- **UI Components:** Button, Card, Input, Label, Tabs, Switch, Select, Slider, Badge
- **Styling:** Tailwind CSS with shadcn/ui components

### File Structure
```
test-plan-agent/
├── backend/
│   ├── src/
│   │   ├── database/db.js
│   │   ├── services/jira-client.js
│   │   ├── services/llm-provider.js
│   │   ├── services/pdf-service.js
│   │   ├── routes/settings.js
│   │   ├── routes/jira.js
│   │   ├── routes/templates.js
│   │   ├── routes/testplan.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ui/
│   │   ├── pages/Dashboard.tsx
│   │   ├── pages/Settings.tsx
│   │   ├── pages/Templates.tsx
│   │   ├── services/api.ts
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── templates/
```

---

## Issue Fixes During Build

### Issue 1: better-sqlite3 Native Compilation
**Error:** Python/build tools not available for better-sqlite3
**Fix:** Switched to `sqlite3` package with async wrapper

### Issue 2: Tailwind CSS Animate Missing
**Error:** `[postcss] Cannot find module 'tailwindcss-animate'`
**Fix:** Installed `tailwindcss-animate` package

### Issue 3: Frontend Path Aliases
**Error:** `@/` imports not resolving
**Fix:** Updated vite.config.ts with resolve.alias

### Issue 4: JIRA Authentication Failed
**Error:** `"Client must be authenticated to access this resource."`
**Fix:** User needed to generate new API token from Atlassian

### Issue 5: Groq Model Decommissioned
**Error:** `"The model llama3-70b-8192 has been decommissioned"`
**Fix:** Updated all model references to `llama-3.3-70b-versatile`

### Issue 6: Groq Model Not in Dropdown
**Fix:** Updated GROQ_MODELS array in Settings.tsx

---

## Test Plan Generation Improvements

**User:** The test plan which is created is not proper according to requiremnt and template provided kindly give me proper Test case

**Kimi:** Completely rewrote the LLM prompt in `llm-provider.js` with:

### New System Prompt
- Expert QA Engineer persona (10+ years experience)
- Strict template structure adherence
- Proper test case format requirements

### New User Prompt Structure
1. JIRA Ticket Information (Key, Summary, Priority, Description, Acceptance Criteria)
2. Template Structure (parsed sections)
3. Generation Instructions

### Required Output Sections
1. **Overview** - Feature description, ticket reference
2. **Test Scope** - In-scope and Out-of-scope
3. **Test Scenarios** - 5-10 high-level scenarios
4. **Detailed Test Cases** with format:
   - TC-ID
   - Title
   - Priority
   - Preconditions
   - Test Steps (numbered)
   - Expected Result
   - Traceability to Acceptance Criteria
5. **Test Data Requirements**
6. **Entry/Exit Criteria**
7. **Risks & Mitigation**

### Features Added
- Template section parsing
- Acceptance criteria traceability
- Edge case and boundary value analysis
- Both positive and negative test scenarios
- Professional QA terminology

---

## Commands Used

### Start Backend
```bash
cd C:\Users\Apex\Documents\AitesterBlueprint\Project7-TestPlan_AI_Agent_Jira\test-plan-agent\backend
npm start
```

### Start Frontend
```bash
cd C:\Users\Apex\Documents\AitesterBlueprint\Project7-TestPlan_AI_Agent_Jira\test-plan-agent\frontend
npm run dev
```

### Quick Start Script
Created `start.bat` for one-click startup

---

## Final URLs

| Service | URL |
|---------|-----|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:3001 |

---

## User Tickets Tested

- **KAN-4** - JIRA ticket for testing (authentication issues resolved)

---

## Valid Groq Models (Updated)

- `llama-3.3-70b-versatile` (recommended)
- `llama-3.1-8b-instant`
- `llama3-8b-8192`
- `mixtral-8x7b-32768`
- `gemma-7b-it`

---

## Files Created

### Backend
- src/server.js
- src/database/db.js
- src/services/jira-client.js
- src/services/llm-provider.js
- src/services/pdf-service.js
- src/routes/settings.js
- src/routes/jira.js
- src/routes/templates.js
- src/routes/testplan.js
- .env.example

### Frontend
- src/App.tsx
- src/main.tsx
- src/index.css
- src/pages/Dashboard.tsx
- src/pages/Settings.tsx
- src/pages/Templates.tsx
- src/services/api.ts
- src/types/index.ts
- src/components/ui/*.tsx
- vite.config.ts
- tailwind.config.js
- postcss.config.js
- tsconfig.json

### Documentation
- README.md
- start.bat

---

## Status: ✅ COMPLETE

All phases of B.L.A.S.T. framework completed:
- ✅ Phase 0: Initialization
- ✅ Phase 1: Blueprint
- ✅ Phase 2: Link (APIs configured)
- ✅ Phase 3: Architect (3-layer build)
- ✅ Phase 4: Stylize (UI/UX)
- ✅ Phase 5: Trigger (Servers running)

---

*End of Conversation Log*
