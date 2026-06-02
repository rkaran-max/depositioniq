"""Cross-examination question generation placeholders."""

from __future__ import annotations


class CrossExamGenerator:
    """Generate targeted follow-up questions from contradictions and claims."""

    def generate(self, contradictions: list[dict], claims: list[dict]) -> list[dict]:
        """Create example cross-examination questions."""
        questions: list[dict] = []

        for contradiction in contradictions:
            questions.append(
                {
                    "id": f"QX{len(questions) + 1:03d}",
                    "theme": "Clarify inconsistent testimony",
                    "question": (
                        "You testified that you had approval responsibilities, but "
                        "also said you do not remember this specific approval. What "
                        "records would refresh your recollection?"
                    ),
                    "purpose": contradiction["summary"],
                    "related_contradiction_id": contradiction["id"],
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
