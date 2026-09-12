"""Supervisor Node — Routes to the right specialist agent."""

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from app.agent.state import AgentState
from app.core.config import settings

AGENTS = [
    "web_agent",
    "file_agent",
    "os_agent",
    "code_agent",
    "calendar_agent",
    "job_agent",
    "responder",
]

ROUTING_PROMPT = """You are a supervisor routing tasks to specialist agents.

Available agents:
- os_agent: open websites in browser (YouTube, Google, Twitter, etc.), open desktop apps (calculator, notepad, terminal), run shell commands, system info
- web_agent: search the web for information, research questions, scrape website text
- file_agent: create/read/write files (PDF, Excel, CSV, DOCX, TXT, code files), folder operations
- code_agent: write code, debug programs, manage software projects
- calendar_agent: schedule meetings, set reminders, check calendar
- job_agent: job search, apply to jobs, LinkedIn applications
- responder: simple greetings, chitchat, explain from knowledge

Rules:
- If the user asks to OPEN or LAUNCH any website or application (like YouTube, Chrome, calculator) -> ALWAYS choose os_agent.
- If the user asks to SEARCH or FIND information on the web -> choose web_agent.

Given the CURRENT STEP below, output ONLY the agent name (one word).

Current step: {step}
"""


async def supervisor_node(state: AgentState) -> dict:
    plan = state.get("plan", [state["task"]])
    current_step = state.get("current_step", 0)
    step = plan[current_step] if current_step < len(plan) else state["task"]

    llm = ChatOllama(
        model=state.get("model", settings.DEFAULT_MODEL),
        base_url=settings.OLLAMA_BASE_URL,
        temperature=0.1,
    )
    response = await llm.ainvoke(
        [
            SystemMessage(content=ROUTING_PROMPT.format(step=step)),
            HumanMessage(content="Which agent should handle this step?"),
        ]
    )

    chosen = response.content.strip().lower().replace("-", "_")
    chosen = chosen if chosen in AGENTS else "responder"
    return {"current_step": current_step, "_next_agent": chosen}


def route_by_supervisor(state: AgentState) -> str:
    return state.get("_next_agent", "responder")
