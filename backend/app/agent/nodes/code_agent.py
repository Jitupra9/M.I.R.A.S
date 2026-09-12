"""Code Agent Node — Writes, debugs, and runs code."""
from app.agent.state import AgentState
from app.tools.os_tools import run_command
from app.tools.filesystem import write_file, read_file
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings
import json, os, tempfile

CODE_AGENT_PROMPT = """You are an expert software engineer. The user wants you to:

{step}

User profile:
- Skills: {skills}
- Profession: {profession}

TASK: Write the required code. Then output a JSON with:
{{
  "filename": "example.py",
  "language": "python",
  "code": "...the complete code here...",
  "run_immediately": true,
  "explanation": "What this code does"
}}

If just explaining or debugging (no file needed), set "filename": null and "run_immediately": false.
Output ONLY valid JSON.
"""


async def code_agent_node(state: AgentState) -> dict:
    plan = state.get("plan", [state["task"]])
    step = plan[state.get("current_step", 0)]
    profile = state.get("user_profile", {})

    llm = ChatOllama(model=state.get("model", settings.DEFAULT_MODEL), base_url=settings.OLLAMA_BASE_URL, temperature=0.1)
    response = await llm.ainvoke([
        SystemMessage(content="You are an expert software engineer. Output only valid JSON."),
        HumanMessage(content=CODE_AGENT_PROMPT.format(
            step=step,
            skills=profile.get("skills", "General"),
            profession=profile.get("profession", "Developer"),
        ))
    ])

    try:
        raw = response.content.strip()
        if "{" in raw:
            raw = raw[raw.index("{"):raw.rindex("}")+1]
        parsed = json.loads(raw)
    except Exception:
        return {"tool_results": [{"tool": "code_agent", "output": response.content}], "hitl_required": False}

    filename = parsed.get("filename")
    code = parsed.get("code", "")
    run_immediately = parsed.get("run_immediately", False)
    explanation = parsed.get("explanation", "")

    results = [{"tool": "code_agent", "explanation": explanation}]

    # Write the file
    if filename and code:
        write_result = write_file(filename, code)
        results.append({"action": "write_file", "output": write_result})

    # Run the code if requested
    if run_immediately and filename:
        lang = parsed.get("language", "").lower()
        if lang == "python":
            cmd = f"python {filename}"
        elif lang in ("js", "javascript", "typescript"):
            cmd = f"node {filename}"
        elif lang == "bash":
            cmd = f"bash {filename}"
        else:
            cmd = None

        if cmd:
            run_result = await run_command(cmd)
            results.append({"action": "run_code", "command": cmd, "output": str(run_result)})

    return {
        "tool_results": state.get("tool_results", []) + results,
        "hitl_required": False,
    }

