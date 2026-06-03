"""Run lightweight backend validation examples for DepositionIQ.

This script is intentionally simple: it runs the deterministic backend pipeline on
small example transcripts and prints a human-readable validation summary. It is not
a formal benchmark or test suite.
"""

from __future__ import annotations

from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.claim_extractor import ClaimExtractor
from src.contradiction_detector import ContradictionDetector
from src.cross_exam_generator import CrossExamGenerator
from src.ingest import TranscriptIngestor
from src.segment import TranscriptSegmenter
from src.verifier import EvidenceVerifier


EXAMPLE_FILES = [
    "clean_no_contradiction.txt",
    "obvious_contradiction.txt",
    "subtle_contradiction.txt",
]


def run_pipeline(transcript_text: str, source_name: str) -> dict:
    """Run the DepositionIQ backend pipeline on one transcript."""
    ingestor = TranscriptIngestor()
    segmenter = TranscriptSegmenter()
    extractor = ClaimExtractor()
    detector = ContradictionDetector()
    verifier = EvidenceVerifier()
    cross_exam = CrossExamGenerator()

    transcript = ingestor.ingest_text(
        transcript_text,
        metadata={"source": source_name, "validation_fixture": True},
    )
    segments = segmenter.segment(transcript)
    claims = extractor.extract(segments)
    verified_claims = verifier.verify(claims, transcript.source_text)
    contradictions = detector.detect(verified_claims)
    verified_contradictions = verifier.verify_contradictions(
        contradictions,
        verified_claims,
    )
    questions = cross_exam.generate(verified_contradictions, verified_claims)

    return {
        "transcript": transcript,
        "segments": segments,
        "claims": verified_claims,
        "contradictions": verified_contradictions,
        "questions": questions,
    }


def citations_for_contradiction(contradiction: dict, claims: list[dict]) -> list[str]:
    """Return source citations used by a contradiction."""
    claim_lookup = {claim["id"]: claim for claim in claims}
    citations: list[str] = []
    for claim_id in contradiction.get("claim_ids", []):
        citation = claim_lookup.get(claim_id, {}).get("citation")
        if citation and citation not in citations:
            citations.append(citation)
    return citations


def print_validation_summary(example_path: Path, result: dict) -> None:
    """Print the validation summary for one example transcript."""
    claims = result["claims"]
    contradictions = result["contradictions"]
    questions = result["questions"]

    print("=" * 88)
    print(f"Example: {example_path.name}")
    print(f"Transcript ID: {result['transcript'].transcript_id}")
    print(f"Claims extracted: {len(claims)}")
    print(f"Contradictions found: {len(contradictions)}")

    print("\nContradiction titles:")
    if contradictions:
        for contradiction in contradictions:
            status = contradiction.get("status", "unknown")
            severity = contradiction.get("severity", "unknown")
            print(
                f"- {contradiction['id']} [{status}, {severity}]: "
                f"{contradiction.get('summary', 'Untitled contradiction')}"
            )
    else:
        print("- None")

    print("\nCitations used:")
    cited: list[str] = []
    for contradiction in contradictions:
        cited.extend(citations_for_contradiction(contradiction, claims))
    if not cited:
        cited = [claim["citation"] for claim in claims[:5]]
    for citation in dict.fromkeys(cited):
        print(f"- {citation}")

    print("\nCross-examination questions generated:")
    if questions:
        for question in questions:
            related = question.get("related_contradiction_id") or "claim-foundation"
            print(f"- {question['id']} ({related}): {question['question']}")
    else:
        print("- None")
    print()


def main() -> int:
    """Run all backend validation examples."""
    examples_dir = PROJECT_ROOT / "examples"
    missing = [name for name in EXAMPLE_FILES if not (examples_dir / name).exists()]
    if missing:
        print("Missing validation example files:", ", ".join(missing), file=sys.stderr)
        return 1

    for example_name in EXAMPLE_FILES:
        example_path = examples_dir / example_name
        transcript_text = example_path.read_text(encoding="utf-8")
        result = run_pipeline(transcript_text, example_path.name)
        print_validation_summary(example_path, result)

    print("Validation complete. See examples/expected_findings.md for interpretation notes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
