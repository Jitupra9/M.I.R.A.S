"""
Long-Term Memory — ChromaDB (Vector Store)
Stores user facts, preferences, events as vector embeddings.
Uses ChromaDB (already installed) — no extra database needed.
Retrieved via cosine similarity at the start of every agent turn.

To switch to PGVector later, replace this file with long_term_pgvector.py
"""
from typing import List
import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_ollama import OllamaEmbeddings
from app.core.config import settings

# ── ChromaDB client (persistent, stored locally) ──────────────────────────────
_chroma_client = None
_collection = None


def _get_collection():
    global _chroma_client, _collection
    if _collection is None:
        _chroma_client = chromadb.PersistentClient(
            path="./miras_memory",
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        _collection = _chroma_client.get_or_create_collection(
            name="user_memories",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


# ── Embedding model (Ollama nomic-embed-text) ────────────────────────────────
_embed_model = None


def _get_embedder():
    global _embed_model
    if _embed_model is None:
        _embed_model = OllamaEmbeddings(
            model=settings.EMBEDDING_MODEL,
            base_url=settings.OLLAMA_BASE_URL,
        )
    return _embed_model


async def store_memory(user_id: str, content: str, memory_type: str = "fact", source: str = "conversation"):
    """Store a new memory for a user with its embedding in ChromaDB."""
    import uuid
    embedder = _get_embedder()
    embedding = await embedder.aembed_query(content)
    collection = _get_collection()

    doc_id = f"{user_id}_{str(uuid.uuid4())}"
    collection.add(
        ids=[doc_id],
        embeddings=[embedding],
        documents=[content],
        metadatas=[{"user_id": user_id, "memory_type": memory_type, "source": source}]
    )


async def recall_memories(user_id: str, query: str, top_k: int = None) -> List[str]:
    """Recall the most relevant memories for the user given a query."""
    k = top_k or settings.MEMORY_TOP_K
    embedder = _get_embedder()
    query_embedding = await embedder.aembed_query(query)
    collection = _get_collection()

    try:
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(k, collection.count()),
            where={"user_id": user_id}
        )
        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        return [f"[{m.get('memory_type','fact')}] {d}" for d, m in zip(docs, metas)]
    except Exception:
        return []


async def seed_user_memory(user):
    """On registration — seed the user's profile into long-term memory."""
    facts = []
    if user.full_name:
        facts.append(f"My name is {user.full_name}")
    if user.profession:
        facts.append(f"I work as a {user.profession}")
    if user.skills:
        facts.append(f"My skills include: {user.skills}")
    if user.location:
        facts.append(f"I am located in {user.location}")
    if user.bio:
        facts.append(f"About me: {user.bio}")

    for fact in facts:
        await store_memory(user.id, fact, memory_type="profile", source="registration")


async def extract_and_store_from_conversation(user_id: str, user_message: str, assistant_reply: str):
    """
    Auto-extract facts from conversation and store in long-term memory.
    Called after every assistant response.
    """
    if not settings.MEMORY_EXTRACT_FACTS:
        return

    from langchain_ollama import ChatOllama
    from langchain_core.messages import HumanMessage, SystemMessage

    llm = ChatOllama(model=settings.DEFAULT_MODEL, base_url=settings.OLLAMA_BASE_URL, temperature=0.1)

    extraction_prompt = f"""Extract any new personal facts about the USER from this conversation.
Return ONLY a JSON array of short fact strings. Return [] if nothing new is revealed.

USER said: {user_message}
ASSISTANT replied: {assistant_reply}

Rules:
- Only facts ABOUT the user (not general knowledge)
- Keep each fact under 30 words
- Output example: ["User prefers Python", "User has a meeting on Friday"]
"""
    try:
        response = await llm.ainvoke([
            SystemMessage(content="Output only valid JSON arrays."),
            HumanMessage(content=extraction_prompt)
        ])
        import json
        raw = response.content.strip()
        # Extract JSON array from response
        start = raw.find("[")
        end = raw.rfind("]")
        if start != -1 and end != -1:
            facts = json.loads(raw[start:end+1])
            for fact in facts[:5]:
                await store_memory(user_id, str(fact), memory_type="fact", source="conversation")
    except Exception:
        pass  # Silently skip extraction errors
