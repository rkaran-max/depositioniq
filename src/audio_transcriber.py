"""Optional local audio transcription support for DepositionIQ.

This module deliberately keeps transcription optional. The core transcript and
PDF workflows should continue to run even when Whisper dependencies are not
installed. Install `faster-whisper` or `openai-whisper` to enable this path.
"""

from __future__ import annotations

from pathlib import Path


SUPPORTED_AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".mp4"}
MISSING_AUDIO_DEPENDENCY_MESSAGE = (
    "Audio transcription is not installed. Install optional audio dependencies "
    "or use pasted transcript text. Suggested options: `pip install faster-whisper` "
    "or `pip install openai-whisper`."
)


class AudioTranscriptionError(RuntimeError):
    """Raised when optional audio transcription cannot complete."""


def transcribe_audio(file_path: str) -> str:
    """Transcribe a local deposition audio file into text.

    The function prefers `faster-whisper` on CPU with int8 compute, then falls
    back to `openai-whisper` if available. It intentionally avoids cloud APIs
    and GPU requirements so the CS153 demo can remain local-first.
    """

    path = Path(file_path)
    if not path.exists():
        raise AudioTranscriptionError(f"Audio file not found: {file_path}")

    extension = path.suffix.lower()
    if extension not in SUPPORTED_AUDIO_EXTENSIONS:
        supported = ", ".join(sorted(SUPPORTED_AUDIO_EXTENSIONS))
        raise AudioTranscriptionError(
            f"Unsupported audio file type '{extension}'. Supported types: {supported}."
        )

    try:
        return _transcribe_with_faster_whisper(path)
    except ModuleNotFoundError:
        pass

    try:
        return _transcribe_with_openai_whisper(path)
    except ModuleNotFoundError as exc:
        raise AudioTranscriptionError(MISSING_AUDIO_DEPENDENCY_MESSAGE) from exc


def _transcribe_with_faster_whisper(path: Path) -> str:
    """Transcribe with faster-whisper using CPU-friendly defaults."""

    from faster_whisper import WhisperModel

    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, _info = model.transcribe(str(path), vad_filter=True)
    transcript = " ".join(segment.text.strip() for segment in segments if segment.text.strip())
    return _validate_transcript(transcript)


def _transcribe_with_openai_whisper(path: Path) -> str:
    """Transcribe with openai-whisper using its local CPU-capable model."""

    import whisper

    model = whisper.load_model("base")
    result = model.transcribe(str(path), fp16=False)
    transcript = str(result.get("text", "")).strip()
    return _validate_transcript(transcript)


def _validate_transcript(transcript: str) -> str:
    """Ensure the transcription library returned usable text."""

    cleaned = " ".join(transcript.split())
    if not cleaned:
        raise AudioTranscriptionError(
            "Audio transcription produced no text. Try a clearer recording or use pasted transcript text."
        )
    return cleaned
