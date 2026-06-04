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
            claim_text = self._draft_legal_claim(
                cleaned_text,
                segment.get("question_context", ""),
            )
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
        return "" if cleaned.lower() in {"i don't know.", "i don't know"} else cleaned

    def _classify_legal_topic(self, text: str, question_context: str = "") -> str:
        """Assign an attorney-facing legal topic to a witness claim."""
        lowered = f"{question_context} {text}".lower()
        if self._contains_arrival_time_issue(lowered):
            return LEGAL_TOPICS["timeline"]
        if "delete" in lowered or "preserve" in lowered or "keep" in lowered or "e-mail" in lowered or "email" in lowered:
            return LEGAL_TOPICS["email_retention"]
        if "record" in lowered or "document" in lowered or "log" in lowered or "file" in lowered or "contract" in lowered:
            return LEGAL_TOPICS["document_preservation"]
        if "dr dos" in lowered:
            return LEGAL_TOPICS["dr_dos_communications"]
        if "remember" in lowered or "recall" in lowered or "specific" in lowered or "knowledge" in lowered:
            return LEGAL_TOPICS["personal_knowledge"]
        if "when" in lowered or "last time" in lowered or re.search(r"\b(19|20)\d{2}\b", lowered):
            return LEGAL_TOPICS["timeline"]
        return LEGAL_TOPICS["other"]

    def _contradiction_scope(self, text: str, question_context: str, topic: str) -> str:
        """Create a narrower comparison lane than the display legal topic."""
        answer = text.lower()
        combined = f"{question_context} {text}".lower()
        if self._contains_arrival_time_issue(combined):
            return "arrival_time"
        if ("delete" in combined or "deleted" in combined) and (
            "preserve" in combined or "preserved" in combined or "keep" in combined or "kept" in combined
        ):
            return "email_preservation_deletion"
        if ("delete" in combined or "deleted" in combined or "preserve" in combined or "preserved" in combined) and (
            "email" in combined or "e-mail" in combined
        ):
            return "email_preservation_deletion"
        if ("send" in combined or "sent" in combined) and (
            "email" in combined or "e-mail" in combined
        ):
            return "email_communication"
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
        if self._contains_arrival_time_issue(lowered):
            return "arrival time"
        if ("email" in lowered or "e-mail" in lowered) and "dana" in lowered:
            return "emails to Dana"
        if ("email" in lowered or "e-mail" in lowered) and "product review" in lowered:
            return "product review emails"
        if ("delete" in lowered or "preserve" in lowered or "keep" in lowered) and (
            "email" in lowered or "e-mail" in lowered
        ):
            return "email retention practice"
        if "e-mail" in lowered or "email" in lowered:
            return "Email communications"
        if "dr dos" in lowered:
            return "DR DOS"
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
        if (
            "i do not remember" in lowered
            or "i don't remember" in lowered
            or "i do not recall" in lowered
            or "i don't recall" in lowered
        ):
            return "uncertain"
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
        return "positive"

    def _infer_certainty(self, text: str) -> str:
        """Classify answer certainty from common deposition phrasing."""
        lowered = text.lower()
        if (
            "do not remember" in lowered
            or "don't remember" in lowered
            or "do not recall" in lowered
            or "don't recall" in lowered
            or "not sure" in lowered
        ):
            return "low"
        if "believe" in lowered or "probably" in lowered or "as far as i know" in lowered:
            return "medium"
        return "high"

    def _draft_legal_claim(self, text: str, question_context: str = "") -> str:
        """Convert raw answer text into a concise legal-review claim."""
        contextual_claim = self._claim_from_short_answer(text, question_context)
        if contextual_claim:
            return contextual_claim

        claim = text.strip()
        claim = self._replace_referential_objects(claim, question_context)
        claim = re.sub(r"\band I\b", "and the witness", claim)
        claim = re.sub(r"\bI've\b", "the witness has", claim)
        claim = re.sub(r"\bI was\b", "the witness was", claim)
        claim = re.sub(r"\bI send\b", "the witness sends", claim)
        claim = re.sub(r"\bthat I\b", "that the witness", claim)
        replacements = [
            (r"^I think I\s+", "The witness believes they "),
            (r"^I believe I\s+", "The witness believes they "),
            (r"^I think the witness\s+", "The witness believes they "),
            (r"^I believe the witness\s+", "The witness believes they "),
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
        claim = self._remove_first_person_remnants(claim)
        claim = claim[0].upper() + claim[1:] if claim else claim
        return claim.rstrip(".") + "."

    def _claim_from_short_answer(self, text: str, question_context: str) -> str:
        """Use the question to resolve short or referential answers."""
        normalized = re.sub(r"[.\s]+$", "", text.strip().lower())
        normalized = normalized.replace("'", "'")
        normalized = re.sub(r"\s+", " ", normalized)
        question_claim = self._question_to_claim_fragment(question_context)
        if not question_claim:
            return ""

        positive_markers = {
            "yes",
            "yes i do",
            "yes i did",
            "i do",
            "i did",
            "i believe so",
            "i think so",
            "probably",
        }
        negative_markers = {
            "no",
            "no i do not",
            "no i don't",
            "no i did not",
            "no i didn't",
            "i do not",
            "i don't",
            "i did not",
            "i didn't",
        }
        follow_markers = {
            "i followed it",
            "i followed them",
            "i followed that",
            "i complied with it",
            "i complied with them",
        }

        if normalized in positive_markers:
            if "believe" in normalized or "think" in normalized or "probably" in normalized:
                return f"The witness believes {question_claim}."
            return f"The witness states {question_claim}."

        if normalized in negative_markers:
            return self._negative_question_claim(question_claim)

        if normalized in follow_markers:
            followed_object = self._question_object(question_context) or "the referenced instruction"
            return f"The witness states they followed {followed_object}."

        if normalized in {"so", "that is correct", "correct"}:
            return f"The witness states {question_claim}."

        return ""

    def _question_to_claim_fragment(self, question_context: str) -> str:
        """Convert a yes/no deposition question into a third-person proposition."""
        question = self._normalize_question(question_context)
        if not question:
            return ""

        patterns = [
            (r"^did you\s+(.+)$", "past"),
            (r"^do you\s+(.+)$", "present"),
            (r"^were you\s+(.+)$", "were"),
            (r"^are you\s+(.+)$", "are"),
            (r"^have you\s+(.+)$", "have"),
            (r"^had you\s+(.+)$", "had"),
        ]
        for pattern, tense in patterns:
            match = re.match(pattern, question)
            if not match:
                continue
            phrase = match.group(1)
            phrase = self._clean_question_phrase(phrase)
            if tense == "past":
                return f"they {self._past_tense_phrase(phrase)}"
            if tense == "present":
                return f"they {phrase}"
            if tense == "were":
                return f"they were {phrase}"
            if tense == "are":
                return f"they are {phrase}"
            if tense == "have":
                return f"they have {phrase}"
            if tense == "had":
                return f"they had {phrase}"

        recall_match = re.search(r"\brecall\s+(.+)$", question)
        if recall_match:
            return f"they recall {self._clean_question_phrase(recall_match.group(1))}"
        return ""

    def _negative_question_claim(self, question_claim: str) -> str:
        """Render a negative answer to a question-derived proposition."""
        match = re.match(r"^they recall\s+(.+)$", question_claim)
        if match:
            return f"The witness does not recall {match.group(1)}."

        match = re.match(r"^they (.+)$", question_claim)
        if match:
            return f"The witness denies that they {match.group(1)}."

        return f"The witness denies that {question_claim}."

    def _replace_referential_objects(self, claim: str, question_context: str) -> str:
        """Replace phrases like 'the important ones' with the question object."""
        question_object = self._question_object(question_context)
        if not question_object:
            return claim
        object_without_article = re.sub(r"^(?:the|a|an)\s+", "", question_object)
        return re.sub(
            r"\bthe important ones\b",
            f"important {object_without_article}",
            claim,
            flags=re.IGNORECASE,
        )

    def _question_object(self, question_context: str) -> str:
        """Extract the likely object being asked about from a short question."""
        question = self._normalize_question(question_context)
        object_patterns = [
            r"^(?:did|do|have|had) you\s+(?:preserve|delete|keep|send|recall|remember|follow)\s+(.+)$",
            r"^were you aware of\s+(.+)$",
            r"^are you aware of\s+(.+)$",
        ]
        for pattern in object_patterns:
            match = re.match(pattern, question)
            if match:
                return self._clean_question_phrase(match.group(1))
        return ""

    def _normalize_question(self, question_context: str) -> str:
        """Normalize question context for deterministic claim drafting."""
        question = re.sub(r"\s+", " ", question_context).strip()
        question = question.rstrip("?. ")
        return question.lower()

    def _clean_question_phrase(self, phrase: str) -> str:
        """Clean question fragments before inserting them into claims."""
        cleaned = phrase.strip(" ?.").lower()
        cleaned = re.sub(r"\b(recall|remember)\s+any of\s+", r"\1 ", cleaned)
        cleaned = re.sub(r"\b(recall|remember)\s+any\s+", r"\1 ", cleaned)
        cleaned = re.sub(r"^any of\s+", "", cleaned)
        cleaned = re.sub(r"^any\s+", "", cleaned)
        cleaned = re.sub(r"^those\s+", "those ", cleaned)
        cleaned = re.sub(r"\byour\b", "their", cleaned)
        cleaned = re.sub(r"\byou\b", "they", cleaned)
        cleaned = re.sub(r"\bdr dos\b", "DR DOS", cleaned, flags=re.IGNORECASE)
        return cleaned

    def _past_tense_phrase(self, phrase: str) -> str:
        """Apply a small legal-domain verb map to yes/no past-tense questions."""
        irregular = {
            "arrive": "arrived",
            "delete": "deleted",
            "follow": "followed",
            "keep": "kept",
            "preserve": "preserved",
            "recall": "recalled",
            "remember": "remembered",
            "send": "sent",
        }
        parts = phrase.split(" ", 1)
        if not parts:
            return phrase
        verb = parts[0]
        rest = f" {parts[1]}" if len(parts) > 1 else ""
        return f"{irregular.get(verb, verb + 'ed')}{rest}"

    def _remove_first_person_remnants(self, claim: str) -> str:
        """Remove first-person phrasing left after deterministic rewrites."""
        cleaned = claim
        cleaned = re.sub(r"\bI preserved\b", "they preserved", cleaned)
        cleaned = re.sub(r"\bI deleted\b", "they deleted", cleaned)
        cleaned = re.sub(r"\bI arrived\b", "they arrived", cleaned)
        cleaned = re.sub(r"\bI was\b", "they were", cleaned)
        cleaned = re.sub(r"\bI sent\b", "they sent", cleaned)
        cleaned = re.sub(r"\bI followed\b", "they followed", cleaned)
        cleaned = re.sub(r"\bI recall\b", "they recall", cleaned)
        cleaned = re.sub(r"\bI remember\b", "they remember", cleaned)
        cleaned = re.sub(r"\bmy\b", "their", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\bme\b", "them", cleaned, flags=re.IGNORECASE)
        return cleaned

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

    def _contains_arrival_time_issue(self, text: str) -> bool:
        """Return whether text discusses arrival or presence timing."""
        arrival_terms = ("arrive", "arrived", "arrival", "present", "meeting started")
        has_arrival_language = any(term in text for term in arrival_terms)
        has_time = bool(
            re.search(r"\b\d{1,2}:\d{2}\s*(?:a\.m\.|p\.m\.|am|pm)?\b", text)
            or re.search(r"\b\d{1,2}\s*(?:a\.m\.|p\.m\.|am|pm)\b", text)
        )
        return has_arrival_language and has_time
