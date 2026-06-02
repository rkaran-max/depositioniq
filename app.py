"""Streamlit application for DepositionIQ."""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st

from src.claim_extractor import ClaimExtractor
from src.case_summary import CaseSummaryGenerator
from src.contradiction_detector import ContradictionDetector
from src.cross_exam_generator import CrossExamGenerator
from src.ingest import TranscriptIngestor
from src.report_generator import ReportGenerator
from src.segment import TranscriptSegmenter
from src.verifier import EvidenceVerifier
from src.witness_profile import WitnessProfileGenerator


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


def run_pipeline(transcript_text: str, metadata: dict | None = None) -> dict:
    """Run the DepositionIQ analysis pipeline."""
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
        contradictions, verified_claims
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


def build_report(results: dict, include_witness_profile: bool) -> str:
    """Build the current downloadable report."""
    return ReportGenerator().generate(
        results["transcript"],
        results["claims"],
        results["contradictions"],
        results["questions"],
        results["case_summary"],
        results["witness_profile"],
        include_witness_profile=include_witness_profile,
    )


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


def attorney_attention_level(risk: str, contradictions: list[dict], claims: list[dict]) -> str:
    """Return a concise recommended attorney attention level."""
    verified = sum(1 for item in contradictions if item.get("status") == "verified")
    low_certainty = sum(1 for claim in claims if claim.get("certainty") == "low")
    if risk == "High" or verified >= 2:
        return "High"
    if risk == "Medium" or verified or low_certainty:
        return "Moderate"
    return "Routine"


def witness_credibility_risk(results: dict) -> str:
    """Summarize credibility risk without making legal conclusions."""
    risk = results["witness_profile"]["contradiction_risk"]
    low_certainty = any(claim.get("certainty") == "low" for claim in results["claims"])
    if risk == "High":
        return "Elevated"
    if risk == "Medium" or low_certainty:
        return "Watch"
    return "Limited"


def render_intelligence_summary(results: dict) -> None:
    """Render a concise attorney-facing executive summary card."""
    profile = results["witness_profile"]
    contradictions = results["contradictions"]
    claims = results["claims"]
    risk = profile["contradiction_risk"]
    attention = attorney_attention_level(risk, contradictions, claims)
    credibility = witness_credibility_risk(results)
    dominant_topics = ", ".join(profile["key_topics"][:3]) or "No dominant topic identified"
    verified_count = sum(1 for item in contradictions if item.get("status") == "verified")

    st.subheader("Deposition Intelligence Summary")
    st.markdown(
        """
        <div style="border:1px solid #cbd5e1;border-radius:8px;padding:1rem;background:#f8fafc;margin-bottom:1rem;">
        <div style="font-size:0.9rem;color:#475569;margin-bottom:0.5rem;">Executive readout for attorney review</div>
        """,
        unsafe_allow_html=True,
    )
    cols = st.columns(3)
    cols[0].metric("Claims Extracted", len(claims))
    cols[1].metric("Contradictions Found", len(contradictions))
    cols[2].metric("Contradiction Risk", risk)

    cols = st.columns(3)
    cols[0].metric("Witness Credibility Risk", credibility)
    cols[1].metric("Attorney Attention", attention)
    cols[2].metric("Verified Issues", verified_count)

    st.markdown(f"**Dominant Topics:** {dominant_topics}")
    st.write(
        f"{profile['name']} generated {len(claims)} extracted claims across "
        f"{dominant_topics}. The current record shows {len(contradictions)} "
        f"contradiction candidate(s), with {verified_count} verified by transcript support. "
        f"Recommended attorney attention level: **{attention}**."
    )
    st.markdown("</div>", unsafe_allow_html=True)


def render_claims(claims: list[dict]) -> None:
    """Render extracted claim cards."""
    if not claims:
        st.info("No claims were extracted from the transcript.")
        return

    st.dataframe(
        pd.DataFrame(claims)[
            [
                "id",
                "speaker",
                "claim",
                "citation",
                "topic",
                "confidence",
            ]
        ],
        use_container_width=True,
        hide_index=True,
    )

    for claim in claims:
        with st.expander(f"{claim['id']} - {claim['topic']}"):
            st.write(claim["claim"])
            cols = st.columns(4)
            cols[0].metric("Speaker", claim["speaker"])
            cols[1].metric("Citation", claim["citation"])
            cols[2].metric("Confidence", f"{claim['confidence']:.0%}")
            cols[3].metric("Verification", claim["verification_status"])
            st.caption(f"Legal issue: {claim['topic']}")
            st.caption(f"Question context: {claim['question_context']}")
            st.caption(f"Evidence: {claim['evidence']}")


def render_case_summary(case_summary: dict) -> None:
    """Render the attorney-facing deposition summary."""
    st.subheader("Deposition Review Summary")
    st.metric("Witness", case_summary["witness"])

    cols = st.columns(3)
    with cols[0]:
        st.markdown("**Key Themes**")
        for item in case_summary["key_themes"]:
            st.write(f"- {item}")
    with cols[1]:
        st.markdown("**Notable Testimony**")
        for item in case_summary["notable_testimony"]:
            st.write(f"- {item}")
    with cols[2]:
        st.markdown("**Potential Areas for Follow-Up**")
        for item in case_summary["follow_up_areas"]:
            st.write(f"- {item}")


def risk_indicator(risk: str) -> tuple[str, str]:
    """Return color and label for contradiction risk."""
    palette = {
        "Low": ("#16a34a", "Low"),
        "Medium": ("#d97706", "Medium"),
        "High": ("#dc2626", "High"),
    }
    return palette.get(risk, ("#64748b", risk))


def render_witness_profile(witness_profile: dict) -> None:
    """Render a polished litigation-focused witness profile."""
    color, label = risk_indicator(witness_profile["contradiction_risk"])
    st.subheader("Witness Profile")

    top_cols = st.columns([1.1, 2.2, 1])
    top_cols[0].metric("Name", witness_profile["name"])
    with top_cols[1]:
        st.markdown("**Overview**")
        st.write(witness_profile["overview"])
    with top_cols[2]:
        st.markdown("**Contradiction Risk**")
        st.markdown(
            f"""
            <div style="border:1px solid {color};border-radius:8px;padding:0.75rem;background:{color}18;">
              <div style="font-size:0.8rem;color:#475569;">Risk Level</div>
              <div style="font-size:1.5rem;font-weight:700;color:{color};">{label}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    left, middle, right = st.columns(3)
    with left:
        with st.expander("Key Topics", expanded=True):
            for topic in witness_profile["key_topics"]:
                st.write(f"- {topic}")
        with st.expander("Important Claims", expanded=True):
            for claim in witness_profile["important_claims"]:
                st.write(f"- {claim}")

    with middle:
        with st.expander("Potential Areas of Vulnerability", expanded=True):
            for item in witness_profile["potential_vulnerabilities"]:
                st.write(f"- {item}")
        with st.expander("Potential Areas of Strength", expanded=True):
            for item in witness_profile["potential_strengths"]:
                st.write(f"- {item}")

    with right:
        with st.expander("Cross-Examination Targets", expanded=True):
            for index, target in enumerate(witness_profile["cross_examination_targets"], start=1):
                st.write(f"{index}. {target}")
        with st.expander("Suggested Follow-Up Questions", expanded=True):
            for index, question in enumerate(witness_profile["suggested_follow_up_questions"], start=1):
                st.write(f"{index}. {question}")

    with st.expander("Supporting Citations", expanded=True):
        for citation in witness_profile["supporting_citations"]:
            st.write(f"- {citation}")

    with st.expander("Transcript Excerpts"):
        for excerpt in witness_profile["transcript_excerpts"]:
            st.code(excerpt, language="text")


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


def extract_text_from_uploaded_pdfs(uploaded_files: list) -> tuple[str, list[dict]]:
    """Extract cleaned text and file metadata from uploaded PDFs."""
    ingestor = TranscriptIngestor()
    extracted_sections: list[str] = []
    file_summaries: list[dict] = []

    for uploaded_file in uploaded_files:
        pdf_text = ingestor.extract_pdf_text(uploaded_file.getvalue(), uploaded_file.name)
        extracted_sections.append(f"--- {uploaded_file.name} ---\n{pdf_text}")
        file_summaries.append(
            {
                "filename": uploaded_file.name,
                "bytes": uploaded_file.size,
                "characters_extracted": len(pdf_text),
            }
        )

    return "\n\n".join(extracted_sections), file_summaries


def main() -> None:
    """Launch the DepositionIQ Streamlit interface."""
    st.set_page_config(page_title="DepositionIQ", page_icon="DIQ", layout="wide")
    render_styles()

    st.title("DepositionIQ")
    st.caption("Deterministic legal reasoning vertical slice for deposition analysis.")
    if "analysis_results" not in st.session_state:
        st.session_state.analysis_results = None
    if "include_witness_profile_report" not in st.session_state:
        st.session_state.include_witness_profile_report = False

    with st.sidebar:
        st.header("Analysis Setup")
        input_mode = st.radio(
            "Input type",
            ["Raw text", "PDF upload"],
            help="Use pasted text for quick demos or upload text-layer PDFs.",
        )
        use_sample = st.toggle(
            "Use bundled sample transcript",
            value=True,
            disabled=input_mode == "PDF upload",
        )
        st.caption("Transcript lines should use `Q:` and `A:` prefixes.")

    metadata: dict | None = None
    transcript_text = ""

    if input_mode == "Raw text":
        initial_text = load_sample_transcript() if use_sample else ""
        transcript_text = st.text_area(
            "Deposition transcript",
            value=initial_text,
            height=300,
            help="Paste deposition Q/A text here, then run the deterministic fallback pipeline.",
        )
        metadata = {"source": "text_input", "format": "plain_text"}
    else:
        uploaded_files = st.file_uploader(
            "Upload deposition transcript PDFs",
            type=["pdf"],
            accept_multiple_files=True,
            help=(
                "Upload text-layer or scanned PDFs. Image-only PDFs use local "
                "macOS Vision OCR when available."
            ),
        )
        if uploaded_files:
            try:
                transcript_text, file_summaries = extract_text_from_uploaded_pdfs(
                    uploaded_files
                )
            except (RuntimeError, ValueError) as exc:
                st.error(str(exc))
                return

            st.success(f"Extracted text from {len(uploaded_files)} PDF file(s).")
            st.dataframe(
                pd.DataFrame(file_summaries),
                use_container_width=True,
                hide_index=True,
            )
            transcript_text = st.text_area(
                "Extracted and cleaned transcript text",
                value=transcript_text,
                height=320,
                help="Review or edit extracted PDF text before analysis.",
            )
            metadata = {
                "source": "pdf_upload",
                "format": "pdf",
                "files": [item["filename"] for item in file_summaries],
            }
        else:
            st.info("Upload one or more deposition PDFs to begin. Scanned PDFs will use OCR when available.")

    analyze = st.button("Analyze Deposition", type="primary", use_container_width=True)
    if not analyze and st.session_state.analysis_results is None:
        st.info("Provide raw transcript text or upload PDFs, then click Analyze Deposition.")
        return

    if analyze:
        try:
            st.session_state.analysis_results = run_pipeline(transcript_text, metadata=metadata)
            st.session_state.include_witness_profile_report = False
        except ValueError as exc:
            st.error(str(exc))
            return
        except Exception as exc:
            st.error("DepositionIQ could not complete the analysis.")
            st.exception(exc)
            return

    results = st.session_state.analysis_results
    overview_tab, profile_tab, claims_tab, contradictions_tab, cross_exam_tab, report_tab = st.tabs(
        ["Overview", "Witness Profile", "Claims", "Contradictions", "Cross Examination", "Report"]
    )

    with overview_tab:
        st.header("Case Overview")
        transcript = results["transcript"]
        st.caption(f"Transcript ID: `{transcript.transcript_id}`")
        render_intelligence_summary(results)
        render_metric_row(results)
        render_case_summary(results["case_summary"])
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

    with profile_tab:
        render_witness_profile(results["witness_profile"])
        if st.button("Export Witness Profile Into Final Report", type="primary"):
            st.session_state.include_witness_profile_report = True
            st.success("Witness Profile will be included in the downloadable final report.")

    with contradictions_tab:
        st.header("Potential Contradictions")
        render_contradictions(results["contradictions"])

    with cross_exam_tab:
        st.header("Cross-Examination Plan")
        render_questions(results["questions"])

    with report_tab:
        st.header("Generated Report")
        report = build_report(
            results,
            include_witness_profile=st.session_state.include_witness_profile_report,
        )
        if st.session_state.include_witness_profile_report:
            st.success("Witness Profile is included in this report export.")
        else:
            st.info("Use the Witness Profile tab to export the profile into the final report.")
        st.markdown(report)
        st.download_button(
            "Download Markdown Report",
            data=report,
            file_name="depositioniq_report.md",
            mime="text/markdown",
        )


if __name__ == "__main__":
    main()
