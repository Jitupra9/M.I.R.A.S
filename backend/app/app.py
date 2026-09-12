from fastapi import FastAPI 
from app.core.config import settings
from app.core.limiter import limiter

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)
app.state.limiter = limiter

