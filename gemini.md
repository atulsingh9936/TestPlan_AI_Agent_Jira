# Gemini.md - Project Constitution

**Project:** B.L.A.S.T. AI Agent Jira Automation  
**Created:** 2026-02-19  
**Status:** Phase 0 - Initialized

---

## 📋 Project Map & State

| Phase | Status | Notes |
|-------|--------|-------|
| 0 - Initialization | ✅ Complete | Project memory files created |
| 1 - Blueprint | ✅ Complete | Discovery done, schemas defined, research complete |
| 2 - Link | ⏳ Ready | Awaiting API credential verification |
| 3 - Architect | ⏳ Pending | |
| 4 - Stylize | ⏳ Pending | |
| 5 - Trigger | ⏳ Pending | |

---

## 🗂️ Data Schemas

### 1. JIRA Configuration Input
```json
{
  "baseUrl": "https://company.atlassian.net",
  "username": "email@company.com",
  "apiToken": "encrypted_string",
  "isValid": true
}
```

### 2. LLM Provider Configuration
```json
{
  "provider": "groq" | "ollama",
  "groq": {
    "apiKey": "encrypted_string",
    "model": "llama3-70b" | "mixtral-8x7b",
    "temperature": 0.7
  },
  "ollama": {
    "baseUrl": "http://localhost:11434",
    "model": "llama3.2"
  }
}
```

### 3. JIRA Ticket Data (API Response)
```json
{
  "key": "VWO-123",
  "summary": "Feature description",
  "description": "Detailed description...",
  "priority": "High" | "Medium" | "Low",
  "status": "In Progress",
  "assignee": "John Doe",
  "labels": ["qa", "automation"],
  "acceptanceCriteria": "Parsed from description...",
  "attachments": [{"filename": "spec.pdf", "url": "..."}]
}
```

### 4. Template Structure (Extracted from PDF)
```json
{
  "id": "template_001",
  "name": "Standard Test Plan",
  "sections": [
    {"title": "Overview", "content": "..."},
    {"title": "Test Scenarios", "content": "..."},
    {"title": "Test Cases", "content": "..."}
  ],
  "rawText": "Full extracted text..."
}
```

### 5. Test Plan Generation Request
```json
{
  "ticketId": "VWO-123",
  "templateId": "template_001",
  "provider": "groq" | "ollama"
}
```

### 6. Test Plan Generation Output (Payload)
```json
{
  "id": "plan_001",
  "ticketId": "VWO-123",
  "templateId": "template_001",
  "generatedAt": "2026-02-19T21:30:00Z",
  "content": "# Test Plan for VWO-123\n\n## Overview...",
  "metadata": {
    "modelUsed": "llama3-70b",
    "tokensUsed": 1500,
    "generationTimeMs": 4500
  }
}
```

### 7. API Response Wrapper
```json
{
  "success": true | false,
  "data": {},
  "error": {
    "code": "JIRA_FETCH_FAILED",
    "message": "Ticket not found"
  }
}
```

---

## 🚦 Behavioral Rules

### Must Do
- Follow Data-First Rule - define schemas before coding
- Update this file when schemas or architecture changes
- Use Self-Annealing repair loop on tool failures
- All tools must be atomic and testable

### Must NOT Do
- Write scripts in `tools/` before Discovery complete
- Guess at business logic
- Skip the Link phase (API verification)

---

## 🏗️ Architectural Invariants

### 3-Layer Architecture
1. **Layer 1 - Architecture/**: SOPs in Markdown
2. **Layer 2 - Navigation**: Decision/routing logic
3. **Layer 3 - Tools/**: Python scripts (deterministic)

### Directory Structure
```
├── gemini.md          # This file - Project Constitution
├── .env               # API Keys/Secrets
├── architecture/      # Layer 1: SOPs
├── tools/             # Layer 3: Python Scripts
└── .tmp/              # Temporary Workbench
```

---

## 🔧 Maintenance Log

| Date | Action | Details |
|------|--------|---------|
| 2026-02-19 | Initialized | Project memory files created |

---

*Last Updated: 2026-02-19*
