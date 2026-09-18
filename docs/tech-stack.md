# 🛠 Tech Stack Specification & System Comparison

A breakdown of technologies selected for M.I.R.A.S, along with design trade-offs and comparative benchmarks.

---

## 1. Architectural Tech Stack

| Layer                    | Technology                                       | Primary Purpose                                                             | Key Benefit                                                          |
| :----------------------- | :----------------------------------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **Frontend Client**      | Next.js 14 (TypeScript, Tailwind CSS, Shadcn UI) | Real-time voice/chat UI, active task dashboard, tool execution visualizer   | SSR performance, WebSockets/WebRTC voice streaming, modern UI        |
| **Backend Gateway**      | FastAPI (Python 3.11+)                           | Async API gateway, WebSocket connection manager, streaming server           | Non-blocking high throughput, Pydantic type safety, async events     |
| **Agent Orchestration**  | LangGraph                                        | Stateful multi-agent state graph, cyclic routing, human-in-the-loop         | Deterministic control over LLM loops, pause/resume state execution   |
| **LLM Abstraction**      | LangChain Core                                   | Model routing (OpenAI, Anthropic Claude, Gemini), structured output parsing | Unified interface across LLM providers with automatic retry fallback |
| **Tool Integration**     | Model Context Protocol (MCP)                     | Standardized tool connection protocol (Browser, OS, APIs, DBs)              | Decoupled tool sandbox; unlimited pluggable capabilities             |
| **Web & Browser Engine** | Playwright / Browserbase (MCP Server)            | Automated web browsing, DOM interaction, form filling, scraping             | Handles job portals, travel sites, web tools, dynamic content        |
| **Local OS Control**     | Custom Python MCP Server                         | File system management, local CLI command execution, system stats           | Direct desktop integration for productivity and file handling        |
| **Observability**        | LangSmith                                        | Multi-agent execution tracing, prompt evaluation, token & cost tracking     | Step-by-step trace visualization and performance optimization        |
| **Vector DB (RAG)**      | Qdrant / PGVector                                | Storage for personal notes, docs, resume, conversation transcripts          | Sub-20ms hybrid vector search with metadata filtering                |
| **Knowledge Graph**      | Neo4j / NetworkX                                 | Entity graph memory (People, Projects, Preferences, Work History)           | Structured multi-hop relational context retrieval                    |
| **State Persistence**    | PostgreSQL / Redis                               | LangGraph checkpointer for state preservation across sessions               | Time-traveling agent state, instant recovery on worker restart       |

---

## 2. Comparison: Basic Chatbot vs. Universal Personal AI Assistant

| Dimension               | Basic Chatbot (ChatGPT Wrapper)  | Universal Personal AI Assistant Platform                   |
| :---------------------- | :------------------------------- | :--------------------------------------------------------- |
| **Scope of Action**     | Informational text response only | Full task execution on Web, OS, Email, APIs, & Job Portals |
| **Architecture**        | Stateless single-turn API call   | Stateful Multi-Agent Graph (LangGraph)                     |
| **Tool Standard**       | Hardcoded function calling       | Pluggable Model Context Protocol (MCP)                     |
| **Memory System**       | Temporary context window         | Hybrid RAG (Vector Search) + Graph Memory (Neo4j)          |
| **Safety & Control**    | Uncontrolled generation          | Human-in-the-Loop (HITL) interrupt authorization           |
| **Observability**       | Console print statements         | End-to-end multi-agent tracing & evaluation via LangSmith  |
| **Career & MNC Impact** | Beginner / Student project       | **Flagship Senior AI Platform Engineer Project**           |
