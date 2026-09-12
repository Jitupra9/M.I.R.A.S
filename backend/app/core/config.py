from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Optional, Union


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=True,
    )

    # ── APP ──────────────────────────────────────────────────
    APP_NAME: str = "M.I.R.A.S"
    APP_ENV: str = "development"
    DEBUG: bool = True

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v):
        if isinstance(v, str):
            return v.lower() in ("true", "1", "yes", "debug", "dev", "development")
        return bool(v)

    SECRET_KEY: str = "change-me-in-production"
    FRONTEND_URL: str = "http://localhost:3000"

    # ── DATABASE (PostgreSQL for PGVector) ───────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/miras"
    SYNC_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/miras"

    # ── SQLITE CHECKPOINTER (LangGraph) ──────────────────────
    SQLITE_CHECKPOINT_DB: str = "./miras_checkpoints.db"

    # ── JWT ───────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "change-me-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRES: int = 60  # minutes
    JWT_REFRESH_TOKEN_EXPIRES: int = 10080  # minutes (7 days)

    # ── LOCAL LLM (Ollama) ────────────────────────────────────────────────────
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_PROVIDER: str = "ollama"
    DEFAULT_MODEL: str = "qwen2.5:3b"  # Default: best structured output
    EMBEDDING_MODEL: str = "nomic-embed-text"

    # All locally installed Ollama models (auto-discovered or manually listed)
    AVAILABLE_MODELS: list = [
        {
            "id": "qwen2.5:3b",
            "name": "Qwen 2.5 3B",
            "description": "Best structured output, default",
        },
        {
            "id": "llama3.2:latest",
            "name": "Llama 3.2",
            "description": "General purpose, strong reasoning",
        },
        {
            "id": "tinyllama:latest",
            "name": "TinyLlama",
            "description": "Fastest, lightweight tasks",
        },
    ]

    # ── CLOUD LLM FALLBACK (optional) ────────────────────────
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # ── SEARCH ────────────────────────────────────────────────
    TAVILY_API_KEY: str = ""  # Free tier at tavily.com

    # ── EMAIL (optional for meeting/job features) ─────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    # ── MEMORY ────────────────────────────────────────────────
    MEMORY_TOP_K: int = 5  # How many memories to inject per turn
    MEMORY_EXTRACT_FACTS: bool = True  # Auto-extract user facts every turn

    # ── HITL ──────────────────────────────────────────────────
    HITL_TIMEOUT_SECONDS: int = 300  # 5 min before auto-reject


settings = Settings()
