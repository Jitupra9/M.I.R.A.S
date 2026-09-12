"""
Chat Route — WebSocket endpoint for real-time streaming agent responses.
"""

import json
import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.responses import JSONResponse
from langchain_core.messages import HumanMessage
from app.core.security import decode_token
from app.core.config import settings
from app.agent.graph import build_graph
from app.memory.short_term import get_checkpointer
from app.memory.long_term import extract_and_store_from_conversation, store_memory
from app.memory.models import ConversationTurn
from app.core.database import AsyncSessionLocal

router = APIRouter()


@router.websocket("/ws")
async def chat_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat.
    Expects JWT token as query param: /chat/ws?token=<jwt>

    Message format from client:
    {"message": "user input text", "session_id": "optional-uuid"}

    Response format:
    {"type": "chunk"|"hitl"|"done"|"error", "content": "...", "session_id": "..."}
    """
    await websocket.accept()

    # Authenticate
    token = websocket.query_params.get("token")
    user_id = "default_user"
    if token:
        try:
            payload = decode_token(token)
            user_id = payload.get("sub") or "default_user"
        except Exception:
            user_id = "default_user"

    checkpointer = await get_checkpointer()
    graph = build_graph(checkpointer)

    try:
        while True:
            data = await websocket.receive_text()
            body = json.loads(data)
            user_message = body.get("message", "").strip()
            session_id = body.get("session_id") or str(uuid.uuid4())
            # Model can be switched per message: {"message": "...", "model": "llama3.2:latest"}
            selected_model = body.get("model") or settings.DEFAULT_MODEL

            if not user_message:
                continue

            # Store conversation turn
            async with AsyncSessionLocal() as db:
                db.add(
                    ConversationTurn(
                        user_id=user_id,
                        session_id=session_id,
                        role="user",
                        content=user_message,
                    )
                )
                await db.commit()

            # Build initial state
            config = {"configurable": {"thread_id": f"{user_id}:{session_id}"}}
            state_input = {
                "messages": [HumanMessage(content=user_message)],
                "user_id": user_id,
                "session_id": session_id,
                "model": selected_model,
                "task": user_message,
                "plan": [],
                "current_step": 0,
                "tool_calls": [],
                "tool_results": [],
                "hitl_required": False,
                "hitl_action": None,
                "hitl_approved": None,
                "final_answer": None,
                "error": None,
            }

            # Stream graph execution
            final_answer = ""
            async for event in graph.astream(state_input, config=config):
                for node_name, node_output in event.items():
                    # HITL interrupt
                    if node_output.get("hitl_required") and not node_output.get(
                        "hitl_approved"
                    ):
                        await websocket.send_json(
                            {
                                "type": "hitl",
                                "session_id": session_id,
                                "content": f"⚠️ Approval needed: {node_output.get('hitl_action', 'Sensitive action')}",
                                "hitl_action": node_output.get("hitl_action"),
                            }
                        )
                    # Final answer
                    if node_output.get("final_answer"):
                        final_answer = node_output["final_answer"]
                        await websocket.send_json(
                            {
                                "type": "chunk",
                                "session_id": session_id,
                                "content": final_answer,
                            }
                        )

            await websocket.send_json({"type": "done", "session_id": session_id})

            # Store assistant response + extract memories
            if final_answer:
                async with AsyncSessionLocal() as db:
                    db.add(
                        ConversationTurn(
                            user_id=user_id,
                            session_id=session_id,
                            role="assistant",
                            content=final_answer,
                        )
                    )
                    await db.commit()
                # Auto-extract facts from this exchange
                await extract_and_store_from_conversation(
                    user_id, user_message, final_answer
                )

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "error", "content": str(e)})


from pydantic import BaseModel
from typing import Optional
from app.core.security import get_optional_user


class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    model: Optional[str] = None


@router.post("/message")
async def send_chat_message(
    body: ChatMessageRequest,
    user_id: str = Depends(get_optional_user),
):
    """
    HTTP REST endpoint for sending a message to the M.I.R.A.S agent.
    Returns the final synthesized answer and tool execution info.
    """
    user_message = body.message.strip()
    session_id = body.session_id or str(uuid.uuid4())
    selected_model = body.model or settings.DEFAULT_MODEL

    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Record user turn
    async with AsyncSessionLocal() as db:
        db.add(
            ConversationTurn(
                user_id=user_id,
                session_id=session_id,
                role="user",
                content=user_message,
            )
        )
        await db.commit()

    checkpointer = await get_checkpointer()
    graph = build_graph(checkpointer)

    config = {"configurable": {"thread_id": f"{user_id}:{session_id}"}}
    state_input = {
        "messages": [HumanMessage(content=user_message)],
        "user_id": user_id,
        "session_id": session_id,
        "model": selected_model,
        "task": user_message,
        "plan": [],
        "current_step": 0,
        "tool_calls": [],
        "tool_results": [],
        "hitl_required": False,
        "hitl_action": None,
        "hitl_approved": None,
        "final_answer": None,
        "error": None,
    }

    final_answer = ""
    hitl_required = False
    hitl_action = None

    async for event in graph.astream(state_input, config=config):
        for node_name, node_output in event.items():
            if node_output.get("hitl_required") and not node_output.get(
                "hitl_approved"
            ):
                hitl_required = True
                hitl_action = node_output.get("hitl_action")
            if node_output.get("final_answer"):
                final_answer = node_output["final_answer"]

    if final_answer:
        async with AsyncSessionLocal() as db:
            db.add(
                ConversationTurn(
                    user_id=user_id,
                    session_id=session_id,
                    role="assistant",
                    content=final_answer,
                )
            )
            await db.commit()
        await extract_and_store_from_conversation(user_id, user_message, final_answer)

    return {
        "response": final_answer
        or (
            f"⚠️ Action paused for approval: {hitl_action}"
            if hitl_required
            else "Task completed."
        ),
        "session_id": session_id,
        "hitl_required": hitl_required,
        "hitl_action": hitl_action,
        "model": selected_model,
    }
