"""Memory Loader Node — Retrieves long-term memories and user profile at start of each turn."""
from app.agent.state import AgentState
from app.memory.long_term import recall_memories
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.auth.models import User


async def memory_loader_node(state: AgentState) -> dict:
    user_id = state["user_id"]
    task = state.get("task", "")

    # Load long-term memories relevant to the current task
    memories = await recall_memories(user_id, task)

    # Load user profile
    user_profile = {}
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user:
            user_profile = {
                "name": user.full_name or user.username,
                "profession": user.profession,
                "skills": user.skills,
                "location": user.location,
            }

    return {"long_term_memories": memories, "user_profile": user_profile}

