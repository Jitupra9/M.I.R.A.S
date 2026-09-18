# 🔄 M.I.R.A.S Workflow & Task Execution Diagrams

> [!TIP]
> **Universal Action Flow**: The assistant accepts natural language goals, dynamically formulates execution plans using MCP tools, requests approval for impactful actions, and logs full trace history to LangSmith.

---

## 1. End-to-End Task Execution Workflow (With HITL Authorization)

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 User (Next.js Dashboard / Voice)
    participant Supervisor as 👑 LangGraph Supervisor
    participant Agent as 🤖 Specialized Worker Agent
    participant MCP as 🔌 MCP Tool Server (Browser / OS / Email)
    participant External as 🌐 External Target (Web / Email / OS)
    participant LangSmith as 📊 LangSmith Telemetry

    User->>Supervisor: "Organize my emails & apply to recommended jobs"
    Note over Supervisor: Deconstruct into sub-goals:<br/>1. Check unread priority emails<br/>2. Find jobs & populate applications

    Supervisor->>Agent: Delegate Goal 1 (Email processing)
    Agent->>MCP: Query Email MCP Server (Get unread priority messages)
    MCP->>External: Fetch email metadata & body
    External-->>MCP: Raw email data
    MCP-->>Agent: Parsed structured emails JSON

    Supervisor->>Agent: Delegate Goal 2 (Job search & application)
    Agent->>MCP: Trigger Browser MCP Server (Navigate to job postings)
    MCP->>External: Open target portals & pre-fill forms
    External-->>MCP: Form populated snapshot
    MCP-->>Agent: Snapshot + action context

    rect rgb(255, 240, 240)
        Note over Agent,User: 🛡️ LangGraph Interrupt Triggered (Human-in-the-Loop)
        Agent-->>User: Display Approval Modal: "Ready to submit application for Senior Role & send email reply. Approve?"
        User->>Agent: Click "Approve" (or provide edited instructions)
    end

    Agent->>MCP: Execute final action (Submit form / Send email)
    MCP->>External: Execute API / DOM action
    External-->>MCP: Success confirmation
    MCP-->>Agent: Task completed successfully
    Agent->>LangSmith: Log trace, latency & token usage
    Agent-->>User: Real-time voice/text summary ("All tasks completed successfully!")
```

---

## 2. Multi-Agent Reasoning Cycle (ReAct + Reflection)

```mermaid
flowchart TD
    Start([Task Initiated]) --> Observe[1. Observe Current State & Context]
    Observe --> Reason[2. Reason & Formulate Next Step]
    Reason --> Decision{Requires Tool Action?}

    Decision -->|Yes| SchemaValidate[3. Pydantic Tool Arguments Validation]
    SchemaValidate --> ValidArgs{Schema Valid?}

    ValidArgs -->|No| SelfCorrection[Self-Correction Reflection Loop]
    SelfCorrection --> Reason

    ValidArgs -->|Yes| SafetyGate{Sensitive External Action?}
    SafetyGate -->|Yes| HITLInterrupt[Pause Execution & Prompt User Approval]
    HITLInterrupt --> UserChoice{User Decision}
    UserChoice -->|Approved| ExecuteTool[4. Call MCP Server via JSON-RPC]
    UserChoice -->|Rejected| HandleRejection[Incorporate Rejection Feedback]
    HandleRejection --> Reason

    SafetyGate -->|No| ExecuteTool
    ExecuteTool --> ToolResult[5. Receive Tool Observation]
    ToolResult --> CheckSuccess{Execution Successful?}

    CheckSuccess -->|Yes| Reflect[6. Reflect on Progress Toward Goal]
    CheckSuccess -->|No| ErrorHandler[Error Handling / Anti-Bot Failover]
    ErrorHandler --> Reason

    Reflect --> GoalAchieved{Goal Complete?}
    GoalAchieved -->|No| Reason
    GoalAchieved -->|Yes| Finalize[7. Generate Final Multimodal Response]
    Finalize --> End([Task Complete])
```

---

## 3. Anti-Bot & CAPTCHA Failover Workflow

```mermaid
sequenceDiagram
    autonumber
    participant Agent as 🤖 Web Automation Agent
    participant BrowserMCP as 🌐 Browser MCP (Playwright)
    participant TargetSite as 🏢 Target Website
    participant UI as 🖥️ Next.js User Dashboard

    Agent->>BrowserMCP: Navigate to Job / Application Form
    BrowserMCP->>TargetSite: HTTP GET & Render DOM
    TargetSite-->>BrowserMCP: Cloudflare Challenge / Turnstile / CAPTCHA Detected

    Note over BrowserMCP: Anti-Bot Protection Triggered
    BrowserMCP-->>Agent: Raise CAPTCHADetectedException (Snapshot + Coordinates)

    Agent-->>UI: Push Alert: "Automated browser paused at CAPTCHA. Please solve to proceed."
    UI-->>Agent: User solves CAPTCHA in embedded session / clicks "Resumed"

    Agent->>BrowserMCP: Resume DOM execution
    BrowserMCP->>TargetSite: Continue Form Filling & Submission
    TargetSite-->>BrowserMCP: 200 OK / Application Submitted
    BrowserMCP-->>Agent: Success confirmation
```

---

## 4. WebSocket Streaming Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant Client as 🖥️ Next.js Client
    participant Gateway as ⚡ FastAPI Gateway
    participant Checkpoint as 💾 LangGraph Checkpointer
    participant LLM as 🧠 LLM Provider

    Client->>Gateway: ws://backend:8000/ws/chat (Initiate Connection)
    Gateway-->>Client: Connection Established (Session ID assigned)

    Client->>Gateway: Send User Message / Audio Chunk
    Gateway->>Checkpoint: Load Session State (Thread ID)
    Checkpoint-->>Gateway: Restored State Graph

    Gateway->>LLM: Stream Prompt via LangChain
    loop Token Streaming
        LLM-->>Gateway: Delta Token Chunk
        Gateway-->>Client: {"type": "token", "content": "..."}
    end

    alt Tool Call Triggered
        LLM-->>Gateway: Function Call Schema
        Gateway-->>Client: {"type": "tool_start", "tool": "browser_navigate"}
        Gateway-->>Client: {"type": "tool_end", "status": "completed"}
    end

    Gateway->>Checkpoint: Persist Updated State Graph
    Gateway-->>Client: {"type": "done"}
```
