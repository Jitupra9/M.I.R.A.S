"""
Search Tool — Tavily MCP (primary) + DuckDuckGo (free fallback)
"""

from typing import List, Dict
from langchain_community.tools.tavily_search import TavilySearchResults
from duckduckgo_search import DDGS
from app.core.config import settings
import asyncio


def _tavily_search(query: str, max_results: int = 5) -> List[Dict]:
    """Search using Tavily (free tier: 1000 searches/month)."""
    tool = TavilySearchResults(
        max_results=max_results, tavily_api_key=settings.TAVILY_API_KEY
    )
    return tool.invoke(query)


def _duckduckgo_search(query: str, max_results: int = 5) -> List[Dict]:
    """Completely free DuckDuckGo fallback — no API key needed."""
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=max_results):
            results.append(
                {
                    "title": r.get("title"),
                    "url": r.get("href"),
                    "content": r.get("body"),
                }
            )
    return results


async def web_search(query: str, max_results: int = 5) -> List[Dict]:
    """Try Tavily first, fall back to DuckDuckGo automatically."""
    loop = asyncio.get_event_loop()

    if settings.TAVILY_API_KEY:
        try:
            results = await loop.run_in_executor(
                None, _tavily_search, query, max_results
            )
            return results
        except Exception:
            pass  # Fall through to DuckDuckGo

    return await loop.run_in_executor(None, _duckduckgo_search, query, max_results)
