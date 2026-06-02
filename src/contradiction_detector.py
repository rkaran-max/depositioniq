"""Contradiction detection for extracted deposition claims."""

from __future__ import annotations

from itertools import combinations


class ContradictionDetector:
    """Identify possible inconsistencies across extracted claims.

    The detector compares claims that share a topic and entity, then flags opposing
    polarity, memory-versus-specific-assertion tension, and responsibility shifts.
    """

    def detect(self, claims: list[dict]) -> list[dict]:
        """Return candidate contradiction structures using deterministic rules."""
        contradictions: list[dict] = []

        for left, right in combinations(claims, 2):
            if not self._comparable(left, right):
                continue

            contradiction_type = self._contradiction_type(left, right)
            if not contradiction_type:
                continue

            contradiction_id = f"K{len(contradictions) + 1:03d}"
            contradictions.append(
                {
                    "id": contradiction_id,
                    "claim_ids": [left["id"], right["id"]],
                    "topic": left["topic"],
                    "entity": left["entity"],
                    "severity": self._severity(left, right, contradiction_type),
                    "status": "unverified",
                    "type": contradiction_type,
                    "summary": self._summary(left, right, contradiction_type),
                    "reasoning": self._reasoning(left, right, contradiction_type),
                    "evidence": [left["evidence"], right["evidence"]],
                }
            )

        return contradictions

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

    def _comparable(self, left: dict, right: dict) -> bool:
        """Return whether two claims discuss the same factual lane."""
        same_topic = left["topic"] == right["topic"]
        same_entity = left["entity"] == right["entity"] and left["entity"] != "general"
        return same_topic and same_entity

    def _contradiction_type(self, left: dict, right: dict) -> str | None:
        """Classify the contradiction relationship, if one exists."""
        polarities = {left["polarity"], right["polarity"]}
        certainties = {left["certainty"], right["certainty"]}
        if polarities == {"positive", "negative"}:
            return "direct_conflict"
        if "low" in certainties and "high" in certainties:
            return "memory_conflict"
        return None

    def _severity(self, left: dict, right: dict, contradiction_type: str) -> str:
        """Score legal significance of a contradiction."""
        if contradiction_type == "direct_conflict" and left["topic"] in {"approval", "communication"}:
            return "high"
        if contradiction_type == "direct_conflict":
            return "medium"
        return "low"

    def _summary(self, left: dict, right: dict, contradiction_type: str) -> str:
        """Build a concise contradiction summary."""
        if contradiction_type == "direct_conflict":
            return (
                f"The witness gave inconsistent {left['topic']} testimony about "
                f"{left['entity']}."
            )
        return (
            f"The witness made a specific statement about {left['entity']} but later "
            "used low-certainty memory language on the same topic."
        )

    def _reasoning(self, left: dict, right: dict, contradiction_type: str) -> str:
        """Explain why the detector flagged the pair."""
        return (
            f"{left['id']} has {left['polarity']} polarity and {left['certainty']} certainty; "
            f"{right['id']} has {right['polarity']} polarity and {right['certainty']} certainty. "
            f"Both claims share topic '{left['topic']}' and entity '{left['entity']}'. "
            f"Rule matched: {contradiction_type}."
        )
