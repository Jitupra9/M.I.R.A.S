"""Planner Node — Breaks the user's task into a step-by-step plan."""

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from app.agent.state import AgentState
from app.core.config import settings
import json


def _build_planning_prompt(state: AgentState) -> str:
    memories = "\n".join(state.get("long_term_memories", [])) or "None"
    profile = state.get("user_profile", {})
    return f"""You are M.I.R.A.S, an autonomous personal AI agent.

USER PROFILE:
Name: {profile.get('name', 'Unknown')}
Profession: {profile.get('profession', 'Unknown')}
Skills: {profile.get('skills', 'Unknown')}
Location: {profile.get('location', 'Unknown')}

RELEVANT MEMORIES:
{memories}

USER'S TASK: {state['task']}

Create a concise step-by-step execution plan. Output ONLY a JSON array of steps.
Each step should be a short action string that one of these agents can execute:
- web_agent: web search, browsing, crawling
- file_agent: create/read/write/delete files, generate PDF/Excel/CSV/DOCX
- os_agent: run terminal commands, open applications
- code_agent: write code, debug, manage projects
- calendar_agent: schedule meetings, set reminders
- job_agent: search jobs, apply to positions
- responder: answer directly from knowledge/memory

Example output: ["Search for Python developer jobs in Bangalore", "Prepare my resume PDF", "Apply to top 3 results"]
"""


async def planner_node(state: AgentState) -> dict:
    llm = ChatOllama(
        model=state.get("model", settings.DEFAULT_MODEL),
        base_url=settings.OLLAMA_BASE_URL,
        temperature=0.1,
    )

    prompt = _build_planning_prompt(state)
    try:
        response = await llm.ainvoke(
            [
                SystemMessage(
                    content="You are a precise planner. Output only valid JSON arrays."
                ),
                HumanMessage(content=prompt),
            ]
        )
        raw = response.content.strip()
        if "[" in raw:
            raw = raw[raw.index("[") : raw.rindex("]") + 1]
        plan = json.loads(raw)
    except Exception:
        plan = [state["task"]]  # Fallback: treat task as single step

    return {"plan": plan, "current_step": 0}
