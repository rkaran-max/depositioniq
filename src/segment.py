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

        for index, line in enumerate(transcript.source_text.splitlines(), start=1):
            speaker = "Unknown"
            content = line
            if line.startswith("Q:"):
                speaker = "Questioner"
                content = line[2:].strip()
                current_question = content
            elif line.startswith("A:"):
                speaker = "Witness"
                content = line[2:].strip()

            segments.append(
                {
                    "id": f"S{index:03d}",
                    "speaker": speaker,
                    "text": content,
                    "line_number": index,
                    "question_context": current_question if speaker == "Witness" else "",
                }
            )

        return segments
