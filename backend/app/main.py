from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.limiter import limiter
from app.core.database import init_db
from app.auth.routes import router as auth_router
from app.routes.chat import router as chat_router
from app.routes.hitl import router as hitl_router
from app.routes.memory import router as memory_router
from app.routes.models import router as models_router
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler


import sys

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await init_db()
    print(
        f"[OK] M.I.R.A.S backend started -- LLM: {settings.DEFAULT_PROVIDER}/{settings.DEFAULT_MODEL}"
    )
    yield
    print("[INFO] M.I.R.A.S shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    description="Autonomous Personal AI Agent — M.I.R.A.S",
    version="2.0.0",
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# Rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(hitl_router, prefix="/hitl", tags=["Human-in-the-Loop"])
app.include_router(memory_router, prefix="/memory", tags=["Memory"])
app.include_router(models_router, prefix="/models", tags=["Models"])


@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.0.0", "agent": "M.I.R.A.S"}
