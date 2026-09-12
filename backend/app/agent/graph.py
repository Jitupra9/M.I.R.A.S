"""
LangGraph Multi-Agent Graph — The core orchestration engine.
Nodes: memory_loader → planner → supervisor → [specialists] → hitl_check → responder
"""

from langgraph.graph import StateGraph, START, END
from typing import Any
from app.agent.state import AgentState
from app.agent.nodes.memory_loader import memory_loader_node
from app.agent.nodes.planner import planner_node
from app.agent.nodes.supervisor import supervisor_node, route_by_supervisor
from app.agent.nodes.web_agent import web_agent_node
from app.agent.nodes.file_agent import file_agent_node
from app.agent.nodes.os_agent import os_agent_node
from app.agent.nodes.code_agent import code_agent_node
from app.agent.nodes.calendar_agent import calendar_agent_node
from app.agent.nodes.job_agent import job_agent_node
from app.agent.nodes.responder import responder_node
from app.agent.hitl import hitl_check_node, route_hitl
from app.core.config import settings


def build_graph(checkpointer: Any) -> StateGraph:
    """Build and compile the M.I.R.A.S agent graph."""

    builder = StateGraph(AgentState)

    # ── Add all nodes ────────────────────────────────────────────────────────
    builder.add_node("memory_loader", memory_loader_node)
    builder.add_node("planner", planner_node)
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("web_agent", web_agent_node)
    builder.add_node("file_agent", file_agent_node)
    builder.add_node("os_agent", os_agent_node)
    builder.add_node("code_agent", code_agent_node)
    builder.add_node("calendar_agent", calendar_agent_node)
    builder.add_node("job_agent", job_agent_node)
    builder.add_node("hitl_check", hitl_check_node)
    builder.add_node("responder", responder_node)

    # ── Define edges ─────────────────────────────────────────────────────────
    builder.add_edge(START, "memory_loader")
    builder.add_edge("memory_loader", "planner")
    builder.add_edge("planner", "supervisor")

    # Supervisor conditionally routes to specialist agents
    builder.add_conditional_edges(
        "supervisor",
        route_by_supervisor,
        {
            "web_agent": "web_agent",
            "file_agent": "file_agent",
            "os_agent": "os_agent",
            "code_agent": "code_agent",
            "calendar_agent": "calendar_agent",
            "job_agent": "job_agent",
            "responder": "responder",  # Direct answer, no tool needed
        },
    )

    # All specialist agents → HITL check (before any output)
    for agent in [
        "web_agent",
        "file_agent",
        "os_agent",
        "code_agent",
        "calendar_agent",
        "job_agent",
    ]:
        builder.add_edge(agent, "hitl_check")

    # HITL: if approved/not needed → responder, else → END (awaiting approval)
    builder.add_conditional_edges(
        "hitl_check",
        route_hitl,
        {
            "responder": "responder",
            "await_approval": END,  # Pause execution until user approves
        },
    )

    builder.add_edge("responder", END)

    return builder.compile(
        checkpointer=checkpointer,
        interrupt_before=["hitl_check"],  # LangGraph will pause here if HITL needed
    )
