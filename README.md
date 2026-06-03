# DepositionIQ

DepositionIQ is a prototype legal AI system for analyzing deposition transcripts.
This repository currently contains two complementary project tracks:

1. **Python/Streamlit prototype backend** in `app.py` and `src/`
   This is the working vertical slice. It runs end-to-end without model training or
   an API key by using deterministic, explainable fallback rules for claim
   extraction, contradiction detection, verification, cross-examination planning,
   witness profiling, PDF extraction, OCR fallback, and report generation.
2. **Next.js polished frontend prototype** in `frontend/`
   This is a YC-demo-ready interface concept built with Next.js, TypeScript,
   Tailwind CSS, shadcn-style components, lucide-react icons, and framer-motion.
   It currently displays realistic DepositionIQ mock outputs from
   `frontend/lib/mock-analysis.ts` and is not yet wired to the Python backend.

## Features

- Paste transcript text directly into the Streamlit interface.
- Upload one or more text-layer PDF deposition transcripts.
- Review and edit cleaned PDF-extracted text before running analysis.
- Click **Analyze Deposition** to run the full pipeline.
- Load the bundled sample transcript.
- Segment transcript lines into speaker turns.
- Extract structured witness claims with speaker, legal topic, claim text, citation,
  and confidence.
- Detect potential contradictions across claims.
- Verify whether claims are grounded in transcript text.
- Verify contradiction candidates using source-supported claims and shared context.
- Generate cross-examination questions tied to verified issues.
- Summarize witness, key themes, notable testimony, and follow-up areas.
- Generate a dedicated Witness Profile with contradiction risk, strengths,
  vulnerabilities, cross-examination targets, suggested follow-up questions, and
  supporting citations.
- Display clean Streamlit tabs, metrics, tables, expanders, and downloadable reports.
- Produce a downloadable Markdown report.

## Project Structure

```text
.
├── app.py
├── examples
│   ├── clean_no_contradiction.txt
│   ├── obvious_contradiction.txt
│   ├── subtle_contradiction.txt
│   └── expected_findings.md
├── frontend
│   ├── app
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── claim-table.tsx
│   │   ├── contradiction-card.tsx
│   │   ├── courtshadow-panel.tsx
│   │   ├── metric-card.tsx
│   │   ├── report-panel.tsx
│   │   ├── sidebar.tsx
│   │   ├── witness-profile.tsx
│   │   └── ui
│   ├── lib
│   │   ├── mock-analysis.ts
│   │   └── utils.ts
│   ├── package.json
│   └── README.md
├── requirements.txt
├── README.md
├── samples
│   ├── sample_output.md
│   └── sample_transcript.txt
├── scripts
│   └── validate_backend.py
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

## Prototype Tracks

### Python/Streamlit Backend Prototype

The backend prototype is the functional analysis pipeline. It accepts pasted
transcript text or uploaded PDFs, cleans/extracts transcript text, segments speaker
turns, extracts structured witness claims, detects and verifies contradictions,
generates cross-examination questions, builds a witness profile, and produces a
downloadable Markdown report.

Primary files:

- `app.py`: Streamlit application and UI orchestration.
- `src/`: Modular legal reasoning pipeline.
- `samples/`: Sample transcript and sample output.

### Next.js Frontend Prototype

The frontend prototype is a polished product interface for DepositionIQ. It includes
a dark AI-startup dashboard, sidebar navigation, upload panel, metrics, claims table,
contradiction cards, cross-examination strategy cards, witness profile panel,
CourtShadow panel, and report panel.

Primary files:

- `frontend/app/page.tsx`: Main dashboard and landing experience.
- `frontend/components/`: Reusable UI components.
- `frontend/lib/mock-analysis.ts`: Realistic sample DepositionIQ outputs used by
  the UI before backend integration.

The frontend is intentionally mock-driven for now. Backend integration can be added
later by replacing the mock exports in `frontend/lib/mock-analysis.ts` with API calls
to the Python analysis pipeline.

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
   transparent rules to assign attorney-facing topics such as Email Retention,
   Document Preservation, DR DOS Communications, Personal Knowledge, Timeline, and
   Other. It also removes filler language and returns speaker, claim, citation, and
   confidence fields for review.

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
   Overview, Witness Profile, Claims, Contradictions, Cross Examination, and Report.
   The Witness Profile tab includes an export button that adds the profile to the
   downloadable final report.

## Working Vertical Slice

The app runs this flow:

```text
Transcript text
  -> TranscriptIngestor
  -> Optional PDF text extraction and cleanup
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

## Input Options

DepositionIQ supports two transcript input modes:

- **Raw text:** Paste transcript text directly into the app. This is the fastest path
  for demos and works best when transcript turns use `Q:` and `A:` prefixes.
- **PDF upload:** Upload one or more deposition PDFs. The app first extracts embedded
  text with `pypdf`; when a PDF has no selectable text, it falls back to local macOS
  Vision OCR if available. It then cleans line breaks, normalizes `Q:` / `A:` turns,
  and displays the extracted text for review before analysis.

OCR fallback currently targets macOS via the built-in Vision framework and Swift.
On non-macOS systems, image-only PDFs should be OCR'd externally first, then uploaded
as OCR-enhanced PDFs or pasted as extracted text.

## Data Structures

Claims are represented as dictionaries like:

```python
{
    "id": "C001",
    "segment_id": "S002",
    "speaker": "Witness",
    "claim": "The witness deleted email messages relating to DR DOS.",
    "citation": "Lines 95-98",
    "topic": "DR DOS Communications",
    "confidence": 0.96,
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

### Run the Python/Streamlit Prototype

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

Click **Analyze Deposition** to run the sample transcript or paste your own
deposition excerpt using `Q:` and `A:` line prefixes.

To analyze PDFs, choose **PDF upload** in the sidebar, upload one or more text-layer
PDFs, review the extracted text, and click **Analyze Deposition**.

No API key is required for the demo. The backend uses deterministic fallback logic
so the sample transcript produces stable claims, verified contradictions, generated
cross-examination questions, and a downloadable Markdown report.

### Run Backend Validation Examples

DepositionIQ includes a lightweight backend validation suite in `examples/`. This is
not formal benchmarking; it is a quick evidence check showing that the deterministic
pipeline works on clean, obvious, and subtle deposition-style transcripts.

Run:

```bash
python scripts/validate_backend.py
```

The script runs the backend pipeline on:

- `examples/clean_no_contradiction.txt`
- `examples/obvious_contradiction.txt`
- `examples/subtle_contradiction.txt`

For each transcript it prints:

- number of claims extracted,
- number of contradictions found,
- contradiction summaries,
- citations used,
- generated cross-examination questions.

Expected interpretation notes are documented in
`examples/expected_findings.md`.

### Run the Next.js Frontend Prototype

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

The frontend does not require backend services yet. It renders realistic sample
claims, contradictions, witness intelligence, attorney attention levels, and report
content from `frontend/lib/mock-analysis.ts`.

## Error Handling

The app validates transcript input before analysis:

- Empty input produces a user-facing error.
- Input without witness answers marked by `A:` produces a user-facing error.
- PDFs without selectable text use macOS Vision OCR when available, otherwise they
  produce a user-facing OCR guidance message.
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
