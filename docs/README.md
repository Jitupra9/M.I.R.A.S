# 📖 M.I.R.A.S Documentation Index

Welcome to the comprehensive technical documentation for **M.I.R.A.S (Multimodal Intelligence & Real-Time Action System)** — a Universal Autonomous Personal AI Assistant ("Jarvis-Style").

---

## 📑 Documentation Structure

| Document                                                                 | Description                                                                                             |
| :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| **[System Architecture Diagram](./architecture-diagram.md)**             | Multi-Agent Graph, Supervisor routing pattern, MCP sandboxing, and data flows.                          |
| **[Task Execution & HITL Workflow Diagram](./workflow-diagram.md)**      | End-to-end task execution sequence diagrams, cyclic reasoning loops, and Human-in-the-Loop checkpoints. |
| **[Model Context Protocol (MCP) Tools](./mcp-tools.md)**                 | Modular capability servers (Browser/Playwright, Local OS, Email/Calendar, Dual Memory).                 |
| **[Failure Resilience & Safety Guardrails](./resilience-and-safety.md)** | Production error recovery, CAPTCHA failover, LangGraph state recovery, and Pydantic validation.         |
| **[Tech Stack Specification](./tech-stack.md)**                          | Full technology breakdown, design rationales, and comparison with basic chatbots.                       |
| **[Senior AI Engineer Interview Playbook](./interview-playbook.md)**     | In-depth interview questions & answers covering LangGraph, MCP, long-term memory, and LangSmith.        |

---

## 🧭 Core Architectural Principles

1. **Stateful Multi-Agent Orchestration**: Deterministic control over LLM loops using LangGraph cyclic state graphs.
2. **Standardized Extensibility via MCP**: Decoupled tool integration via the Model Context Protocol.
3. **Safety by Design**: Human-in-the-Loop (HITL) approval gates before executing irreversible external actions.
4. **Dual-Layer Memory**: Semantic dense vector search paired with relational Knowledge Graph multi-hop retrieval.
5. **Ultra-Low Latency Multimodal Streaming**: Real-time voice and text interaction over WebSockets/WebRTC.
