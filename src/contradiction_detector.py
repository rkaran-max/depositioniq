"""Contradiction detection for extracted deposition claims."""

from __future__ import annotations

from itertools import combinations
import re


class ContradictionDetector:
    """Identify possible inconsistencies across extracted claims.

    The detector compares claims that share a topic and entity, then flags opposing
    polarity, memory-versus-specific-assertion tension, and responsibility shifts.
    """

    def detect(self, claims: list[dict]) -> list[dict]:
        """Return candidate contradiction structures using deterministic rules."""
        contradictions: list[dict] = []
        seen_issue_keys: set[tuple[str, str]] = set()

        for left, right in combinations(claims, 2):
            if not self._comparable(left, right):
                continue

            contradiction_type = self._contradiction_type(left, right)
            if not contradiction_type:
                continue

            issue_key = (contradiction_type, left.get("entity", ""))
            if issue_key in seen_issue_keys:
                continue
            seen_issue_keys.add(issue_key)

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
                    "description": self._description(left, right, contradiction_type),
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
        same_scope = left.get("contradiction_scope") == right.get("contradiction_scope")
        same_entity = left["entity"] == right["entity"] and left["entity"] != "general"
        if same_scope and same_entity:
            return True

        memory_pair = "low" in {left.get("certainty"), right.get("certainty")}
        shared_email_lane = (
            {left.get("contradiction_scope"), right.get("contradiction_scope")}
            == {"email_communication"}
            and "email" in left.get("entity", "").lower()
            and left.get("entity") == right.get("entity")
        )
        return memory_pair and shared_email_lane

    def _contradiction_type(self, left: dict, right: dict) -> str | None:
        """Classify the contradiction relationship, if one exists."""
        polarities = {left["polarity"], right["polarity"]}
        certainties = {left["certainty"], right["certainty"]}
        if self._arrival_time_conflict(left, right):
            return "arrival_time_conflict"
        if self._preservation_deletion_conflict(left, right):
            return "preservation_deletion_conflict"
        if "low" in certainties and any(
            claim.get("polarity") == "positive" for claim in (left, right)
        ):
            return "memory_recall_conflict"
        if polarities == {"positive", "negative"}:
            return "direct_conflict"
        return None

    def _severity(self, left: dict, right: dict, contradiction_type: str) -> str:
        """Score legal significance of a contradiction."""
        if contradiction_type == "arrival_time_conflict":
            return "high"
        if contradiction_type in {"direct_conflict", "preservation_deletion_conflict"}:
            return "medium"
        return "low"

    def _summary(self, left: dict, right: dict, contradiction_type: str) -> str:
        """Build a concise contradiction summary."""
        if contradiction_type == "arrival_time_conflict":
            return "Arrival time inconsistency"
        if contradiction_type == "preservation_deletion_conflict":
            return "Email preservation/deletion inconsistency"
        if contradiction_type == "memory_recall_conflict":
            return f"Memory/recall inconsistency about {left['entity']}"
        if contradiction_type == "direct_conflict":
            return f"Direct testimony conflict about {left['entity']}"
        return f"Potential inconsistency about {left['entity']}"

    def _description(self, left: dict, right: dict, contradiction_type: str) -> str:
        """Build an attorney-readable explanation from the paired claims."""
        if contradiction_type == "arrival_time_conflict":
            left_time = self._extract_time(left)
            right_time = self._extract_time(right)
            return (
                f"The witness placed the same arrival event at {left_time} in "
                f"{left['citation']} and at {right_time} in {right['citation']}."
            )
        if contradiction_type == "preservation_deletion_conflict":
            return (
                f"The witness gave testimony that related emails were preserved "
                f"({left['citation']} or {right['citation']}) while also testifying "
                "that related emails were deleted after reading."
            )
        if contradiction_type == "memory_recall_conflict":
            specific, uncertain = self._specific_and_uncertain(left, right)
            return (
                f"The witness gave a specific account in {specific['citation']} but "
                f"used low-certainty recall language on the same subject in "
                f"{uncertain['citation']}."
            )
        return (
            f"The witness gave incompatible testimony about {left['entity']} in "
            f"{left['citation']} and {right['citation']}."
        )

    def _reasoning(self, left: dict, right: dict, contradiction_type: str) -> str:
        """Explain why the detector flagged the pair."""
        left_time = self._extract_time(left) if contradiction_type == "arrival_time_conflict" else None
        right_time = self._extract_time(right) if contradiction_type == "arrival_time_conflict" else None
        time_detail = (
            f" Extracted times: {left_time} versus {right_time}."
            if left_time and right_time
            else ""
        )
        return (
            f"{left['id']} ({left['citation']}) says: {left['claim']} "
            f"{right['id']} ({right['citation']}) says: {right['claim']} "
            f"The claims share factual lane '{left.get('contradiction_scope')}' and "
            f"entity '{left['entity']}'. Rule matched: {contradiction_type}."
            f"{time_detail}"
        )

    def _arrival_time_conflict(self, left: dict, right: dict) -> bool:
        """Detect inconsistent arrival or presence times."""
        if left.get("contradiction_scope") != "arrival_time":
            return False
        left_time = self._extract_time(left)
        right_time = self._extract_time(right)
        if not left_time or not right_time or left_time == right_time:
            return False
        return True

    def _preservation_deletion_conflict(self, left: dict, right: dict) -> bool:
        """Detect tension between preserving and deleting the same email set."""
        if left.get("contradiction_scope") != "email_preservation_deletion":
            return False
        texts = [self._combined_text(left), self._combined_text(right)]
        has_preserve = any(
            any(term in text for term in ("preserve", "preserved", "keep", "kept"))
            for text in texts
        )
        has_delete = any(any(term in text for term in ("delete", "deleted")) for text in texts)
        return has_preserve and has_delete

    def _extract_time(self, claim: dict) -> str | None:
        """Extract a normalized time phrase from claim text and question context."""
        match = re.search(
            r"\b(\d{1,2}:\d{2})\s*(a\.m\.|p\.m\.|am|pm)?",
            self._combined_text(claim),
            flags=re.IGNORECASE,
        )
        if not match:
            match = re.search(
                r"\b(\d{1,2})\s*(a\.m\.|p\.m\.|am|pm)",
                self._combined_text(claim),
                flags=re.IGNORECASE,
            )
        if not match:
            return None

        time_value = match.group(1)
        suffix = match.group(2) or ""
        suffix_key = suffix.lower().replace(".", "")
        suffix = {"am": "a.m.", "pm": "p.m."}.get(suffix_key, "")
        return f"{time_value} {suffix}".strip()

    def _combined_text(self, claim: dict) -> str:
        """Return lowercase question and answer text for rule matching."""
        return f"{claim.get('question_context', '')} {claim.get('text', '')}".lower()

    def _specific_and_uncertain(self, left: dict, right: dict) -> tuple[dict, dict]:
        """Return claims ordered as specific assertion then uncertain recall claim."""
        if left.get("certainty") == "low":
            return right, left
        return left, right
