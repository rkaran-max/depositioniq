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
            for prompt in self._prompts_for_contradiction(contradiction, related_claims):
                questions.append(
                    {
                        "id": f"QX{len(questions) + 1:03d}",
                        "theme": prompt["theme"],
                        "question": prompt["question"],
                        "purpose": prompt["purpose"],
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

    def _prompts_for_contradiction(
        self, contradiction: dict, related_claims: list[dict]
    ) -> list[dict]:
        """Create issue-specific cross-examination prompts."""
        contradiction_type = contradiction.get("type")
        citations = self._citations(related_claims)
        citation_text = ", ".join(citations) if citations else "the cited testimony"

        if contradiction_type == "arrival_time_conflict":
            return [
                {
                    "theme": "Arrival timeline impeachment",
                    "question": (
                        "You testified both that you were present at 9:00 a.m. and "
                        "that you did not arrive until 10:30 a.m.; which timeline is accurate?"
                    ),
                    "purpose": f"Lock the witness into one arrival timeline using {citation_text}.",
                },
                {
                    "theme": "Objective record foundation",
                    "question": (
                        "What calendar entries, badge logs, or meeting records would show "
                        "the time you actually arrived?"
                    ),
                    "purpose": "Tie the timing conflict to independent records.",
                },
            ]

        if contradiction_type == "preservation_deletion_conflict":
            return [
                {
                    "theme": "Preservation versus deletion",
                    "question": (
                        "You testified that related emails were preserved, but also that "
                        "you deleted related emails after reading them; how do you reconcile those answers?"
                    ),
                    "purpose": f"Test whether preservation and deletion testimony can both be true under {citation_text}.",
                },
                {
                    "theme": "Retention record foundation",
                    "question": (
                        "What retention policy, legal hold notice, or email log would show "
                        "which relevant emails were preserved and which were deleted?"
                    ),
                    "purpose": "Identify records that can verify the preservation account.",
                },
            ]

        if contradiction_type == "memory_recall_conflict":
            entity = contradiction.get("entity", "the communication")
            return [
                {
                    "theme": "Memory limitation",
                    "question": (
                        f"You gave specific testimony about {entity}, but later said you "
                        f"do not recall {entity}; is your current testimony based on memory or records?"
                    ),
                    "purpose": f"Separate lack of recollection from whether {entity} occurred.",
                },
                {
                    "theme": "Record existence",
                    "question": (
                        "Your inability to recall the communication does not mean no "
                        "record of it exists, correct?"
                    ),
                    "purpose": "Preserve the distinction between memory failure and documentary proof.",
                },
            ]

        entity = contradiction.get("entity", "that topic")
        return [
            {
                "theme": self._theme(contradiction),
                "question": (
                    f"You gave inconsistent testimony about {entity}. Which answer "
                    "is accurate today?"
                ),
                "purpose": f"Force the witness to reconcile testimony linked to {citation_text}.",
            },
            {
                "theme": "Impeachment foundation",
                "question": (
                    f"What document, email, or calendar entry would confirm your testimony "
                    f"about {entity}?"
                ),
                "purpose": "Tie the contradiction to external evidence before argument.",
            },
        ]

    def _citations(self, claims: list[dict]) -> list[str]:
        """Return unique citations for linked claims."""
        citations: list[str] = []
        for claim in claims:
            citation = claim.get("citation")
            if citation and citation not in citations:
                citations.append(citation)
        return citations
