"""File Agent Node — Handles all file and folder operations."""
import re
import json
from app.agent.state import AgentState
from app.tools.filesystem import (
    list_directory, read_file, write_file, delete_file_or_folder,
    create_folder, copy_item, move_item, search_files,
    create_pdf, create_excel, create_csv, create_docx, create_json_file
)
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings


FILE_AGENT_PROMPT = """You are a file management agent. Parse the user's request and output a JSON action.

Request: {step}

Available actions:
- list_directory(path)
- read_file(path)
- write_file(path, content)
- delete_file_or_folder(path)  [SENSITIVE — requires HITL]
- create_folder(path)
- copy_item(src, dest)
- move_item(src, dest)
- search_files(root, pattern)
- create_pdf(path, title, content)
- create_excel(path, sheet_name, data_json_string)
- create_csv(path, data_json_string)
- create_docx(path, title, paragraphs_json_string)
- create_json_file(path, data_json_string)

Output ONLY valid JSON:
{{"action": "action_name", "args": {{}}, "is_sensitive": false}}
"""

SENSITIVE_ACTIONS = {"delete_file_or_folder"}


async def file_agent_node(state: AgentState) -> dict:
    plan = state.get("plan", [state["task"]])
    step = plan[state.get("current_step", 0)]

    llm = ChatOllama(model=state.get("model", settings.DEFAULT_MODEL), base_url=settings.OLLAMA_BASE_URL, temperature=0.1)
    response = await llm.ainvoke([
        SystemMessage(content="Output only valid JSON."),
        HumanMessage(content=FILE_AGENT_PROMPT.format(step=step))
    ])

    try:
        raw = response.content.strip()
        if "{" in raw:
            raw = raw[raw.index("{"):raw.rindex("}")+1]
        parsed = json.loads(raw)
        action = parsed.get("action")
        args = parsed.get("args", {})
        is_sensitive = parsed.get("is_sensitive", False) or action in SENSITIVE_ACTIONS
    except Exception:
        return {"tool_results": [{"tool": "file_agent", "error": "Failed to parse action"}], "hitl_required": False}

    if is_sensitive:
        return {
            "hitl_required": True,
            "hitl_action": f"File deletion: {json.dumps(args)}",
            "tool_results": state.get("tool_results", []),
        }

    # Execute the action
    action_map = {
        "list_directory": lambda: list_directory(args.get("path", ".")),
        "read_file": lambda: read_file(args.get("path")),
        "write_file": lambda: write_file(args.get("path"), args.get("content", "")),
        "create_folder": lambda: create_folder(args.get("path")),
        "copy_item": lambda: copy_item(args.get("src"), args.get("dest")),
        "move_item": lambda: move_item(args.get("src"), args.get("dest")),
        "search_files": lambda: str(search_files(args.get("root", "."), args.get("pattern", "*"))),
        "create_pdf": lambda: create_pdf(args.get("path"), args.get("title", "Document"), args.get("content", "")),
        "create_excel": lambda: create_excel(args.get("path"), args.get("sheet_name", "Sheet1"), json.loads(args.get("data_json_string", "[]"))),
        "create_csv": lambda: create_csv(args.get("path"), json.loads(args.get("data_json_string", "[]"))),
        "create_docx": lambda: create_docx(args.get("path"), args.get("title", "Document"), json.loads(args.get("paragraphs_json_string", "[]"))),
        "create_json_file": lambda: create_json_file(args.get("path"), json.loads(args.get("data_json_string", "{}"))),
    }

    executor = action_map.get(action)
    result = executor() if executor else f"Unknown action: {action}"

    return {
        "tool_results": state.get("tool_results", []) + [{"tool": "file_agent", "action": action, "output": str(result)}],
        "hitl_required": False,
    }

