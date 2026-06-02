"""Claim extraction placeholders for deposition reasoning."""

from __future__ import annotations


class ClaimExtractor:
    """Extract factual witness claims from segmented transcript text."""

    def extract(self, segments: list[dict]) -> list[dict]:
        """Return example claim structures from witness answers."""
        claims: list[dict] = []

        for segment in segments:
            if segment["speaker"] != "Witness":
                continue

            claim_id = f"C{len(claims) + 1:03d}"
            claims.append(
                {
                    "id": claim_id,
                    "segment_id": segment["id"],
                    "speaker": segment["speaker"],
                    "text": segment["text"],
                    "claim_type": self._classify_claim(segment["text"]),
                    "confidence": 0.82,
                    "evidence": f"Line {segment['line_number']}: {segment['text']}",
                }
            )

        if not claims:
            return self.example_claims()

        return claims

    def example_claims(self) -> list[dict]:
        """Provide sample claims for demos and tests."""
        return [
            {
                "id": "C001",
                "segment_id": "S001",
                "speaker": "Witness",
                "text": "The witness managed vendor approvals from 2021 through 2023.",
                "claim_type": "responsibility",
                "confidence": 0.84,
                "evidence": "Example deposition line.",
            }
        ]

    def _classify_claim(self, text: str) -> str:
        """Assign a coarse placeholder claim category."""
        lowered = text.lower()
        if "approve" in lowered or "responsible" in lowered:
            return "responsibility"
        if "remember" in lowered or "recall" in lowered:
            return "memory"
        return "factual_statement"
