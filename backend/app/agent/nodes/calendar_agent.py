"""Calendar Agent — Schedules meetings, sets reminders (local + Google Calendar)."""
from app.agent.state import AgentState
from app.core.config import settings
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
import json, datetime


CALENDAR_PROMPT = """Parse this scheduling request and extract meeting details as JSON.

Request: {step}

Output:
{{
  "title": "Meeting title",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "duration_minutes": 60,
  "attendees": ["email@example.com"],
  "description": "Meeting description",
  "platform": "google_meet or zoom or teams or in_person"
}}

Output ONLY valid JSON.
"""


async def calendar_agent_node(state: AgentState) -> dict:
    plan = state.get("plan", [state["task"]])
    step = plan[state.get("current_step", 0)]

    llm = ChatOllama(model=state.get("model", settings.DEFAULT_MODEL), base_url=settings.OLLAMA_BASE_URL, temperature=0.1)
    response = await llm.ainvoke([
        SystemMessage(content="Output only valid JSON."),
        HumanMessage(content=CALENDAR_PROMPT.format(step=step))
    ])

    try:
        raw = response.content.strip()
        if "{" in raw:
            raw = raw[raw.index("{"):raw.rindex("}")+1]
        meeting = json.loads(raw)
    except Exception:
        meeting = {"error": "Could not parse meeting details", "raw": step}

    result = {
        "tool": "calendar_agent",
        "meeting": meeting,
        "status": "⚠️ HITL_REQUIRED: Please confirm this meeting before scheduling.",
        "note": "Google Calendar integration requires OAuth setup in .env"
    }

    return {
        "tool_results": state.get("tool_results", []) + [result],
        "hitl_required": True,
        "hitl_action": f"Schedule meeting: {json.dumps(meeting, default=str)}",
    }

