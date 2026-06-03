"""Shared DepositionIQ analysis pipeline.

This module is the single backend orchestration layer used by Streamlit,
FastAPI, and lightweight validation scripts. Keeping the pipeline here prevents
the web surfaces from drifting into separate behavior.
"""

from __future__ import annotations

from src.claim_extractor import ClaimExtractor
from src.case_summary import CaseSummaryGenerator
from src.contradiction_detector import ContradictionDetector
from src.cross_exam_generator import CrossExamGenerator
from src.ingest import TranscriptIngestor
from src.report_generator import ReportGenerator
from src.segment import TranscriptSegmenter
from src.verifier import EvidenceVerifier
from src.witness_profile import WitnessProfileGenerator


def run_pipeline(transcript_text: str, metadata: dict | None = None) -> dict:
    """Run the complete deterministic DepositionIQ analysis pipeline."""
    ingestor = TranscriptIngestor()
    segmenter = TranscriptSegmenter()
    claim_extractor = ClaimExtractor()
    contradiction_detector = ContradictionDetector()
    verifier = EvidenceVerifier()
    cross_exam_generator = CrossExamGenerator()
    report_generator = ReportGenerator()
    case_summary_generator = CaseSummaryGenerator()
    witness_profile_generator = WitnessProfileGenerator()

    transcript = ingestor.ingest_text(transcript_text, metadata=metadata)
    segments = segmenter.segment(transcript)
    claims = claim_extractor.extract(segments)
    verified_claims = verifier.verify(claims, transcript.source_text)
    contradictions = contradiction_detector.detect(verified_claims)
    verified_contradictions = verifier.verify_contradictions(
        contradictions,
        verified_claims,
    )
    questions = cross_exam_generator.generate(verified_contradictions, verified_claims)
    case_summary = case_summary_generator.generate(transcript.source_text, verified_claims)
    witness_profile = witness_profile_generator.generate(
        case_summary,
        verified_claims,
        verified_contradictions,
        questions,
        segments,
    )
    report = report_generator.generate(
        transcript,
        verified_claims,
        verified_contradictions,
        questions,
        case_summary,
        witness_profile,
        include_witness_profile=False,
    )

    return {
        "transcript": transcript,
        "segments": segments,
        "claims": verified_claims,
        "contradictions": verified_contradictions,
        "questions": questions,
        "case_summary": case_summary,
        "witness_profile": witness_profile,
        "report": report,
    }


def serialize_pipeline_result(results: dict) -> dict:
    """Convert pipeline output into API-safe JSON fields."""
    transcript = results["transcript"]
    return {
        "transcript_id": transcript.transcript_id,
        "claims": results["claims"],
        "contradictions": results["contradictions"],
        "cross_exam_questions": results["questions"],
        "witness_profile": results["witness_profile"],
        "case_summary": results["case_summary"],
        "report_markdown": results["report"],
    }
