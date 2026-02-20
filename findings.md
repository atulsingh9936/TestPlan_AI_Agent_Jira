# Findings - Research & Discoveries

## Project: B.L.A.S.T. AI Agent Jira Automation

---

## Research Log

### Date: 2026-02-19
**Status:** Phase 1 - Blueprint Complete

#### Initial Discovery
- Project uses B.L.A.S.T. protocol (Blueprint, Link, Architect, Stylize, Trigger)
- A.N.T. 3-layer architecture (Architecture/Navigation/Tools)
- Target: Full-stack Test Plan Generator with JIRA + LLM integration

---

## Phase 1: Research Findings

### JIRA Integration Resources
| Resource | URL | Notes |
|----------|-----|-------|
| `node-jira-client` | https://github.com/jira-node/node-jira-client | Object-oriented wrapper for JIRA REST API |
| JIRA REST API Examples | https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/ | Official Atlassian examples |
| JIRA API Topics | https://github.com/topics/jira-api | Community libraries |

**Decision:** Use `node-jira-client` npm package for cleaner code, or raw axios/fetch for more control.

### Groq Integration Resources
| Resource | URL | Notes |
|----------|-----|-------|
| Official Groq TypeScript SDK | https://github.com/groq/groq-typescript | Official SDK, server-side only |
| Vercel AI SDK + Groq Example | https://github.com/Xeven777/next-groq | Fast chatbot implementation |
| Groq API Topics | https://github.com/topics/groq-api | Community projects |

**Decision:** Use official `groq-sdk` npm package.

### Ollama Integration Resources
| Resource | URL | Notes |
|----------|-----|-------|
| Official Ollama Repo | https://github.com/ollama/ollama | REST API docs |
| Ollama JavaScript Library | https://github.com/ollama/ollama-js | Official JS client |
| Ollama API Docs | https://docs.ollama.com/api/introduction | Official documentation |

**Decision:** Use official `ollama` npm package for JavaScript.

---

## Technology Decisions Made

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Frontend** | React + Vite + TypeScript + Tailwind + shadcn/ui | As specified in requirements |
| **Backend** | Node.js + Express | Faster setup, JS ecosystem alignment |
| **Database** | SQLite + `better-sqlite3` | Simple, file-based, no setup |
| **PDF Parsing** | `pdf-parse` or `pdf2json` | Extract text from templates |
| **Security** | `keytar` | OS keychain for API tokens |
| **Streaming** | Server-Sent Events (SSE) | Real-time LLM output |

---

## API Endpoints Summary

### Settings
- `POST /api/settings/jira` - Save JIRA credentials
- `GET /api/settings/jira` - Get connection status
- `POST /api/settings/llm` - Save LLM config
- `GET /api/settings/llm/models` - List Ollama models

### JIRA
- `POST /api/jira/fetch` - Fetch ticket by ID
- `GET /api/jira/recent` - Get recently fetched tickets

### Test Plan
- `POST /api/testplan/generate` - Generate test plan
- `GET /api/testplan/stream` - SSE for real-time generation

### Templates
- `POST /api/templates/upload` - Upload PDF template
- `GET /api/templates` - List available templates

---

## Constraints Identified

1. **Desktop-first design** - min width 1024px
2. **Local deployment only** - localhost restriction
3. **API key security** - Never in localStorage, use OS keychain
4. **File size limit** - PDF templates < 5MB
5. **Timeout requirements** - Groq 30s, Ollama 120s
6. **Retry logic** - 3 attempts with exponential backoff

---

## Constraints Identified

*To be populated during Phase 1 Discovery*

---

## External Resources Found

*To be populated during research phase*

---

## API Documentation References

*To be populated during Link phase*

---

## Key Learnings

*To be updated throughout project lifecycle*
