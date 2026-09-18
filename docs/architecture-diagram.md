# 🏗 M.I.R.A.S System Architecture Diagram & Specification

> [!IMPORTANT]
> **Production Architecture**: **Stateful Multi-Agent Graph (LangGraph) + Extensible Model Context Protocol (MCP) + Next.js 14 Multimodal Dashboard**  
> An enterprise-grade, general-purpose autonomous personal AI assistant capable of executing _any task_ for the user—from real-time voice/text conversation and daily task management, to web automation (job applications, research, booking), local OS/file operations, personal knowledge memory (RAG), and proactive workflow execution.

---

## 1. High-Level Multi-Agent System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["🖥️ Frontend Client Layer"]
        User([👤 User / Voice & Text UI]) <-->|WebSockets / WebRTC Audio| NextJS[Next.js 14 Dashboard\nReact, TypeScript, Tailwind, Shadcn UI]
    end

    subgraph GatewayLayer["⚡ API Gateway & Streaming"]
        NextJS <-->|Async Event Stream & JSON-RPC| FastAPI[FastAPI Async Gateway\nPython 3.11+, WebSocket Manager]
    end

    subgraph MultiAgentCore["🧠 LangGraph Multi-Agent Core"]
        FastAPI --> Supervisor[👑 Master Supervisor Agent\nIntent Classification & Task Planner]

        Supervisor -->|Voice & General Conversational Q&A| VoiceAgent[🎙️ Conversational Agent\nLow Latency TTS/STT Orchestrator]
        Supervisor -->|Memory & Document Lookup| MemoryAgent[📚 Personal Knowledge Agent\nHybrid RAG & Graph Search]
        Supervisor -->|Web Browsing & Extraction| WebAgent[🌐 Web & Task Automation Agent\nDOM Analysis & Navigation]
        Supervisor -->|Job Search & Applications| CareerAgent[💼 Career & Application Agent\nProfile Matcher & Form Filler]
        Supervisor -->|Code, Files & System Commands| DevAgent[💻 Developer & OS Agent\nCode Execution & Terminal CLI]

        MemoryAgent <-->|Hybrid Vector + Graph Query| RAG[(Dual Memory Engine\nQdrant / PGVector + Neo4j Graph)]
    end

    subgraph MCPLayer["🔌 Model Context Protocol (MCP) Tool Layer"]
        WebAgent <-->|MCP Protocol / JSON-RPC| BrowserMCP[Browser Automation MCP Server\nPlaywright / Browserbase Engine]
        CareerAgent <-->|MCP Protocol / JSON-RPC| CareerMCP[Career Automation MCP Server\nResume Parser & Application Automation]
        DevAgent <-->|MCP Protocol / JSON-RPC| SystemMCP[OS & Filesystem MCP Server\nSandboxed CLI & File Handlers]
        Supervisor <-->|MCP Protocol / JSON-RPC| ServiceMCP[Google Workspace MCP Server\nGmail, Calendar & Tasks Integration]
    end

    subgraph SafetyGate["🛡️ Human-in-the-Loop Safety Checkpoint"]
        LangGraph -.->|Interrupt Before Sensitive Action| HITL[Next.js Approval Modal\nOne-Click User Authorization]
        HITL -.->|User Approves / Rejects| LangGraph
    end

    subgraph ObservabilityLayer["📊 Telemetry & Tracing"]
        LangGraph -.->|Graph Execution Telemetry| LangSmith[LangSmith Observability\nTraces, Latency & Token Analytics]
    end

    subgraph PersistenceLayer["💾 State Checkpointer"]
        LangGraph <-->|State Snapshot & Checkpoints| DB[(PostgreSQL / Redis\nSession Recovery & History)]
    end

    style ClientLayer fill:#f0f7ff,stroke:#0066cc,stroke-width:2px
    style GatewayLayer fill:#f6ffed,stroke:#52c41a,stroke-width:2px
    style MultiAgentCore fill:#fff7e6,stroke:#fa8c16,stroke-width:2px
    style MCPLayer fill:#f9f0ff,stroke:#722ed1,stroke-width:2px
    style SafetyGate fill:#fff1f0,stroke:#f5222d,stroke-width:2px
    style ObservabilityLayer fill:#e6fffb,stroke:#13c2c2,stroke-width:2px
    style PersistenceLayer fill:#f0f5ff,stroke:#2f54eb,stroke-width:2px
```

---

## 2. Component Architecture Breakdown

### 2.1 Frontend Client Layer (Next.js 14)

- **Framework**: Next.js 14 App Router with TypeScript.
- **UI Components**: Tailwind CSS, Shadcn UI primitives, Radix UI.
- **Real-Time Communication**: Native WebSocket client for real-time streaming of tokens, agent thoughts, tool execution cards, and live audio chunks.
- **Human-in-the-Loop UI**: Interactive action approval modals rendered dynamically when LangGraph triggers an `interrupt_before` condition (e.g., confirming an email send or job application submission).

### 2.2 API Gateway & Streaming Layer (FastAPI)

- **High Throughput Asynchronous Server**: Python 3.11+ using `asyncio` and `uvicorn`.
- **WebSocket Manager**: Handles bidirectional client sessions, streaming token deltas, audio binary chunks, and agent progress indicators.
- **Pydantic Validation**: Strict runtime schema validation on all inputs, responses, and tool arguments.

### 2.3 Stateful Multi-Agent Core (LangGraph)

- **Master Supervisor Pattern**: A central routing agent analyzes user intent, breaks down compound requests into directed acyclic or cyclic sub-tasks, and orchestrates specialized domain agents.
- **State Preservation**: The global agent state (`MirasState`) tracks conversational context, active goals, intermediate tool results, and approval tokens.
- **Cyclic Execution**: Enables agents to plan, execute tool actions, observe results, reflect on errors, and retry until convergence.

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> UserInputReceived: Text or Voice Event
    UserInputReceived --> SupervisorRouter: Parse Intent & Goals

    state SupervisorRouter {
        [*] --> ClassifyIntent
        ClassifyIntent --> DispatchAgent: Select Best Specialized Sub-Agent
    }

    SupervisorRouter --> ConversationalAgent: General Chit-Chat / Fast Answer
    SupervisorRouter --> MemoryAgent: Knowledge Search
    SupervisorRouter --> WebAgent: Web Automation
    SupervisorRouter --> CareerAgent: Career & Applications
    SupervisorRouter --> DevAgent: Code & System

    state WebAgent {
        [*] --> PlanNavigation
        PlanNavigation --> InvokeBrowserMCP: Execute DOM Action
        InvokeBrowserMCP --> InspectOutput: DOM Snapshot
    }

    WebAgent --> SensitivityCheck: Action has external side effects?

    state SensitivityCheck <<choice>>
    SensitivityCheck --> RequestHITLApproval: Yes (Email, Payment, Apply)
    SensitivityCheck --> ExecuteDirectly: No (Read, Search, Summarize)

    RequestHITLApproval --> AwaitingUserDecision: LangGraph interrupt_before
    AwaitingUserDecision --> ExecutionApproved: User approves
    AwaitingUserDecision --> ExecutionAborted: User rejects

    ExecutionApproved --> ToolExecution
    ExecuteDirectly --> ToolExecution

    ToolExecution --> AgentReflection: Process Tool Result
    AgentReflection --> SupervisorRouter: Sub-task Complete
    AgentReflection --> ToolExecution: Need Additional Actions (Loop)

    SupervisorRouter --> FormatFinalResponse: All Sub-goals Satisfied
    ExecutionAborted --> FormatFinalResponse: Abort Notice
    FormatFinalResponse --> StreamToClient: WebSocket Tokens / Audio
    StreamToClient --> Idle: Ready for Next Turn
```

---

## 3. Memory Subsystem Architecture (Hybrid RAG + Knowledge Graph)

```mermaid
flowchart LR
    subgraph Ingestion["📥 Data Ingestion"]
        Docs[Documents / Resume / Transcripts]
        Interactions[User Preferences & Chat History]
    end

    subgraph DenseMemory["⚡ Dense Vector Storage"]
        Embedder[Embedding Model\nText-Embedding-3-Large / Gemini Embeddings]
        VectorDB[(Qdrant / PGVector\nSub-20ms Semantic Search)]
    end

    subgraph RelationalMemory["🕸️ Knowledge Graph"]
        EntityExtractor[Entity & Relation Extractor\nLLM / GLiNER]
        Neo4j[(Neo4j Graph Database\nMulti-Hop Relational Context)]
    end

    subgraph RetrievalEngine["🔍 Hybrid Retrieval Engine"]
        QueryParser[Contextual Query Parser]
        RRF[Reciprocal Rank Fusion / Re-ranker]
        ContextSynthesizer[Context Window Compression]
    end

    Docs --> Embedder --> VectorDB
    Interactions --> EntityExtractor --> Neo4j

    QueryParser --> VectorDB
    QueryParser --> Neo4j

    VectorDB --> RRF
    Neo4j --> RRF
    RRF --> ContextSynthesizer
    ContextSynthesizer --> LangGraphAgent[LangGraph Agent Context]
```

---

## 4. MCP (Model Context Protocol) Sandboxing Architecture

To guarantee security, isolation, and unconstrained extensibility, every external capability runs inside a dedicated Model Context Protocol (MCP) server:

1. **Decoupled Architecture**: Agents communicate with tools via the standardized MCP JSON-RPC protocol over `stdio` or SSE (Server-Sent Events).
2. **Process Sandboxing**: MCP servers execute in isolated sub-processes, preventing untrusted scripts or browser crashes from impacting the core backend API.
3. **Pluggable Registration**: Registering a new tool (e.g., Spotify control, Notion API, Home Assistant) simply requires providing the MCP server endpoint without modifying agent graph nodes.
