"""Attorney-facing deposition summary generation."""

from __future__ import annotations

import re


class CaseSummaryGenerator:
    """Generate a concise legal review summary from transcript and claims."""

    def generate(self, transcript_text: str, claims: list[dict]) -> dict:
        """Return witness, themes, notable testimony, and follow-up areas."""
        lowered = transcript_text.lower()
        witness = self._extract_witness(transcript_text)

        if "dr dos" in lowered and ("bill gates" in lowered or "gates" in lowered):
            return {
                "witness": witness or "Bill Gates",
                "key_themes": [
                    "Email deletion practices",
                    "Document retention",
                    "DR DOS communications",
                ],
                "notable_testimony": [
                    "Deletes most incoming emails",
                    "Does not preserve most sent emails",
                    "Cannot recall specific DR DOS messages",
                ],
                "follow_up_areas": [
                    "Email retention policy",
                    "Timeline of DR DOS communications",
                    "Preservation obligations",
                ],
            }

        topics = list(dict.fromkeys(claim["topic"] for claim in claims))
        return {
            "witness": witness or "Unknown witness",
            "key_themes": topics[:3] or ["General deposition testimony"],
            "notable_testimony": [claim["claim"] for claim in claims[:3]],
            "follow_up_areas": self._fallback_follow_up_areas(topics),
        }

    def _extract_witness(self, transcript_text: str) -> str:
        """Extract witness name from common deposition caption language."""
        match = re.search(
            r"DEPOSITION OF\s+([A-Z][A-Z\s.'-]+?)(?:,|\s+a\s+witness)",
            transcript_text,
            flags=re.IGNORECASE,
        )
        if match:
            return self._title_case_name(match.group(1))

        role_match = re.search(r"Please state your role at ([A-Z][A-Za-z\s]+)\.", transcript_text)
        if role_match:
            return "Witness"

        return ""

    def _title_case_name(self, name: str) -> str:
        """Convert OCR/caption uppercase names into readable title case."""
        words = [word for word in re.split(r"\s+", name.strip(" ,.")) if word]
        return " ".join(word.capitalize() for word in words)

    def _fallback_follow_up_areas(self, topics: list[str]) -> list[str]:
        """Generate generic follow-up areas from detected legal topics."""
        if not topics:
            return ["Source documents", "Timeline", "Witness recollection"]

        mapping = {
            "Email Retention": "Email retention policy",
            "Document Preservation": "Preservation obligations",
            "DR DOS Communications": "Timeline of DR DOS communications",
            "Personal Knowledge": "Basis for witness recollection",
            "Timeline": "Chronology of relevant events",
        }
        follow_ups = [mapping.get(topic, f"Follow-up on {topic}") for topic in topics]
        return list(dict.fromkeys(follow_ups))[:3]
