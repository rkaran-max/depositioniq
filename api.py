"""FastAPI service for the DepositionIQ backend pipeline."""

from __future__ import annotations

import logging
import re
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
from src.ingest import TranscriptIngestor
from src.pipeline import run_pipeline, serialize_pipeline_result

logger = logging.getLogger("depositioniq.api")


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


@app.post("/extract-pdf")
async def extract_pdf(pdf_files: list[UploadFile] = File(...)) -> dict:
    """Extract and clean transcript text from one or more uploaded PDFs."""

    if not pdf_files:
        raise HTTPException(status_code=400, detail="At least one PDF file is required.")

    ingestor = TranscriptIngestor()
    extracted_sections: list[str] = []
    files: list[dict] = []

    try:
        for pdf_file in pdf_files:
            filename = pdf_file.filename or "uploaded.pdf"
            extension = Path(filename).suffix.lower()
            if extension != ".pdf":
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file type '{extension or 'unknown'}'. Upload PDF files only.",
                )

            pdf_bytes = await pdf_file.read()
            if not pdf_bytes:
                raise HTTPException(status_code=400, detail=f"Uploaded PDF '{filename}' was empty.")

            text = ingestor.extract_pdf_text(pdf_bytes, filename)
            extracted_sections.append(f"--- {filename} ---\n{text}")
            files.append(
                {
                    "filename": filename,
                    "bytes": len(pdf_bytes),
                    "characters_extracted": len(text),
                }
            )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("PDF extraction failed")
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {exc}") from exc
    finally:
        for pdf_file in pdf_files:
            await pdf_file.close()

    transcript_text = "\n\n".join(extracted_sections).strip()
    if not transcript_text:
        raise HTTPException(status_code=422, detail="No transcript text could be extracted from the uploaded PDF.")

    return {
        "transcript_text": transcript_text,
        "files": files,
    }


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
            bytes_written = 0
            while chunk := await audio_file.read(1024 * 1024):
                bytes_written += len(chunk)
                temp_file.write(chunk)

        if not bytes_written:
            raise AudioTranscriptionError("Uploaded audio file was empty.")

        logger.info(
            "Saved uploaded audio filename=%s temp_path=%s bytes=%s",
            filename,
            temp_path,
            bytes_written,
        )
        transcript_text = transcribe_audio(str(temp_path))
        logger.info("Audio transcription succeeded characters=%s", len(transcript_text))
        pipeline_transcript_text = _transcript_for_pipeline(transcript_text)
        results = run_pipeline(
            pipeline_transcript_text,
            metadata={
                "source": "audio-upload",
                "interface": "fastapi",
                "original_filename": filename,
                "transcription_mode": "audio",
            },
        )
        payload = serialize_pipeline_result(results)
        payload["transcript_text"] = transcript_text
        return payload
    except AudioTranscriptionError as exc:
        logger.info("Audio transcription unavailable or invalid: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Audio transcription analysis failed")
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {exc}") from exc
    finally:
        await audio_file.close()
        if temp_path and temp_path.exists():
            temp_path.unlink(missing_ok=True)


def _transcript_for_pipeline(transcript_text: str) -> str:
    """Ensure plain audio transcription can enter the deposition pipeline.

    Whisper generally returns prose without `Q:`/`A:` deposition markers. The
    deterministic pipeline requires at least one witness answer, so plain audio
    is treated as a witness answer while the raw transcript is still returned to
    clients for editing/review.
    """

    lines = [line.strip() for line in transcript_text.splitlines() if line.strip()]
    if any(line.lower().startswith("a:") for line in lines):
        return "\n".join(lines)

    reconstructed = _reconstruct_qa_from_audio_text(" ".join(lines) if lines else transcript_text)
    if reconstructed:
        return reconstructed
    return f"A: {' '.join(lines) if lines else transcript_text.strip()}"


def _reconstruct_qa_from_audio_text(transcript_text: str) -> str:
    """Infer simple Q:/A: turns from Whisper-style prose.

    This is intentionally conservative and deterministic. It handles short demo
    recordings where counsel questions are followed by witness answers such as
    "Yes, ..." or "No.".
    """

    sentences = re.findall(r"[^.!?]+[.!?]?", transcript_text)
    turns: list[str] = []
    pending_question = ""
    pending_answer: list[str] = []

    def flush_answer() -> None:
        nonlocal pending_question, pending_answer
        if pending_question and pending_answer:
            turns.append(f"A: {' '.join(pending_answer).strip()}")
            pending_answer = []

    for raw_sentence in sentences:
        sentence = raw_sentence.strip()
        if not sentence:
            continue

        if _looks_like_audio_question(sentence):
            flush_answer()
            turns.append(f"Q: {sentence.rstrip()}")
            pending_question = sentence
            continue

        if pending_question:
            pending_answer.append(sentence)

    flush_answer()
    return "\n".join(turns) if any(line.startswith("A:") for line in turns) else ""


def _looks_like_audio_question(sentence: str) -> bool:
    """Return True when a transcribed sentence likely belongs to counsel."""

    lowered = sentence.lower().strip()
    if lowered.endswith("?"):
        return True
    question_starts = (
        "did you",
        "do you",
        "have you",
        "were you",
        "are you",
        "when did",
        "what did",
        "what time",
        "earlier, you testified",
        "you testified",
        "previously, you testified",
    )
    return lowered.startswith(question_starts)
