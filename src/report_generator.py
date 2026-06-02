"""Markdown report generation for DepositionIQ."""

from __future__ import annotations

from src.ingest import Transcript


class ReportGenerator:
    """Produce a concise attorney-facing analysis report."""

    def generate(
        self,
        transcript: Transcript,
        claims: list[dict],
        contradictions: list[dict],
        questions: list[dict],
        case_summary: dict | None = None,
        witness_profile: dict | None = None,
        include_witness_profile: bool = False,
    ) -> str:
        """Build a Markdown report from pipeline outputs."""
        claim_lines = "\n".join(
            f"- **{claim['id']}** [{claim['topic']}, {claim['citation']}]: {claim['claim']}"
            for claim in claims
        )
        contradiction_lines = "\n".join(
            f"- **{item['id']}** [{item['severity']}]: {item['summary']}"
            for item in contradictions
        )
        question_lines = "\n".join(
            f"- **{question['theme']}**: {question['question']}"
            for question in questions
        )
        verified_count = sum(1 for item in contradictions if item.get("status") == "verified")
        case_summary = case_summary or {
            "witness": "Unknown witness",
            "key_themes": [],
            "notable_testimony": [],
            "follow_up_areas": [],
        }
        key_theme_lines = "\n".join(f"- {item}" for item in case_summary["key_themes"])
        notable_lines = "\n".join(f"- {item}" for item in case_summary["notable_testimony"])
        follow_up_lines = "\n".join(f"- {item}" for item in case_summary["follow_up_areas"])
        witness_profile_section = (
            self._witness_profile_section(witness_profile)
            if include_witness_profile and witness_profile
            else ""
        )

        return f"""# DepositionIQ Report

## Transcript
- Transcript ID: `{transcript.transcript_id}`
- Source: `{transcript.metadata.get("source", "unknown")}`
- Witness answers: `{transcript.metadata.get("witness_answer_count", "unknown")}`

## Executive Summary
- Claims extracted: `{len(claims)}`
- Potential contradictions: `{len(contradictions)}`
- Verified contradictions: `{verified_count}`
- Cross-examination questions: `{len(questions)}`

## Deposition Review Summary
- Witness: **{case_summary["witness"]}**

### Key Themes
{key_theme_lines or "- No key themes identified."}

### Notable Testimony
{notable_lines or "- No notable testimony identified."}

### Potential Areas for Follow-Up
{follow_up_lines or "- No follow-up areas identified."}

{witness_profile_section}

## Claims
{claim_lines or "- No claims extracted."}

## Contradictions
{contradiction_lines or "- No contradictions detected."}

## Cross-Examination Questions
{question_lines or "- No questions generated."}

## Notes
This report is generated from placeholder logic. In a production system, each stage
would call validated legal-reasoning prompts, retrieval tools, citation checks, and
human review workflows before use in legal strategy.
"""

    def _witness_profile_section(self, witness_profile: dict) -> str:
        """Render the witness profile as Markdown for report export."""
        return f"""## Witness Profile

### Name
{witness_profile["name"]}

### Overview
{witness_profile["overview"]}

### Key Topics
{self._numberless_list(witness_profile["key_topics"])}

### Important Claims
{self._numberless_list(witness_profile["important_claims"])}

### Potential Areas of Vulnerability
{self._numberless_list(witness_profile["potential_vulnerabilities"])}

### Potential Areas of Strength
{self._numberless_list(witness_profile["potential_strengths"])}

### Contradiction Risk
{witness_profile["contradiction_risk"]}

### Cross-Examination Targets
{self._numbered_list(witness_profile["cross_examination_targets"])}

### Suggested Follow-Up Questions
{self._numbered_list(witness_profile["suggested_follow_up_questions"])}

### Supporting Citations
{self._numberless_list(witness_profile["supporting_citations"])}
"""

    def _numberless_list(self, items: list[str]) -> str:
        """Render a Markdown bullet list."""
        return "\n".join(f"- {item}" for item in items) or "- None identified."

    def _numbered_list(self, items: list[str]) -> str:
        """Render a Markdown numbered list."""
        return "\n".join(f"{index}. {item}" for index, item in enumerate(items, start=1)) or "1. None identified."
