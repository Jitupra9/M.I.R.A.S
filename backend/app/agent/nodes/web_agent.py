"""Web Agent Node — Handles search and web browsing tasks."""

from app.agent.state import AgentState
from app.tools.search import web_search
from app.tools.browser import get_page_text


async def web_agent_node(state: AgentState) -> dict:
    plan = state.get("plan", [state["task"]])
    step = plan[state.get("current_step", 0)]

    step_lower = step.lower()
    from app.tools.os_tools import open_url

    # Check if this is an explicit request to OPEN a website in the user's browser
    if any(
        k in step_lower
        for k in ["open youtube", "launch youtube", "open browser to youtube"]
    ):
        result = open_url("https://www.youtube.com")
        tool_result = {"tool": "os_agent", "action": "open_url", "output": result}
    elif any(k in step_lower for k in ["open google", "launch google"]):
        result = open_url("https://www.google.com")
        tool_result = {"tool": "os_agent", "action": "open_url", "output": result}
    elif step_lower.startswith("http") or "navigate to" in step_lower:
        url = step.split()[-1]
        result = await get_page_text(url)
        tool_result = {"tool": "browser", "input": url, "output": result[:3000]}
    else:
        results = await web_search(step, max_results=5)
        summary = "\n\n".join(
            [
                f"**{r.get('title', 'Result')}**\n{r.get('content', r.get('snippet', ''))[:400]}\nURL: {r.get('url', r.get('href', ''))}"
                for r in results
            ]
        )
        tool_result = {"tool": "web_search", "input": step, "output": summary}

    return {
        "tool_results": state.get("tool_results", []) + [tool_result],
        "hitl_required": False,
    }
