"""Transcript ingestion utilities for DepositionIQ."""

from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256


@dataclass(frozen=True)
class Transcript:
    """Normalized representation of an uploaded or pasted deposition transcript."""

    transcript_id: str
    source_text: str
    metadata: dict


class TranscriptIngestor:
    """Load and normalize deposition transcript content."""

    def ingest_text(self, text: str, metadata: dict | None = None) -> Transcript:
        """Create a normalized transcript object from raw pasted text."""
        normalized_text = self._normalize_text(text)
        transcript_hash = sha256(normalized_text.encode("utf-8")).hexdigest()[:10]
        return Transcript(
            transcript_id=f"dep-{transcript_hash}",
            source_text=normalized_text,
            metadata=metadata or {"source": "text_input", "format": "plain_text"},
        )

    def _normalize_text(self, text: str) -> str:
        """Trim excess whitespace while preserving transcript line structure."""
        lines = [line.strip() for line in text.splitlines()]
        return "\n".join(line for line in lines if line)
