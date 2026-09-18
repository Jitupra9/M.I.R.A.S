# ⚡ Failure Modes, Safety & Resilience Rules

Operating an autonomous personal assistant in production demands strict safeguards against irreversible actions, network anomalies, anti-bot countermeasures, and invalid model hallucinations.

---

## 🛡️ Core Resilience Rules

### Rule 1: Human-in-the-Loop (HITL) Guardrail

- **Trigger**: Any external operation with irreversible side effects (sending external emails, paying money, submitting job applications, deleting files).
- **Mechanism**: The LangGraph state machine executes an `interrupt_before` hook on the designated action node.
- **Resolution**: Execution suspends until the user clicks **Approve**, **Modify**, or **Reject** on the Next.js UI modal.

### Rule 2: CAPTCHA & Anti-Bot Failover

- **Trigger**: The Browser MCP detects Cloudflare Turnstile, reCAPTCHA, or bot-blocking challenges.
- **Mechanism**: Rather than repeatedly retrying and risking IP banning, the browser session transitions into a paused state and captures a viewport snapshot.
- **Resolution**: An immediate intervention alert is pushed to the frontend, allowing the user to solve the challenge in an interactive preview window.

### Rule 3: State Recovery & Persistence

- **Trigger**: Process crash, worker restart, or network timeout mid-execution.
- **Mechanism**: LangGraph's checkpointer (backed by PostgreSQL or Redis) records snapshots of the graph state at every node transition.
- **Resolution**: On worker recovery, the workflow resumes seamlessly from the last completed node checkpoint without repeating prior successful API calls.

### Rule 4: Pydantic Output Validation & Self-Correction

- **Trigger**: LLM produces malformed arguments or fails JSON schema constraints for an MCP tool.
- **Mechanism**: Pydantic validation catches the validation error before invoking the tool.
- **Resolution**: An automatic feedback loop injects the validation error back into the agent context, prompting an immediate self-correction retry step (capped at 3 iterations).
