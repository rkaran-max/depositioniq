"""Transcript ingestion utilities for DepositionIQ."""

from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from io import BytesIO
import re


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
        if not normalized_text:
            raise ValueError("Transcript text is empty after normalization.")

        witness_lines = [
            line for line in normalized_text.splitlines() if line.lower().startswith("a:")
        ]
        if not witness_lines:
            raise ValueError("Transcript must include at least one witness answer marked with 'A:'.")

        transcript_hash = sha256(normalized_text.encode("utf-8")).hexdigest()[:10]
        computed_metadata = {
            "source": "text_input",
            "format": "plain_text",
            "line_count": len(normalized_text.splitlines()),
            "witness_answer_count": len(witness_lines),
        }
        if metadata:
            computed_metadata.update(metadata)

        return Transcript(
            transcript_id=f"dep-{transcript_hash}",
            source_text=normalized_text,
            metadata=computed_metadata,
        )

    def extract_pdf_text(self, pdf_bytes: bytes, filename: str = "uploaded.pdf") -> str:
        """Extract and clean deposition text from a PDF byte payload.

        This method uses PyPDF for deterministic text extraction. It works for PDFs
        with an embedded text layer; scanned image-only PDFs will need OCR before
        they can be analyzed.
        """
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise RuntimeError(
                "PDF upload requires the pypdf package. Install dependencies with "
                "`pip install -r requirements.txt`."
            ) from exc

        try:
            reader = PdfReader(BytesIO(pdf_bytes))
        except Exception as exc:
            raise ValueError(f"Could not read PDF '{filename}'.") from exc

        page_text: list[str] = []
        for page_number, page in enumerate(reader.pages, start=1):
            extracted = page.extract_text() or ""
            if extracted.strip():
                page_text.append(f"[Page {page_number}]\n{extracted}")

        if not page_text:
            raise ValueError(
                f"No selectable text was found in '{filename}'. If this is a scanned "
                "PDF, run OCR first and upload the OCR text or OCR-enhanced PDF."
            )

        return self.clean_extracted_text("\n\n".join(page_text))

    def clean_extracted_text(self, text: str) -> str:
        """Clean extracted PDF text into transcript-like line structure."""
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        text = re.sub(r"-\n(?=[a-z])", "", text)
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"(?<!\n)\s+(Q:)", r"\n\1", text)
        text = re.sub(r"(?<!\n)\s+(A:)", r"\n\1", text)
        return self._normalize_text(text)

    def _normalize_text(self, text: str) -> str:
        """Trim excess whitespace while preserving transcript line structure."""
        lines = [line.strip() for line in text.splitlines()]
        return "\n".join(line for line in lines if line)
