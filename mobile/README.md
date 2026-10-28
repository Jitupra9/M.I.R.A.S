# MIRAs — Autonomous Personal Assistant Mobile App

A high-performance, futuristic **React Native (Expo SDK 58)** cross-platform mobile application for **MIRAs** — featuring real-time voice interaction, interactive autonomous task cards, and LangGraph multi-agent orchestration.

---

## ⚡ Key Capabilities Built in UI

### 1. 🎙️ Holographic Jarvis Voice Orb
- **Dynamic Voice States**: `IDLE`, `LISTENING`, `PROCESSING`, and `SPEAKING`.
- **Live Sound Waves**: Simulated real-time audio spectrum analyzer bars.
- **Hands-Free Speech Synthesis**: Speaks assistant responses aloud using `expo-speech` with configurable speech rate and pitch.
- **Haptic Feedback**: Tactile responses via `expo-haptics` on state transitions.

### 2. 📬 Urgent Email Triage & "What's Inside Explain" Engine
- Scans priority inbox threads via Google Workspace MCP.
- Highlights urgent senders, priority tags (`URGENT`, `HIGH`), and response deadlines.
- **"What's Inside Explain"**: Expands an in-depth breakdown of key bullet points, required actions, and one-tap **Read Aloud** voice narration.

### 3. ✈️ Autonomous Flight Ticket Booking & HITL Safety Gate
- Simulates automated web booking sessions via Playwright Browser MCP.
- Displays route (`SFO ✈️ JFK`), flight duration, airline, seat class, and locked fare.
- **Human-in-the-Loop (HITL) Safety Checkpoint**: Sensitive financial actions require explicit user approval via **"Authorize Payment"** before finalizing.

### 4. 📄 Resume Evolution & Google Drive Cloud Sync
- Injects in-demand competencies (LangGraph, MCP, React Native) and compiles ATS-optimized versions.
- Live cloud synchronization to Google Drive with file path indicator and shareable link generation.

### 5. 🛠️ Live LangGraph & MCP Execution Timeline
- Visualizes step-by-step multi-agent actions (Supervisor Agent, Domain Agents, MCP tools).

---

## 📱 Quick Start

### Prerequisites
- Node.js >= 18 (e.g. Node v24)
- Expo CLI

### Running the App

```bash
# Navigate to mobile directory
cd mobile

# Start Expo development server
npm run start

# Run on Android device / emulator
npm run android

# Run on iOS simulator (requires macOS)
npm run ios
```

You can scan the QR code with **Expo Go** on Android or iOS to experience the voice assistant directly on your physical smartphone!

---

## 📂 Project Architecture

```
mobile/
├── App.tsx                     # Master container, state manager & navigation
├── app.json                    # Expo configuration & dark theme styling
├── src/
│   ├── theme/
│   │   └── colors.ts           # Cyber/Jarvis neon palette
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for Voice, Emails, Flights, Resume
│   ├── services/
│   │   ├── voiceService.ts     # expo-speech & expo-haptics integration
│   │   └── agentEngine.ts      # Multi-agent autonomous reasoning engine
│   ├── components/
│   │   ├── VoiceOrb.tsx         # Holographic animated voice visualizer
│   │   ├── EmailListCard.tsx    # Urgent email triage with expandable explanation
│   │   ├── FlightBookingCard.tsx# Flight booking card with HITL authorization
│   │   ├── ResumeSyncCard.tsx   # Resume updater with Google Drive status
│   │   ├── TaskExecutionCard.tsx# LangGraph step-by-step execution timeline
│   │   └── QuickPromptChips.tsx # Instant voice command suggestion pills
│   └── screens/
│       ├── VoiceHomeScreen.tsx  # Voice-first main screen with Jarvis Orb
│       ├── ChatScreen.tsx       # Conversation stream with rich widgets
│       ├── TasksScreen.tsx      # Autonomous tasks dashboard
│       └── SettingsScreen.tsx   # Model selection & voice audio options
```
