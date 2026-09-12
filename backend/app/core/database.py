from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from pgvector.sqlalchemy import Vector
from app.core.config import settings
import aiosqlite

# ── Async PostgreSQL engine (for user data + PGVector) ───────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """FastAPI dependency — yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Create all tables on startup and seed default guest user."""
    async with engine.begin() as conn:
        from app.auth.models import User  # noqa
        from app.memory.models import ConversationTurn, UserMemory  # noqa

        await conn.run_sync(Base.metadata.create_all)

    # Ensure default_user exists for guest sessions
    from sqlalchemy import select
    from app.auth.models import User

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.id == "default_user"))
        if not result.scalar_one_or_none():
            guest = User(
                id="default_user",
                email="guest@miras.local",
                username="guest",
                full_name="Guest User",
                hashed_password="no_login_needed",
                is_active=True,
            )
            session.add(guest)
            await session.commit()

    print("[OK] Database tables initialized (PostgreSQL + ChromaDB memory)")
