"""Cross-examination question generation."""

from __future__ import annotations


class CrossExamGenerator:
    """Generate targeted follow-up questions from contradictions and claims."""

    def generate(self, contradictions: list[dict], claims: list[dict]) -> list[dict]:
        """Create cross-examination questions tied to verified findings."""
        questions: list[dict] = []
        claim_lookup = {claim["id"]: claim for claim in claims}

        for contradiction in contradictions:
            related_claims = [
                claim_lookup[claim_id]
                for claim_id in contradiction["claim_ids"]
                if claim_id in claim_lookup
            ]
            entity = contradiction.get("entity", "that topic")
            topic = contradiction.get("topic", "testimony")
            questions.append(
                {
                    "id": f"QX{len(questions) + 1:03d}",
                    "theme": self._theme(contradiction),
                    "question": (
                        f"You gave two different answers about {entity}. Which answer "
                        "is accurate today?"
                    ),
                    "purpose": f"Force the witness to reconcile conflicting {topic} testimony.",
                    "related_contradiction_id": contradiction["id"],
                    "source_claim_ids": contradiction["claim_ids"],
                }
            )
            if related_claims:
                questions.append(
                    {
                        "id": f"QX{len(questions) + 1:03d}",
                        "theme": "Impeachment foundation",
                        "question": (
                            f"What document, email, or calendar entry would confirm "
                            f"your testimony about {entity}?"
                        ),
                        "purpose": "Tie the contradiction to external evidence before argument.",
                        "related_contradiction_id": contradiction["id"],
                        "source_claim_ids": contradiction["claim_ids"],
                    }
                )

        if not questions and claims:
            questions.append(
                {
                    "id": "QX001",
                    "theme": "Establish foundation",
                    "question": "What documents support your testimony on this point?",
                    "purpose": "Tie the claim to documentary evidence.",
                    "related_contradiction_id": None,
                }
            )

        return questions

    def _theme(self, contradiction: dict) -> str:
        """Choose a legal examination theme for a contradiction."""
        if contradiction.get("status") == "verified":
            return "Verified inconsistency"
        return "Clarify inconsistent testimony"
