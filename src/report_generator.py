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
