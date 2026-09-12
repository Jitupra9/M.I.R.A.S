"""Models Route — List available Ollama models and set active model per session."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.core.llm import list_available_models
from app.core.config import settings

router = APIRouter()


@router.get("/list")
async def get_models(user_id: str = Depends(get_current_user)):
    """Returns all locally installed Ollama models with metadata."""
    models = await list_available_models()
    return {"default_model": settings.DEFAULT_MODEL, "models": models}


@router.get("/default")
async def get_default():
    """Public endpoint — returns the current default model (no auth needed)."""
    return {"default_model": settings.DEFAULT_MODEL}
