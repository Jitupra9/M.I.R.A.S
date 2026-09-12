"""Job Agent — Search for jobs and prepare applications with HITL before submitting."""
from app.agent.state import AgentState
from app.tools.search import web_search
from app.tools.browser import search_and_apply_job
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings
import json


JOB_PROMPT = """You are a job search specialist. Parse this job request.

Request: {step}
User profile: {profile}

Output JSON:
{{
  "job_title": "Software Engineer",
  "location": "Bangalore, India",
  "portals": ["linkedin", "naukri", "internshala"],
  "filters": {{"experience": "fresher", "type": "full-time"}},
  "auto_apply": true
}}

Output ONLY valid JSON.
"""


async def job_agent_node(state: AgentState) -> dict:
    plan = state.get("plan", [state["task"]])
    step = plan[state.get("current_step", 0)]
    profile = state.get("user_profile", {})

    llm = ChatOllama(model=state.get("model", settings.DEFAULT_MODEL), base_url=settings.OLLAMA_BASE_URL, temperature=0.1)
    response = await llm.ainvoke([
        SystemMessage(content="Output only valid JSON."),
        HumanMessage(content=JOB_PROMPT.format(step=step, profile=json.dumps(profile)))
    ])

    try:
        raw = response.content.strip()
        if "{" in raw:
            raw = raw[raw.index("{"):raw.rindex("}")+1]
        job_params = json.loads(raw)
    except Exception:
        job_params = {"job_title": step, "location": profile.get("location", "India")}

    # Search for jobs using web search
    job_title = job_params.get("job_title", "Software Engineer")
    location = job_params.get("location", "India")
    
    search_results = await web_search(f"{job_title} jobs {location} site:linkedin.com OR site:naukri.com")
    
    top_jobs = "\n\n".join([
        f"**{r.get('title', 'Job')}**\n{r.get('content', '')[:300]}\nURL: {r.get('url', '')}"
        for r in search_results[:5]
    ])

    result = {
        "tool": "job_agent",
        "search_params": job_params,
        "found_jobs": top_jobs,
        "status": "⚠️ HITL_REQUIRED: Found jobs listed above. Approve to start applying.",
    }

    return {
        "tool_results": state.get("tool_results", []) + [result],
        "hitl_required": True,
        "hitl_action": f"Apply to jobs: {job_title} in {location}. Jobs found above.",
    }

