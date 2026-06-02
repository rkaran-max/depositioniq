"""Rule-based claim extraction for deposition reasoning."""

from __future__ import annotations

import re


class ClaimExtractor:
    """Extract structured factual witness claims from segmented transcript text.

    The extractor intentionally uses transparent deterministic rules rather than
    model training. It is designed as a working vertical slice that can later be
    replaced by an LLM-backed extractor without changing the app contract.
    """

    def extract(self, segments: list[dict]) -> list[dict]:
        """Return structured claims from witness answers."""
        claims: list[dict] = []

        for segment in segments:
            if segment["speaker"] != "Witness":
                continue

            cleaned_text = self._clean_answer(segment["text"])
            if not cleaned_text:
                continue

            claim_id = f"C{len(claims) + 1:03d}"
            topic = self._classify_claim(cleaned_text, segment.get("question_context", ""))
            entity = self._extract_entity(
                cleaned_text, segment.get("question_context", ""), topic
            )
            polarity = self._infer_polarity(cleaned_text)
            certainty = self._infer_certainty(cleaned_text)
            claims.append(
                {
                    "id": claim_id,
                    "segment_id": segment["id"],
                    "speaker": segment["speaker"],
                    "text": cleaned_text,
                    "question_context": segment.get("question_context", ""),
                    "claim_type": topic,
                    "topic": topic,
                    "entity": entity,
                    "polarity": polarity,
                    "certainty": certainty,
                    "confidence": self._confidence(certainty, entity),
                    "evidence": f"Line {segment['line_number']}: {cleaned_text}",
                    "line_number": segment["line_number"],
                }
            )

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

    def _clean_answer(self, text: str) -> str:
        """Remove hesitation-only fragments while preserving substantive answers."""
        cleaned = re.sub(r"\s+", " ", text).strip()
        return "" if cleaned.lower() in {"yes.", "no.", "i don't know."} else cleaned

    def _classify_claim(self, text: str, question_context: str = "") -> str:
        """Assign a coarse placeholder claim category."""
        lowered = f"{question_context} {text}".lower()
        if "record" in lowered or "document" in lowered or "log" in lowered or "file" in lowered:
            return "records"
        if "approve" in lowered or "responsible" in lowered:
            return "approval"
        if "email" in lowered or "call" in lowered or "told" in lowered:
            return "communication"
        if "meeting" in lowered or "attend" in lowered:
            return "attendance"
        if "contract" in lowered:
            return "records"
        if "remember" in lowered or "recall" in lowered:
            return "memory"
        return "factual_statement"

    def _extract_entity(self, text: str, question_context: str, topic: str) -> str:
        """Extract a lightweight entity key from the answer and question context."""
        combined = f"{question_context} {text}"
        if topic == "communication" and "dana" in combined.lower():
            return "Dana"

        known_entities = ["Helix Supply", "Dana", "Meridian Labs", "legal"]
        for entity in known_entities:
            if entity.lower() in combined.lower():
                return entity

        capitalized = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b", combined)
        ignored = {"Please", "Were", "Did", "Do", "Earlier", "What", "When", "I", "Yes", "No"}
        candidates = [item for item in capitalized if item not in ignored]
        return candidates[0] if candidates else "general"

    def _infer_polarity(self, text: str) -> str:
        """Infer whether the witness affirms, denies, or qualifies a proposition."""
        lowered = text.lower()
        negative_markers = [
            "did not",
            "do not",
            "don't",
            "never",
            "no ",
            "not responsible",
            "was not",
            "were not",
            "didn't",
        ]
        if any(marker in lowered for marker in negative_markers):
            return "negative"
        if "i do not remember" in lowered or "i don't remember" in lowered:
            return "uncertain"
        return "positive"

    def _infer_certainty(self, text: str) -> str:
        """Classify answer certainty from common deposition phrasing."""
        lowered = text.lower()
        if "do not remember" in lowered or "don't remember" in lowered or "not sure" in lowered:
            return "low"
        if "believe" in lowered or "probably" in lowered or "as far as i know" in lowered:
            return "medium"
        return "high"

    def _confidence(self, certainty: str, entity: str) -> float:
        """Return a deterministic extraction confidence score."""
        base = {"high": 0.9, "medium": 0.76, "low": 0.62}[certainty]
        return min(base + (0.04 if entity != "general" else 0), 0.95)
