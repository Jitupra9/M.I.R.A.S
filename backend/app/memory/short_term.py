"""
Short-Term Memory — LangGraph Checkpointer
Maintains in-session conversation state across agent node executions.
"""

from langgraph.checkpoint.memory import MemorySaver

_checkpointer = MemorySaver()


async def get_checkpointer() -> MemorySaver:
    """Returns the singleton memory checkpointer for LangGraph."""
    return _checkpointer
