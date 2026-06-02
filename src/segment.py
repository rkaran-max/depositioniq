"""Transcript segmentation logic."""

from __future__ import annotations

from src.ingest import Transcript


class TranscriptSegmenter:
    """Break deposition transcripts into analyzable speaker turns."""

    def segment(self, transcript: Transcript) -> list[dict]:
        """Segment a transcript into ordered question and answer units.

        Each segment preserves line number and nearest question context so downstream
        modules can explain why a witness answer was treated as a claim.
        """
        segments: list[dict] = []
        current_question = ""
        current_segment: dict | None = None

        for index, line in enumerate(transcript.source_text.splitlines(), start=1):
            if line.startswith("Q:"):
                content = line[2:].strip()
                current_question = content
                current_segment = self._new_segment(
                    len(segments) + 1,
                    "Questioner",
                    content,
                    index,
                    "",
                )
                segments.append(current_segment)
                continue
            elif line.startswith("A:"):
                content = line[2:].strip()
                current_segment = self._new_segment(
                    len(segments) + 1,
                    "Witness",
                    content,
                    index,
                    current_question,
                )
                segments.append(current_segment)
                continue

            if current_segment and current_segment["speaker"] == "Witness" and self._looks_like_question(line):
                content = line.strip()
                current_question = content
                current_segment = self._new_segment(
                    len(segments) + 1,
                    "Questioner",
                    content,
                    index,
                    "",
                )
                segments.append(current_segment)
                continue

            if current_segment and not self._is_noise_line(line):
                current_segment["text"] = f"{current_segment['text']} {line.strip()}".strip()
                current_segment["end_line_number"] = index
            elif not self._is_noise_line(line):
                current_segment = self._new_segment(
                    len(segments) + 1,
                    "Unknown",
                    line.strip(),
                    index,
                    "",
                )
                segments.append(current_segment)

        return segments

    def _new_segment(
        self,
        sequence: int,
        speaker: str,
        text: str,
        line_number: int,
        question_context: str,
    ) -> dict:
        """Create a normalized transcript segment."""
        return {
            "id": f"S{sequence:03d}",
            "speaker": speaker,
            "text": text,
            "line_number": line_number,
            "end_line_number": line_number,
            "question_context": question_context if speaker == "Witness" else "",
        }

    def _is_noise_line(self, line: str) -> bool:
        """Skip OCR artifacts that do not carry testimony."""
        cleaned = line.strip()
        if not cleaned:
            return True
        if cleaned.isdigit():
            return True
        return cleaned in {"---", "-", "="}

    def _looks_like_question(self, line: str) -> bool:
        """Detect OCR question lines that lost their Q: marker."""
        cleaned = line.strip()
        if cleaned.endswith("?"):
            return True
        question_starts = (
            "And you",
            "Do you",
            "Have you",
            "Is there",
            "Was that",
            "When was",
            "You never",
        )
        return cleaned.startswith(question_starts)
