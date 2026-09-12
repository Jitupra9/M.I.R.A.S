import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

EMBEDDING_DIM = 768  # nomic-embed-text dimension


class UserMemory(Base):
    """Long-term episodic memory per user."""

    __tablename__ = "user_memories"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)  # The raw memory text
    memory_type: Mapped[str] = mapped_column(
        String(50), default="fact"
    )  # fact | preference | event | skill
    embedding: Mapped[str] = mapped_column(
        Text, nullable=True
    )  # JSON-encoded embedding or ChromaDB doc ID
    source: Mapped[str] = mapped_column(
        String(100), default="conversation"
    )  # conversation | registration | manual
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ConversationTurn(Base):
    """Stores every conversation turn for memory extraction and audit."""

    __tablename__ = "conversation_turns"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    session_id: Mapped[str] = mapped_column(String, index=True)
    role: Mapped[str] = mapped_column(String(20))  # user | assistant
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
