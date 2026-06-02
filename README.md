# DepositionIQ

DepositionIQ is a Streamlit-based vertical slice for an LLM-powered legal reasoning
agent that analyzes deposition transcripts. The current implementation runs
end-to-end without model training by using deterministic, explainable rules for
claim extraction, contradiction detection, verification, cross-examination planning,
and report generation.

## Features

- Paste transcript text directly into the Streamlit interface.
- Load the bundled sample transcript.
- Segment transcript lines into speaker turns.
- Extract structured witness claims with topic, entity, polarity, certainty, and evidence.
- Detect potential contradictions across claims.
- Verify whether claims are grounded in transcript text.
- Verify contradiction candidates using source-supported claims and shared context.
- Generate cross-examination questions tied to verified issues.
- Display clean Streamlit tabs, metrics, tables, expanders, and downloadable reports.
- Produce a downloadable Markdown report.

## Project Structure

```text
.
├── app.py
├── requirements.txt
├── README.md
├── samples
│   ├── sample_output.md
│   └── sample_transcript.txt
└── src
    ├── __init__.py
    ├── ingest.py
    ├── segment.py
    ├── claim_extractor.py
    ├── contradiction_detector.py
    ├── verifier.py
    ├── cross_exam_generator.py
    └── report_generator.py
```

## Architecture

DepositionIQ follows a pipeline architecture:

1. **Ingestion (`src/ingest.py`)**
   Normalizes raw transcript text and wraps it in a `Transcript` data object with a
   stable transcript ID and metadata.

2. **Segmentation (`src/segment.py`)**
   Converts transcript lines into ordered speaker turns. The current scaffold
   recognizes `Q:` as the questioner and `A:` as the witness.

3. **Claim Extraction (`src/claim_extractor.py`)**
   Extracts factual claims from witness answers. The current implementation uses
   transparent rules to assign topic, entity, polarity, certainty, confidence,
   evidence, and question context.

4. **Contradiction Detection (`src/contradiction_detector.py`)**
   Compares claims that share the same topic and entity. It flags direct polarity
   conflicts and memory conflicts with severity, source evidence, and reasoning.

5. **Verification (`src/verifier.py`)**
   Adds grounding status to claims and verifies contradiction candidates. A
   contradiction is marked verified when both linked claims are transcript-supported,
   share the same entity, and express opposing polarity.

6. **Cross-Examination Generation (`src/cross_exam_generator.py`)**
   Generates targeted follow-up questions from contradictions and claims. This module
   is the natural place to add LLM prompting for attorney-style questioning.

7. **Report Generation (`src/report_generator.py`)**
   Produces an attorney-facing Markdown report containing claims, contradictions,
   generated questions, and caveats.

8. **Streamlit UI (`app.py`)**
   Orchestrates the pipeline and presents results in five tabs:
   Overview, Claims, Contradictions, Cross Examination, and Report.

## Working Vertical Slice

The app runs this flow:

```text
Transcript text
  -> TranscriptIngestor
  -> TranscriptSegmenter
  -> ClaimExtractor
  -> EvidenceVerifier.verify
  -> ContradictionDetector
  -> EvidenceVerifier.verify_contradictions
  -> CrossExamGenerator
  -> ReportGenerator
```

The bundled sample transcript is in `samples/sample_transcript.txt`. It contains two
intentional inconsistencies:

- The witness first says they approved the Helix Supply contract, then later says
  they did not approve it.
- The witness first says they emailed Dana about Helix Supply, then later says they
  never emailed Dana.

Expected sample output is summarized in `samples/sample_output.md`.

## Data Structures

Claims are represented as dictionaries like:

```python
{
    "id": "C001",
    "segment_id": "S002",
    "speaker": "Witness",
    "text": "I reviewed and approved most vendor onboarding requests.",
    "claim_type": "approval",
    "topic": "approval",
    "entity": "Helix Supply",
    "polarity": "positive",
    "certainty": "high",
    "confidence": 0.82,
    "evidence": "Line 4: I reviewed and approved most vendor onboarding requests.",
    "verification_status": "supported",
}
```

Contradictions are represented as:

```python
{
    "id": "K001",
    "claim_ids": ["C001", "C003"],
    "topic": "approval",
    "entity": "Helix Supply",
    "severity": "medium",
    "status": "verified",
    "summary": "The witness acknowledged approval responsibilities but later expressed lack of memory.",
    "reasoning": "Both claims share topic and entity but express opposing polarity.",
    "verification_score": 0.91,
}
```

Cross-examination questions are represented as:

```python
{
    "id": "QX001",
    "theme": "Clarify inconsistent testimony",
    "question": "What records would refresh your recollection?",
    "purpose": "Resolve tension between responsibility and lack of memory.",
    "related_contradiction_id": "K001",
}
```

## Getting Started

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the app:

```bash
streamlit run app.py
```

Click **Analyze Transcript** to run the sample transcript or paste your own
deposition excerpt using `Q:` and `A:` line prefixes.

## Error Handling

The app validates transcript input before analysis:

- Empty input produces a user-facing error.
- Input without witness answers marked by `A:` produces a user-facing error.
- Unexpected pipeline failures are displayed in Streamlit with exception details for
  debugging.

## Development Notes

This repository intentionally uses deterministic implementations so the system is easy
to understand and extend. Recommended next steps:

- Replace heuristic claim extraction with an LLM-backed extractor.
- Add transcript file upload for PDF, TXT, and DOCX transcripts.
- Store segment offsets for precise legal citations.
- Add exhibit ingestion and retrieval-augmented verification.
- Add tests for each pipeline stage.
- Add prompt templates and schema validation for model outputs.

## Legal Disclaimer

DepositionIQ is a research and educational scaffold. It is not legal advice and
should not be used for legal strategy without qualified attorney review.
