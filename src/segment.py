"""Transcript segmentation logic."""

from __future__ import annotations

from src.ingest import Transcript


class TranscriptSegmenter:
    """Break deposition transcripts into analyzable speaker turns."""

    def segment(self, transcript: Transcript) -> list[dict]:
        """Segment a transcript into ordered question and answer units."""
        segments: list[dict] = []

        for index, line in enumerate(transcript.source_text.splitlines(), start=1):
            speaker = "Unknown"
            content = line
            if line.startswith("Q:"):
                speaker = "Questioner"
                content = line[2:].strip()
            elif line.startswith("A:"):
                speaker = "Witness"
                content = line[2:].strip()

            segments.append(
                {
                    "id": f"S{index:03d}",
                    "speaker": speaker,
                    "text": content,
                    "line_number": index,
                }
            )

        return segments
