"""Legal claim extraction for deposition review."""

from __future__ import annotations

import re


LEGAL_TOPICS = {
    "email_retention": "Email Retention",
    "document_preservation": "Document Preservation",
    "dr_dos_communications": "DR DOS Communications",
    "personal_knowledge": "Personal Knowledge",
    "timeline": "Timeline",
    "other": "Other",
}

FILLER_WORDS = {
    "and",
    "actually",
    "basically",
    "generally",
    "i",
    "no",
    "there",
    "you",
    "well",
    "yes",
}


class ClaimExtractor:
    """Extract structured legal claims from segmented deposition testimony.

    The extractor intentionally uses transparent deterministic rules rather than
    model training. It produces attorney-facing fields instead of generic NLP
    entities: speaker, claim, citation, legal topic, and confidence.
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
            topic = self._classify_legal_topic(
                cleaned_text, segment.get("question_context", "")
            )
            contradiction_scope = self._contradiction_scope(
                cleaned_text, segment.get("question_context", ""), topic
            )
            entity = self._extract_entity(
                cleaned_text, segment.get("question_context", ""), topic
            )
            polarity = self._infer_polarity(cleaned_text)
            certainty = self._infer_certainty(cleaned_text)
            citation = self._citation(segment)
            confidence = self._confidence(certainty, entity, topic)
            claim_text = self._draft_legal_claim(cleaned_text)
            claims.append(
                {
                    "id": claim_id,
                    "segment_id": segment["id"],
                    "speaker": segment["speaker"],
                    "text": cleaned_text,
                    "claim": claim_text,
                    "citation": citation,
                    "question_context": segment.get("question_context", ""),
                    "claim_type": topic,
                    "topic": topic,
                    "legal_topic": topic,
                    "contradiction_scope": contradiction_scope,
                    "entity": entity,
                    "polarity": polarity,
                    "certainty": certainty,
                    "confidence": confidence,
                    "evidence": f"{citation}: {cleaned_text}",
                    "line_number": segment["line_number"],
                    "end_line_number": segment.get("end_line_number", segment["line_number"]),
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
        cleaned = re.sub(r"^(well|there|yes|no)[,.\s]+", "", cleaned, flags=re.IGNORECASE)
        if re.match(r"^(i just want|that's what i'm asking|i'm asking whether)", cleaned, re.IGNORECASE):
            return ""
        return "" if cleaned.lower() in {"yes.", "no.", "i don't know.", "i don't know"} else cleaned

    def _classify_legal_topic(self, text: str, question_context: str = "") -> str:
        """Assign an attorney-facing legal topic to a witness claim."""
        lowered = f"{question_context} {text}".lower()
        if "dr dos" in lowered:
            return LEGAL_TOPICS["dr_dos_communications"]
        if "delete" in lowered or "preserve" in lowered or "keep" in lowered or "e-mail" in lowered or "email" in lowered:
            return LEGAL_TOPICS["email_retention"]
        if "record" in lowered or "document" in lowered or "log" in lowered or "file" in lowered or "contract" in lowered:
            return LEGAL_TOPICS["document_preservation"]
        if "remember" in lowered or "recall" in lowered or "specific" in lowered or "knowledge" in lowered:
            return LEGAL_TOPICS["personal_knowledge"]
        if "when" in lowered or "last time" in lowered or re.search(r"\b(19|20)\d{2}\b", lowered):
            return LEGAL_TOPICS["timeline"]
        return LEGAL_TOPICS["other"]

    def _contradiction_scope(self, text: str, question_context: str, topic: str) -> str:
        """Create a narrower comparison lane than the display legal topic."""
        answer = text.lower()
        combined = f"{question_context} {text}".lower()
        if "record" in answer or "document" in answer or "log" in answer or "file" in answer:
            return "records"
        if "email" in answer or "e-mail" in answer:
            return "email_communication"
        if "approve" in answer or "approval" in answer:
            return "approval"
        if "delete" in combined:
            return "email_deletion"
        if "preserve" in combined or "keep" in combined:
            return "email_preservation"
        if "email" in combined or "e-mail" in combined:
            return "email_communication"
        if "record" in combined or "document" in combined or "log" in combined or "file" in combined:
            return "records"
        if "approve" in combined or "approval" in combined:
            return "approval"
        if topic == LEGAL_TOPICS["timeline"]:
            return "timeline"
        if topic == LEGAL_TOPICS["personal_knowledge"]:
            return "personal_knowledge"
        return "general"

    def _extract_entity(self, text: str, question_context: str, topic: str) -> str:
        """Extract a lightweight entity key from the answer and question context."""
        combined = f"{question_context} {text}"
        lowered = combined.lower()
        if "dr dos" in lowered:
            return "DR DOS"
        if "e-mail" in lowered or "email" in lowered:
            return "Email communications"
        if "dana" in lowered:
            return "Dana"

        known_entities = ["Helix Supply", "Dana", "Meridian Labs", "Microsoft", "legal"]
        for entity in known_entities:
            if entity.lower() in combined.lower():
                return entity

        capitalized = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b", combined)
        ignored = {
            "Earlier",
            "Have",
            "Is",
            "No",
            "Please",
            "Question",
            "That",
            "There",
            "You",
            "Was",
            "Well",
            "Were",
            "What",
            "When",
            "Yes",
        }
        candidates = [
            item
            for item in capitalized
            if item not in ignored and item.lower() not in FILLER_WORDS
        ]
        if candidates:
            return candidates[0]
        if topic == LEGAL_TOPICS["email_retention"]:
            return "Email retention practice"
        if topic == LEGAL_TOPICS["personal_knowledge"]:
            return "Witness recollection"
        return "Deposition testimony"

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

    def _draft_legal_claim(self, text: str) -> str:
        """Convert raw answer text into a concise legal-review claim."""
        claim = text.strip()
        claim = re.sub(r"\band I\b", "and the witness", claim)
        claim = re.sub(r"\bI've\b", "the witness has", claim)
        claim = re.sub(r"\bI was\b", "the witness was", claim)
        claim = re.sub(r"\bI send\b", "the witness sends", claim)
        claim = re.sub(r"\bthat I\b", "that the witness", claim)
        replacements = [
            (r"^I don't\s+", "The witness does not "),
            (r"^I do not\s+", "The witness does not "),
            (r"^I never\s+", "The witness never "),
            (r"^I think it's true\s+", "The witness states it is true "),
            (r"^I think\s+", "The witness believes "),
            (r"^I believe\s+", "The witness believes "),
            (r"^I recall\s+", "The witness recalls "),
            (r"^I remember\s+", "The witness remembers "),
            (r"^I\s+", "The witness "),
        ]
        for pattern, replacement in replacements:
            claim = re.sub(pattern, replacement, claim, flags=re.IGNORECASE)
        claim = claim[0].upper() + claim[1:] if claim else claim
        return claim.rstrip(".") + "."

    def _citation(self, segment: dict) -> str:
        """Return a compact line citation for the source transcript segment."""
        start = segment["line_number"]
        end = segment.get("end_line_number", start)
        return f"Line {start}" if start == end else f"Lines {start}-{end}"

    def _confidence(self, certainty: str, entity: str, topic: str) -> float:
        """Return a deterministic extraction confidence score."""
        base = {"high": 0.9, "medium": 0.76, "low": 0.62}[certainty]
        entity_bonus = 0.04 if entity not in {"Deposition testimony", "Witness recollection"} else 0
        topic_bonus = 0.03 if topic != LEGAL_TOPICS["other"] else 0
        return min(base + entity_bonus + topic_bonus, 0.96)
