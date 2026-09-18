# 🔌 M.I.R.A.S Model Context Protocol (MCP) Tools

The **Model Context Protocol (MCP)** is an open, standardized protocol developed to connect AI models with tools, external APIs, and execution environments in an isolated, secure, and vendor-agnostic manner.

In M.I.R.A.S, the core AI agent logic is decoupled from tool implementations. All capabilities are exposed via dedicated MCP servers.

---

## 🛠 Active Capability Modules

### 1. Web & Browser Automation (Playwright MCP)

- **Primary Engine**: Playwright / Browserbase running headless or headful Chromium.
- **Capabilities**:
  - Full DOM interaction: clicking, typing, selecting dropdowns, scrolling.
  - Form filling automation (job portals: LinkedIn, Greenhouse, Lever, Workday, Indeed).
  - Web scraping, semantic summarization, price tracking, and screenshot capturing.
  - Handling dynamic single-page applications (SPAs) and JavaScript-heavy pages.
- **Safety Interlock**: Re-authentication and payment gateways require explicit user confirmation.

### 2. Personal Knowledge & Memory (RAG + Graph MCP)

- **Primary Engine**: Qdrant / PGVector (dense vectors) + Neo4j (property knowledge graph).
- **Capabilities**:
  - Ingestion and chunking of user resumes, codebases, personal notes, PDFs, and conversation transcripts.
  - Semantic hybrid search with metadata filtering.
  - Multi-hop entity relationship retrieval (_"Show all projects where I worked with Python and Docker"_).
  - Dynamic user preference and habit updates.

### 3. Office & Communication (Workspace MCP)

- **Primary Engine**: Google Workspace API / Microsoft Graph integration.
- **Capabilities**:
  - Gmail / Outlook email parsing, priority inbox filtering, auto-drafting responses.
  - Google Calendar event scheduling, clash detection, daily agenda generation.
  - Automated meeting note summaries and action item extraction.

### 4. Local Operating System & Code (Desktop MCP)

- **Primary Engine**: Sandboxed Python OS Server.
- **Capabilities**:
  - Safe filesystem operations: reading, writing, renaming, and organizing files.
  - Markdown/PDF document generation and report exports.
  - Shell command execution inside restricted sandboxes with output streaming.
  - Code syntax checking, linting, and automated test execution.

---

## 📋 MCP Communication Protocol

All communication between LangGraph sub-agents and MCP servers adheres to standard JSON-RPC 2.0:

```json
{
  "jsonrpc": "2.0",
  "id": "req-1029",
  "method": "tools/call",
  "params": {
    "name": "browser_navigate_and_fill",
    "arguments": {
      "url": "https://boards.greenhouse.io/example/jobs/123",
      "fields": {
        "full_name": "Jitendra Kumar",
        "email": "user@example.com",
        "resume_path": "/workspace/resume.pdf"
      }
    }
  }
}
```
