"""
LangGraph State Definition — Shared state that flows between all agent nodes.
"""

from typing import TypedDict, List, Annotated, Optional
from langchain_core.messages import BaseMessage
import operator


class AgentState(TypedDict):
    # Core conversation
    messages: Annotated[List[BaseMessage], operator.add]
    user_id: str
    session_id: str
    model: str  # Active LLM model for this turn

    # Memory context
    long_term_memories: List[str]  # Retrieved from PGVector
    user_profile: dict  # Loaded once per session

    # Task execution
    task: str  # Current user request
    plan: List[str]  # Step-by-step plan from planner
    current_step: int  # Which step we're executing
    tool_calls: List[dict]  # Log of tool calls made
    tool_results: List[dict]  # Results from tool calls

    # HITL (Human-in-the-Loop)
    hitl_required: bool  # True if next action needs approval
    hitl_action: Optional[str]  # Description of the sensitive action
    hitl_approved: Optional[bool]  # None=pending, True=approved, False=rejected

    # Output
    final_answer: Optional[str]
    error: Optional[str]
