"""Streamlit application for DepositionIQ."""

from __future__ import annotations

import streamlit as st

from src.claim_extractor import ClaimExtractor
from src.contradiction_detector import ContradictionDetector
from src.cross_exam_generator import CrossExamGenerator
from src.ingest import TranscriptIngestor
from src.report_generator import ReportGenerator
from src.segment import TranscriptSegmenter
from src.verifier import EvidenceVerifier


DEFAULT_TRANSCRIPT = """Q: Please state your role at Meridian Labs.
A: I was the operations manager from 2021 through 2023.
Q: Were you responsible for vendor approvals?
A: Yes, I reviewed and approved most vendor onboarding requests.
Q: Did you approve the Helix Supply contract in March 2022?
A: I do not remember approving that contract.
Q: Earlier you said you approved most vendor onboarding requests. Was Helix one of the vendors?
A: Helix was a vendor I worked with, but legal handled the final approval."""


def run_pipeline(transcript_text: str) -> dict:
    """Run the placeholder DepositionIQ analysis pipeline."""
    ingestor = TranscriptIngestor()
    segmenter = TranscriptSegmenter()
    claim_extractor = ClaimExtractor()
    contradiction_detector = ContradictionDetector()
    verifier = EvidenceVerifier()
    cross_exam_generator = CrossExamGenerator()
    report_generator = ReportGenerator()

    transcript = ingestor.ingest_text(transcript_text)
    segments = segmenter.segment(transcript)
    claims = claim_extractor.extract(segments)
    contradictions = contradiction_detector.detect(claims)
    verified_claims = verifier.verify(claims, transcript.source_text)
    questions = cross_exam_generator.generate(contradictions, verified_claims)
    report = report_generator.generate(transcript, verified_claims, contradictions, questions)

    return {
        "transcript": transcript,
        "segments": segments,
        "claims": verified_claims,
        "contradictions": contradictions,
        "questions": questions,
        "report": report,
    }


def render_claims(claims: list[dict]) -> None:
    """Render extracted claim cards."""
    if not claims:
        st.info("No claims were extracted from the transcript.")
        return

    for claim in claims:
        st.subheader(f"Claim {claim['id']}")
        st.write(claim["text"])
        cols = st.columns(3)
        cols[0].metric("Speaker", claim["speaker"])
        cols[1].metric("Confidence", f"{claim['confidence']:.0%}")
        cols[2].metric("Verification", claim["verification_status"])
        st.caption(f"Evidence: {claim['evidence']}")


def render_contradictions(contradictions: list[dict]) -> None:
    """Render contradiction findings."""
    if not contradictions:
        st.success("No contradictions detected by the placeholder detector.")
        return

    for contradiction in contradictions:
        with st.expander(f"{contradiction['id']} - {contradiction['severity'].title()} severity"):
            st.write(contradiction["summary"])
            st.write("Related claims:", ", ".join(contradiction["claim_ids"]))
            st.caption(f"Reasoning: {contradiction['reasoning']}")


def render_questions(questions: list[dict]) -> None:
    """Render proposed cross-examination questions."""
    if not questions:
        st.info("No cross-examination questions generated yet.")
        return

    for question in questions:
        st.markdown(f"**{question['theme']}**")
        st.write(question["question"])
        st.caption(f"Purpose: {question['purpose']}")


def main() -> None:
    """Launch the DepositionIQ Streamlit interface."""
    st.set_page_config(page_title="DepositionIQ", page_icon="DIQ", layout="wide")

    st.title("DepositionIQ")
    st.caption("LLM-powered legal reasoning scaffold for deposition transcript analysis.")

    transcript_text = st.text_area(
        "Deposition transcript",
        value=DEFAULT_TRANSCRIPT,
        height=240,
        help="Paste deposition Q/A text here to run the placeholder analysis pipeline.",
    )

    if not transcript_text.strip():
        st.warning("Enter transcript text to begin analysis.")
        return

    results = run_pipeline(transcript_text)

    overview_tab, claims_tab, contradictions_tab, cross_exam_tab, report_tab = st.tabs(
        ["Overview", "Claims", "Contradictions", "Cross Examination", "Report"]
    )

    with overview_tab:
        st.header("Case Overview")
        transcript = results["transcript"]
        cols = st.columns(4)
        cols[0].metric("Transcript ID", transcript.transcript_id)
        cols[1].metric("Segments", len(results["segments"]))
        cols[2].metric("Claims", len(results["claims"]))
        cols[3].metric("Contradictions", len(results["contradictions"]))
        st.write(
            "DepositionIQ separates ingestion, segmentation, claim extraction, "
            "contradiction detection, verification, cross-exam generation, and reporting."
        )
        st.dataframe(results["segments"], use_container_width=True)

    with claims_tab:
        st.header("Extracted Claims")
        render_claims(results["claims"])

    with contradictions_tab:
        st.header("Potential Contradictions")
        render_contradictions(results["contradictions"])

    with cross_exam_tab:
        st.header("Cross-Examination Plan")
        render_questions(results["questions"])

    with report_tab:
        st.header("Generated Report")
        st.markdown(results["report"])
        st.download_button(
            "Download Markdown Report",
            data=results["report"],
            file_name="depositioniq_report.md",
            mime="text/markdown",
        )


if __name__ == "__main__":
    main()
