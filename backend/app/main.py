from fastapi import FastAPI

from app.api.analyze import router as analyze_router

app = FastAPI(
    title="CodeGuardian AI",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "CodeGuardian AI Backend Running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(analyze_router)
