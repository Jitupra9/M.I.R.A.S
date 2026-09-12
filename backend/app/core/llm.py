"""
LLM Factory — Returns a configured Ollama LLM instance.
Supports dynamic model selection per request.
"""

from langchain_ollama import ChatOllama
from app.core.config import settings
from typing import Optional
import httpx


def get_llm(model: Optional[str] = None, temperature: float = 0.1) -> ChatOllama:
    """
    Returns a ChatOllama instance.
    Falls back to DEFAULT_MODEL if model is None or not recognized.
    temperature=0.1 gives more deterministic/structured output.
    """
    selected = model or settings.DEFAULT_MODEL
    return ChatOllama(
        model=selected,
        base_url=settings.OLLAMA_BASE_URL,
        temperature=temperature,
        format="json",  # Request JSON output for structured tasks
    )


def get_llm_chat(model: Optional[str] = None, temperature: float = 0.7) -> ChatOllama:
    """
    Returns a ChatOllama without forced JSON format — for conversational responses.
    """
    selected = model or settings.DEFAULT_MODEL
    return ChatOllama(
        model=selected,
        base_url=settings.OLLAMA_BASE_URL,
        temperature=temperature,
    )


async def list_available_models():
    """
    Query Ollama API to get dynamically installed models.
    Falls back to config list if Ollama is unreachable.
    """
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                return [
                    {
                        "id": m["name"],
                        "name": m["name"],
                        "size_gb": round(m.get("size", 0) / 1e9, 2),
                        "description": "Locally installed",
                    }
                    for m in data.get("models", [])
                ]
    except Exception:
        pass
    # Fallback to static config list
    return settings.AVAILABLE_MODELS
