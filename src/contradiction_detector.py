"""Contradiction detection placeholders."""

from __future__ import annotations


class ContradictionDetector:
    """Identify possible inconsistencies across extracted claims."""

    def detect(self, claims: list[dict]) -> list[dict]:
        """Return candidate contradiction structures using simple placeholder rules."""
        approval_claims = [
            claim for claim in claims if "approv" in claim["text"].lower()
        ]
        memory_claims = [
            claim
            for claim in claims
            if "do not remember" in claim["text"].lower()
            or "don't remember" in claim["text"].lower()
        ]

        if approval_claims and memory_claims:
            return [
                {
                    "id": "K001",
                    "claim_ids": [approval_claims[0]["id"], memory_claims[0]["id"]],
                    "severity": "medium",
                    "summary": (
                        "The witness acknowledged approval responsibilities but later "
                        "expressed lack of memory about a specific approval."
                    ),
                    "reasoning": (
                        "A real detector would compare semantic commitments, dates, "
                        "entities, and evidentiary support across the transcript."
                    ),
                }
            ]

        return self.example_contradictions()

    def example_contradictions(self) -> list[dict]:
        """Provide sample contradiction findings for initial UI development."""
        return [
            {
                "id": "K001",
                "claim_ids": ["C001", "C002"],
                "severity": "low",
                "summary": "Potential tension between stated responsibility and later uncertainty.",
                "reasoning": "Placeholder example emitted when no rule-based match is found.",
            }
        ]
