"""Streamlit application for DepositionIQ."""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st

from src.claim_extractor import ClaimExtractor
from src.contradiction_detector import ContradictionDetector
from src.cross_exam_generator import CrossExamGenerator
from src.ingest import TranscriptIngestor
from src.report_generator import ReportGenerator
from src.segment import TranscriptSegmenter
from src.verifier import EvidenceVerifier


SAMPLE_TRANSCRIPT_PATH = Path("samples/sample_transcript.txt")


def load_sample_transcript() -> str:
    """Load the bundled sample transcript for demos and smoke tests."""
    if SAMPLE_TRANSCRIPT_PATH.exists():
        return SAMPLE_TRANSCRIPT_PATH.read_text(encoding="utf-8")
    return """Q: Please state your role at Meridian Labs.
A: I was responsible for vendor approvals.
Q: Did you approve Helix Supply?
A: Yes, I approved Helix Supply.
Q: Did you approve Helix Supply?
A: No, I did not approve Helix Supply."""


def run_pipeline(transcript_text: str) -> dict:
    """Run the DepositionIQ analysis pipeline."""
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
    verified_claims = verifier.verify(claims, transcript.source_text)
    contradictions = contradiction_detector.detect(verified_claims)
    verified_contradictions = verifier.verify_contradictions(
        contradictions, verified_claims
    )
    questions = cross_exam_generator.generate(verified_contradictions, verified_claims)
    report = report_generator.generate(
        transcript, verified_claims, verified_contradictions, questions
    )

    return {
        "transcript": transcript,
        "segments": segments,
        "claims": verified_claims,
        "contradictions": verified_contradictions,
        "questions": questions,
        "report": report,
    }


def render_metric_row(results: dict) -> None:
    """Render top-level case metrics."""
    verified_count = sum(
        1 for item in results["contradictions"] if item["status"] == "verified"
    )
    cols = st.columns(5)
    cols[0].metric("Segments", len(results["segments"]))
    cols[1].metric("Claims", len(results["claims"]))
    cols[2].metric("Potential Issues", len(results["contradictions"]))
    cols[3].metric("Verified", verified_count)
    cols[4].metric("Questions", len(results["questions"]))


def render_claims(claims: list[dict]) -> None:
    """Render extracted claim cards."""
    if not claims:
        st.info("No claims were extracted from the transcript.")
        return

    st.dataframe(
        pd.DataFrame(claims)[
            [
                "id",
                "topic",
                "entity",
                "polarity",
                "certainty",
                "confidence",
                "verification_status",
                "text",
            ]
        ],
        use_container_width=True,
        hide_index=True,
    )

    for claim in claims:
        with st.expander(f"{claim['id']} - {claim['topic']} / {claim['entity']}"):
            st.write(claim["text"])
            cols = st.columns(4)
            cols[0].metric("Polarity", claim["polarity"])
            cols[1].metric("Certainty", claim["certainty"])
            cols[2].metric("Confidence", f"{claim['confidence']:.0%}")
            cols[3].metric("Verification", claim["verification_status"])
            st.caption(f"Question context: {claim['question_context']}")
            st.caption(f"Evidence: {claim['evidence']}")


def render_contradictions(contradictions: list[dict]) -> None:
    """Render contradiction findings."""
    if not contradictions:
        st.success("No contradictions detected by the placeholder detector.")
        return

    st.dataframe(
        pd.DataFrame(contradictions)[
            [
                "id",
                "topic",
                "entity",
                "severity",
                "status",
                "verification_score",
                "summary",
            ]
        ],
        use_container_width=True,
        hide_index=True,
    )

    for contradiction in contradictions:
        label = (
            f"{contradiction['id']} - {contradiction['severity'].title()} severity "
            f"({contradiction['status']})"
        )
        with st.expander(label):
            st.write(contradiction["summary"])
            st.write("Related claims:", ", ".join(contradiction["claim_ids"]))
            st.caption(f"Reasoning: {contradiction['reasoning']}")
            st.caption(f"Verification: {contradiction['verification_notes']}")
            st.write("Evidence")
            for evidence in contradiction["evidence"]:
                st.code(evidence, language="text")


def render_questions(questions: list[dict]) -> None:
    """Render proposed cross-examination questions."""
    if not questions:
        st.info("No cross-examination questions generated yet.")
        return

    for question in questions:
        with st.container(border=True):
            st.markdown(f"**{question['id']} - {question['theme']}**")
            st.write(question["question"])
            st.caption(f"Purpose: {question['purpose']}")
            if question.get("source_claim_ids"):
                st.caption("Source claims: " + ", ".join(question["source_claim_ids"]))


def render_styles() -> None:
    """Inject compact styling for the analysis workspace."""
    st.markdown(
        """
        <style>
        .block-container { padding-top: 2rem; max-width: 1180px; }
        div[data-testid="stMetric"] {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 0.75rem;
            border-radius: 8px;
        }
        .stTabs [data-baseweb="tab-list"] { gap: 0.5rem; }
        </style>
        """,
        unsafe_allow_html=True,
    )


def main() -> None:
    """Launch the DepositionIQ Streamlit interface."""
    st.set_page_config(page_title="DepositionIQ", page_icon="DIQ", layout="wide")
    render_styles()

    st.title("DepositionIQ")
    st.caption("Deterministic legal reasoning vertical slice for deposition analysis.")

    with st.sidebar:
        st.header("Analysis Setup")
        use_sample = st.toggle("Use bundled sample transcript", value=True)
        st.caption("Transcript lines should use `Q:` and `A:` prefixes.")

    initial_text = load_sample_transcript() if use_sample else ""
    transcript_text = st.text_area(
        "Deposition transcript",
        value=initial_text,
        height=300,
        help="Paste deposition Q/A text here, then run the deterministic fallback pipeline.",
    )

    analyze = st.button("Analyze Deposition", type="primary", use_container_width=True)
    if not analyze:
        st.info("Paste a transcript or use the bundled sample, then click Analyze Deposition.")
        return

    try:
        results = run_pipeline(transcript_text)
    except ValueError as exc:
        st.error(str(exc))
        return
    except Exception as exc:
        st.error("DepositionIQ could not complete the analysis.")
        st.exception(exc)
        return

    overview_tab, claims_tab, contradictions_tab, cross_exam_tab, report_tab = st.tabs(
        ["Overview", "Claims", "Contradictions", "Cross Examination", "Report"]
    )

    with overview_tab:
        st.header("Case Overview")
        transcript = results["transcript"]
        st.caption(f"Transcript ID: `{transcript.transcript_id}`")
        render_metric_row(results)
        st.write(
            "DepositionIQ separates ingestion, segmentation, claim extraction, "
            "contradiction detection, verification, cross-exam generation, and reporting. "
            "This vertical slice uses deterministic fallback rules, so it runs without "
            "model training or an API key."
        )
        st.dataframe(
            pd.DataFrame(results["segments"]),
            use_container_width=True,
            hide_index=True,
        )

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
