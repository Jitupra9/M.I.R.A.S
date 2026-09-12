"""HITL Route — Frontend calls these to approve/reject sensitive agent actions."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import get_current_user
from app.memory.short_term import get_checkpointer
from app.agent.graph import build_graph

router = APIRouter()


class HITLDecision(BaseModel):
    session_id: str
    approved: bool
    reason: str = ""


@router.post("/decide")
async def hitl_decide(
    body: HITLDecision,
    user_id: str = Depends(get_current_user)
):
    """
    Frontend sends this after the user sees the HITL approval modal.
    This resumes the paused LangGraph execution.
    """
    checkpointer = await get_checkpointer()
    graph = build_graph(checkpointer)
    config = {"configurable": {"thread_id": f"{user_id}:{body.session_id}"}}

    # Update state with the approval decision
    update = {"hitl_approved": body.approved}
    
    try:
        # Resume graph from where it was interrupted
        result = await graph.aupdate_state(config, update)
        
        if body.approved:
            # Continue execution
            final_state = await graph.ainvoke(None, config=config)
            return {
                "status": "resumed",
                "approved": True,
                "answer": final_state.get("final_answer", "Action completed."),
            }
        else:
            return {
                "status": "rejected",
                "approved": False,
                "message": f"Action cancelled. Reason: {body.reason}",
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{session_id}")
async def hitl_status(session_id: str, user_id: str = Depends(get_current_user)):
    """Check if a session is currently awaiting HITL approval."""
    checkpointer = await get_checkpointer()
    config = {"configurable": {"thread_id": f"{user_id}:{session_id}"}}
    try:
        state = await checkpointer.aget(config)
        if state and state.get("hitl_required") and state.get("hitl_approved") is None:
            return {"awaiting_approval": True, "action": state.get("hitl_action")}
        return {"awaiting_approval": False}
    except Exception:
        return {"awaiting_approval": False}

