"""FastAPI service for the DepositionIQ backend pipeline."""

from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.pipeline import run_pipeline, serialize_pipeline_result


class AnalyzeRequest(BaseModel):
    """Request body for deposition analysis."""

    transcript_text: str = Field(..., min_length=1)


app = FastAPI(
    title="DepositionIQ API",
    description="Lightweight API around the deterministic DepositionIQ analysis pipeline.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    """Return service health for frontend connectivity checks."""
    return {"status": "ok", "service": "depositioniq-api"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest) -> dict:
    """Analyze transcript text and return structured deposition intelligence."""
    transcript_text = request.transcript_text.strip()
    if not transcript_text:
        raise HTTPException(status_code=400, detail="transcript_text cannot be empty")

    try:
        results = run_pipeline(
            transcript_text,
            metadata={"source": "nextjs-api", "interface": "fastapi"},
        )
        return serialize_pipeline_result(results)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc
