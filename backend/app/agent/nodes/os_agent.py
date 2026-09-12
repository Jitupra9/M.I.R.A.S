"""OS Agent Node — Terminal commands, app launching, system tasks."""

import json
from app.agent.state import AgentState
from app.tools.os_tools import (
    run_command,
    open_application,
    open_file,
    open_url,
    get_system_info,
)
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings

SENSITIVE_COMMANDS = [
    "rm -rf",
    "del /f",
    "format",
    "shutdown",
    "reboot",
    "mkfs",
    "dd if=",
]

OS_AGENT_PROMPT = """You are an OS control agent. Parse the user's step and output a JSON action.

Step: {step}

Available actions:
- run_command(command, cwd)   [may be SENSITIVE if destructive]
- open_application(app_name)
- open_file(path)
- open_url(url)
- get_system_info()

Output ONLY valid JSON: {"action": "action_name", "args": {}, "is_sensitive": false}
"""


async def os_agent_node(state: AgentState) -> dict:
    plan = state.get("plan", [state["task"]])
    step = plan[state.get("current_step", 0)]

    llm = ChatOllama(
        model=state.get("model", settings.DEFAULT_MODEL),
        base_url=settings.OLLAMA_BASE_URL,
        temperature=0.1,
    )
    response = await llm.ainvoke(
        [
            SystemMessage(content="Output only valid JSON."),
            HumanMessage(content=OS_AGENT_PROMPT.format(step=step)),
        ]
    )

    step_lower = step.lower()
    action = None
    args = {}
    is_sensitive = False

    try:
        raw = response.content.strip()
        if "{" in raw:
            raw = raw[raw.index("{") : raw.rindex("}") + 1]
        parsed = json.loads(raw)
        action = parsed.get("action")
        args = parsed.get("args", {})
        is_sensitive = parsed.get("is_sensitive", False)
    except Exception:
        pass

    # Direct intent detection for common OS actions
    if not action:
        if "youtube" in step_lower:
            action = "open_url"
            args = {"url": "https://www.youtube.com"}
        elif "google" in step_lower and "search" not in step_lower:
            action = "open_url"
            args = {"url": "https://www.google.com"}
        elif "calculator" in step_lower or "calc" in step_lower:
            action = "open_application"
            args = {"app_name": "calc"}
        elif "notepad" in step_lower:
            action = "open_application"
            args = {"app_name": "notepad"}
        elif "open" in step_lower and ("http" in step_lower or ".com" in step_lower):
            url = [w for w in step.split() if "." in w or "http" in w][0]
            action = "open_url"
            args = {"url": url}

    # Auto-detect sensitive commands
    if action == "run_command":
        cmd = args.get("command", "")
        if any(s in cmd.lower() for s in SENSITIVE_COMMANDS):
            is_sensitive = True

    if is_sensitive:
        return {
            "hitl_required": True,
            "hitl_action": f"OS command: {json.dumps(args)}",
            "tool_results": state.get("tool_results", []),
        }

    result = None
    if action == "run_command":
        result = await run_command(args.get("command", ""), cwd=args.get("cwd"))
    elif action == "open_application":
        result = open_application(args.get("app_name", ""))
    elif action == "open_file":
        result = open_file(args.get("path", ""))
    elif action == "open_url":
        result = open_url(args.get("url", ""))
    elif action == "get_system_info":
        result = get_system_info()
    else:
        result = f"Unknown action: {action}"

    return {
        "tool_results": state.get("tool_results", [])
        + [{"tool": "os_agent", "action": action, "output": str(result)}],
        "hitl_required": False,
    }
