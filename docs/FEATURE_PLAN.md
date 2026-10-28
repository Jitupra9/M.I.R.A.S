# 🚀 M.I.R.A.S — Comprehensive Feature Plan & Roadmap

**M.I.R.A.S (Multimodal Intelligent Reasoning & Autonomous System)** is a next-generation, Jarvis-grade personal autonomous AI assistant. It combines real-time voice interaction, autonomous multi-agent task execution, Model Context Protocol (MCP) tool integration, and Human-in-the-Loop (HITL) safety checkpoints.

---

## 🏛️ System Architecture Overview

```
                         ┌──────────────────────────────────────┐
                         │   Mobile / Web Client (React Native) │
                         │   • Voice Orb (Radar Waves + Audio)  │
                         │   • Multi-Tab UI (Vision, Tasks, etc)│
                         └──────────────────┬───────────────────┘
                                            │ HTTP / WebSocket
                                            ▼
                         ┌──────────────────────────────────────┐
                         │       FastAPI Gateway & Router       │
                         └──────────────────┬───────────────────┘
                                            │
                                            ▼
                         ┌──────────────────────────────────────┐
                         │   LangGraph Multi-Agent Supervisor   │
                         └──────┬───────────┼────────────┬──────┘
                                │           │            │
             ┌──────────────────┘           │            └──────────────────┐
             ▼                              ▼                               ▼
    ┌─────────────────┐           ┌─────────────────┐             ┌─────────────────┐
    │  Email Triage   │           │  Travel Agent   │             │   Resume Sync   │
    │  Domain Agent   │           │ (Playwright MCP)│             │ (Drive/ATS MCP) │
    └────────┬────────┘           └────────┬────────┘             └────────┬────────┘
             │                             │                               │
             ▼                             ▼                               ▼
    ┌─────────────────┐           ┌─────────────────┐             ┌─────────────────┐
    │Google Workspace │           │ Autonomous Web  │             │ Cloud Storage & │
    │   MCP Server    │           │ Booking Engine  │             │ Document Parser │
    └─────────────────┘           └────────┬────────┘             └─────────────────┘
                                           │
                                           ▼
                                 ┌───────────────────┐
                                 │   HITL Gate:      │
                                 │ Human Authorization│
                                 └───────────────────┘
```

---

## ⚡ Current Features (Phase 1 — Implemented)

### 1. 🎙️ Futuristic AI Voice Assistant Core
- **Pulsing Center Orb**: Neon-green glowing central beacon (`#00FFA3`) with ambient breathing aura (2.5s cycle).
- **Outward Signal Waves**: Staggered, transparent concentric wave rings that continuously expand and fade outward like an energy beacon / sonar transmission.
- **Audio Waveform Capsule**: 7 independent vertical audio bars beneath the orb that dynamically bounce in sync with voice listening and speaking states.
- **Typewriter Suggestion Banner**: Animated character-by-character typewriter text cycling through capabilities with a blinking cursor:
  - *"I can help you manage your tasks"*
  - *"I can triage your unread emails"*
  - *"I can organize your schedule"*
  - *"I can answer your questions"*
- **Speech Synthesis (TTS)**: Spoken voice output via `expo-speech` with configurable speech rate and pitch.
- **Hands-Free Text Input**: Clean "Use Keyboard" sheet modal allowing text commands when in quiet environments.

### 2. 📬 Autonomous Email Triage & "What's Inside" Explanation
- Automatically categorizes high-priority incoming messages with labels (`URGENT`, `HIGH`).
- Extracts action items and deadlines from complex email chains.
- **"What's Inside Explain" Engine**: Expands deep breakdowns of key bullet points and required follow-ups with one-tap voice read-aloud.

### 3. ✈️ Autonomous Flight Check-In & Human-in-the-Loop (HITL) Gate
- Simulates automated flight search, seat selection, and price lock via headless browser actions.
- **Strict Safety Gate**: Sensitive financial and personal actions require explicit user approval via **"Authorize Action"** modal before finalizing payment.

### 4. 📄 Resume Evolution & Cloud Synchronization
- Automatically identifies in-demand skills (LangGraph, MCP, React Native) and produces ATS-optimized resume updates.
- Real-time cloud sync status indicator to Google Drive with shareable link generation.

### 5. 👁️ Multimodal Camera Vision Screen
- Live photo snapshot preview and visual intelligence analysis.
- Extracts detected objects, text OCR, barcode data, and scene tags with one-tap AI voice interpretation.

### 6. 📅 Today's Agenda & Tasks Dashboard
- Unified view of morning priorities, scheduled meetings, and autonomous background agent activities.
- Step-by-step LangGraph execution timeline (Supervisor Agent $\rightarrow$ Domain Agents $\rightarrow$ Tool Calls).

---

## 🔮 Roadmap & Upcoming Features (Phase 2 & 3)

### Phase 2: Real-Time Multimodal Streaming
| Feature | Description | Target |
| :--- | :--- | :--- |
| **Gemini Live API Integration** | Ultra-low latency, bidirectional streaming voice using WebSockets / WebRTC. | Q1 2027 |
| **Active Noise Cancellation (VAD)** | Client-side Voice Activity Detection so the assistant pauses instantly when you interrupt it. | Q1 2027 |
| **Dual Memory Layer** | Persistent long-term memory combining Chroma vector store with Knowledge Graph entity linking. | Q2 2027 |
| **Real Google Workspace MCP** | Direct OAuth connection to read live Gmail inboxes, Google Calendar events, and Drive files. | Q2 2027 |
| **Playwright Live Browser Stream** | Watch the assistant book tickets live on your phone screen via interactive browser viewport. | Q2 2027 |

### Phase 3: Ambient Intelligence & Cross-Device Sync
| Feature | Description | Target |
| :--- | :--- | :--- |
| **Proactive Morning Briefings** | Assistant speaks a personalized morning audio summary before your first meeting. | Q3 2027 |
| **Wearable / Smartwatch Companion** | Quick voice orb widget and urgent approval alerts for Wear OS & Apple Watch. | Q3 2027 |
| **Offline On-Device Voice Fallback** | Local on-device inference using quantized Whisper + Gemma for basic tasks without internet. | Q4 2027 |
| **Enterprise MCP Connectors** | Connectors for Slack, Notion, Jira, GitHub, and custom SQL databases. | Q4 2027 |

---

## 🛡️ Safety & Guardrails Policy
1. **Never Take Irreversible Actions Silently**: Financial transactions, sending emails to external parties, and document deletions always pause at an interactive HITL checkpoint.
2. **Deterministic State Recovery**: If an agent or network tool fails mid-task, LangGraph checkpointing preserves conversation state and suggests automatic recovery steps.
3. **Local Credential Storage**: Sensitive API keys and OAuth tokens are stored in the user's secure hardware enclave (`expo-secure-store`).
