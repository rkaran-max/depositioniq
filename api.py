"""FastAPI service for the DepositionIQ backend pipeline."""

from __future__ import annotations

import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.audio_transcriber import (
    SUPPORTED_AUDIO_EXTENSIONS,
    AudioTranscriptionError,
    transcribe_audio,
)
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


@app.post("/transcribe-analyze")
async def transcribe_analyze(audio_file: UploadFile = File(...)) -> dict:
    """Transcribe uploaded deposition audio and analyze the resulting transcript."""

    filename = audio_file.filename or "uploaded-audio"
    extension = Path(filename).suffix.lower()
    if extension not in SUPPORTED_AUDIO_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_AUDIO_EXTENSIONS))
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio file type '{extension or 'unknown'}'. Supported types: {supported}.",
        )

    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            temp_path = Path(temp_file.name)
            while chunk := await audio_file.read(1024 * 1024):
                temp_file.write(chunk)

        transcript_text = transcribe_audio(str(temp_path))
        results = run_pipeline(
            transcript_text,
            metadata={"source": "audio-upload", "interface": "fastapi"},
        )
        payload = serialize_pipeline_result(results)
        payload["transcript_text"] = transcript_text
        return payload
    except AudioTranscriptionError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {exc}") from exc
    finally:
        await audio_file.close()
        if temp_path and temp_path.exists():
            temp_path.unlink(missing_ok=True)
