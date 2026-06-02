"""Transcript ingestion utilities for DepositionIQ."""

from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from io import BytesIO
from pathlib import Path
import platform
import re
import shutil
import subprocess
import tempfile


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

        This first uses PyPDF for deterministic text extraction. If no embedded text
        layer is present, it falls back to macOS Vision OCR when available.
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
            page_text.append(self._extract_pdf_text_with_ocr(pdf_bytes, filename))

        return self.clean_extracted_text("\n\n".join(page_text))

    def clean_extracted_text(self, text: str) -> str:
        """Clean extracted PDF text into transcript-like line structure."""
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        text = re.sub(r"-\n(?=[a-z])", "", text)
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = re.sub(r"(?<!\n)\s+(Q:)", r"\n\1", text)
        text = re.sub(r"(?<!\n)\s+(A:)", r"\n\1", text)
        return self._merge_standalone_speaker_markers(
            self._normalize_text(self._normalize_qa_markers(text))
        )

    def _extract_pdf_text_with_ocr(self, pdf_bytes: bytes, filename: str) -> str:
        """Run OCR for image-only PDFs using the local macOS Vision framework."""
        if platform.system() != "Darwin" or not shutil.which("swift"):
            raise ValueError(
                f"No selectable text was found in '{filename}', and local OCR is not "
                "available. On macOS, install Xcode Command Line Tools; otherwise OCR "
                "the PDF externally and upload the extracted text."
            )

        script_path = Path(__file__).with_name("apple_vision_ocr.swift")
        if not script_path.exists():
            raise RuntimeError("The Apple Vision OCR helper script is missing.")

        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=True) as temp_pdf:
            temp_pdf.write(pdf_bytes)
            temp_pdf.flush()
            result = subprocess.run(
                ["swift", str(script_path), temp_pdf.name],
                check=False,
                capture_output=True,
                text=True,
                timeout=180,
            )

        if result.returncode != 0:
            raise ValueError(
                f"OCR failed for '{filename}': {result.stderr.strip() or 'unknown error'}"
            )

        ocr_text = result.stdout.strip()
        if not ocr_text:
            raise ValueError(f"OCR did not return text for '{filename}'.")
        return ocr_text

    def _normalize_qa_markers(self, text: str) -> str:
        """Normalize common deposition and OCR speaker markers to Q:/A:."""
        normalized_lines: list[str] = []
        for raw_line in text.splitlines():
            line = raw_line.strip()
            line = re.sub(r"^(A|Answer)\.\s*", "A: ", line, flags=re.IGNORECASE)
            line = re.sub(r"^(Q|Question)\.\s*", "Q: ", line, flags=re.IGNORECASE)
            if re.fullmatch(r"[eE]\.", line):
                line = "Q:"
            elif re.match(r"^[eE]\.\s+", line) and "?" in line:
                line = re.sub(r"^[eE]\.\s*", "Q: ", line)
            normalized_lines.append(line)
        return "\n".join(normalized_lines)

    def _merge_standalone_speaker_markers(self, text: str) -> str:
        """Merge standalone OCR speaker markers with the following text line."""
        merged: list[str] = []
        pending_marker = ""

        for line in text.splitlines():
            if line in {"Q:", "A:"}:
                pending_marker = line
                continue
            if pending_marker:
                merged.append(f"{pending_marker} {line}")
                pending_marker = ""
                continue
            merged.append(line)

        if pending_marker:
            merged.append(pending_marker)
        return "\n".join(merged)

    def _normalize_text(self, text: str) -> str:
        """Trim excess whitespace while preserving transcript line structure."""
        lines = [line.strip() for line in text.splitlines()]
        return "\n".join(line for line in lines if line)
