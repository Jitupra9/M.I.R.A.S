"""Memory Route — Store and recall long-term memories."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.memory.long_term import store_memory, recall_memories

router = APIRouter()


class StoreMemoryRequest(BaseModel):
    content: str
    memory_type: str = "fact"
    source: str = "manual"


class RecallMemoryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5


@router.post("/store")
async def store(body: StoreMemoryRequest, user_id: str = Depends(get_current_user)):
    """Manually store a memory for the current user."""
    await store_memory(user_id, body.content, body.memory_type, body.source)
    return {"status": "stored", "content": body.content}


@router.post("/recall")
async def recall(body: RecallMemoryRequest, user_id: str = Depends(get_current_user)):
    """Recall the most relevant memories for a given query."""
    memories = await recall_memories(user_id, body.query, body.top_k)
    return {"memories": memories, "count": len(memories)}

