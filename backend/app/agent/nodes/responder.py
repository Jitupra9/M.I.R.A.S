"""Responder Node — Synthesizes all tool results into a final natural language answer."""
from app.agent.state import AgentState
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.core.config import settings


RESPONDER_PROMPT = """You are M.I.R.A.S, an autonomous personal AI assistant. 
Synthesize the tool results below into a clear, helpful, conversational response for the user.

USER'S TASK: {task}

TOOL RESULTS:
{tool_results}

LONG-TERM MEMORIES ABOUT USER:
{memories}

Respond directly to the user in a natural, helpful tone. 
If tools produced outputs (file paths, search results, code), summarize them clearly.
"""


async def responder_node(state: AgentState) -> dict:
    tool_results = state.get("tool_results", [])
    task = state.get("task", "")
    memories = "\n".join(state.get("long_term_memories", [])) or "None"

    tool_summary = "\n\n".join([
        f"[{r.get('tool', 'tool')}] {r.get('action', '')} → {str(r.get('output', r.get('explanation', r.get('status', ''))))[:500]}"
        for r in tool_results
    ])

    llm = ChatOllama(model=state.get("model", settings.DEFAULT_MODEL), base_url=settings.OLLAMA_BASE_URL, temperature=0.1)

    # Include conversation history
    messages = list(state.get("messages", []))
    messages.append(HumanMessage(content=RESPONDER_PROMPT.format(
        task=task,
        tool_results=tool_summary or "No tools were called — answering from knowledge.",
        memories=memories,
    )))

    response = await llm.ainvoke(messages)
    final_answer = response.content

    return {
        "final_answer": final_answer,
        "messages": [AIMessage(content=final_answer)],
    }

