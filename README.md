# DepositionIQ

DepositionIQ is a Streamlit-based scaffold for an LLM-powered legal reasoning agent
that analyzes deposition transcripts. The project is organized as a modular pipeline
so each reasoning stage can be developed, tested, and replaced independently.

## Features

- Paste transcript text directly into the Streamlit interface.
- Segment transcript lines into speaker turns.
- Extract example witness claims.
- Detect placeholder contradictions across claims.
- Verify whether claims are grounded in transcript text.
- Generate cross-examination questions.
- Produce a downloadable Markdown report.

## Project Structure

```text
.
├── app.py
├── requirements.txt
├── README.md
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
   Extracts factual claims from witness answers. The placeholder implementation uses
   simple heuristics and returns structured claim dictionaries with IDs, evidence,
   confidence scores, and claim types.

4. **Contradiction Detection (`src/contradiction_detector.py`)**
   Searches for tensions between extracted claims. The scaffold currently detects a
   basic approval-versus-memory pattern and includes example contradiction objects.

5. **Verification (`src/verifier.py`)**
   Adds grounding status to claims. In production, this module would perform
   citation checks, retrieval over exhibits, and source-faithfulness validation.

6. **Cross-Examination Generation (`src/cross_exam_generator.py`)**
   Generates targeted follow-up questions from contradictions and claims. This module
   is the natural place to add LLM prompting for attorney-style questioning.

7. **Report Generation (`src/report_generator.py`)**
   Produces an attorney-facing Markdown report containing claims, contradictions,
   generated questions, and caveats.

8. **Streamlit UI (`app.py`)**
   Orchestrates the pipeline and presents results in five tabs:
   Overview, Claims, Contradictions, Cross Examination, and Report.

## Data Structures

Claims are represented as dictionaries like:

```python
{
    "id": "C001",
    "segment_id": "S002",
    "speaker": "Witness",
    "text": "I reviewed and approved most vendor onboarding requests.",
    "claim_type": "responsibility",
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
    "severity": "medium",
    "summary": "The witness acknowledged approval responsibilities but later expressed lack of memory.",
    "reasoning": "Semantic comparison placeholder.",
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

## Development Notes

This repository intentionally uses placeholder implementations so the system is easy
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
