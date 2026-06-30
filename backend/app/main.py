from fastapi import FastAPI

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