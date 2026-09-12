"""HITL (Human-in-the-Loop) — LangGraph interrupt handling."""
from app.agent.state import AgentState


def hitl_check_node(state: AgentState) -> dict:
    """This node is executed just before the LangGraph interrupt point."""
    return state  # Pass-through; graph pauses here if hitl_required=True


def route_hitl(state: AgentState) -> str:
    """Route after HITL check."""
    if state.get("hitl_required") and state.get("hitl_approved") is None:
        return "await_approval"    # Pause and wait for frontend approval
    return "responder"             # Proceed to answer

