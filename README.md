# DepositionIQ

DepositionIQ is a prototype legal AI system for analyzing deposition transcripts.
It addresses a common litigation-review problem: deposition transcripts can be
long, repetitive, and difficult to convert quickly into attorney-useful issues.
DepositionIQ turns testimony into structured claims, links those claims back to
citations, identifies candidate contradictions, and drafts cross-examination
strategy for attorney review.

Core workflow:

```text
Deposition testimony
  -> Structured claims
  -> Citation-backed evidence
  -> Candidate contradictions
  -> Cross-examination strategy
  -> Downloadable report
```

The prototype supports pasted text transcripts, PDF transcript ingestion with OCR
fallback, and experimental audio upload with local/server-side transcription.

This repository currently contains two complementary project tracks:

1. **Python/Streamlit prototype backend** in `app.py` and `src/`
   This is the working vertical slice. It runs end-to-end without model training or
   an API key by using deterministic, explainable fallback rules for claim
   extraction, contradiction detection, verification, cross-examination planning,
   witness profiling, PDF extraction, OCR fallback, and report generation.
2. **Next.js polished frontend prototype** in `frontend/`
   This is a YC-demo-ready interface concept built with Next.js, TypeScript,
   Tailwind CSS, shadcn-style components, lucide-react icons, and framer-motion.
   It can call the FastAPI backend for live analysis and preserves realistic mock
   outputs from `frontend/lib/mock-analysis.ts` as a fallback when the backend is
   unavailable.

## Features

- Paste transcript text directly into the Streamlit interface.
- Upload one or more PDF deposition transcripts, including OCR fallback for
  image-only PDFs when supported locally.
- Review and edit cleaned PDF-extracted text before running analysis.
- Optionally upload deposition audio for experimental local/server-side
  transcription, then analyze the transcript through the same pipeline.
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
├── api.py
├── examples
│   ├── clean_no_contradiction.txt
│   ├── obvious_contradiction.txt
│   ├── subtle_contradiction.txt
│   └── expected_findings.md
├── frontend
│   ├── app
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── demo/page.tsx
│   │   ├── evidence-review/page.tsx
│   │   ├── product/page.tsx
│   │   └── security/page.tsx
│   ├── components
│   │   ├── agent-trace.tsx
│   │   ├── claim-table.tsx
│   │   ├── contradiction-card.tsx
│   │   ├── dashboard.tsx
│   │   ├── evidence-viewer.tsx
│   │   ├── hero.tsx
│   │   ├── metric-card.tsx
│   │   ├── report-panel.tsx
│   │   ├── sidebar.tsx
│   │   ├── witness-context-panel.tsx
│   │   ├── witness-profile.tsx
│   │   └── ui
│   ├── lib
│   │   ├── analysis-api.ts
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
    ├── audio_transcriber.py
    ├── apple_vision_ocr.swift
    ├── case_summary.py
    ├── ingest.py
    ├── pipeline.py
    ├── segment.py
    ├── claim_extractor.py
    ├── contradiction_detector.py
    ├── verifier.py
    ├── witness_profile.py
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
- `api.py`: FastAPI service exposing the shared pipeline at `POST /analyze` and
  experimental audio upload at `POST /transcribe-analyze`.
- `src/`: Modular legal reasoning pipeline.
- `src/audio_transcriber.py`: Optional local audio transcription helper.
- `src/pipeline.py`: Shared orchestration used by Streamlit and FastAPI.
- `samples/`: Sample transcript and sample output.

### Next.js Frontend Prototype

The frontend prototype is a polished product interface for DepositionIQ. It includes
separate routes for the landing page, product explanation, evidence review,
security posture, and the functional demo workspace. The `/demo` route contains
the working dashboard with transcript input, optional audio upload, metrics,
claims, contradictions, evidence viewer, cross-examination strategy, witness
profile, and report export.

Primary files:

- `frontend/app/page.tsx`: Landing page.
- `frontend/app/demo/page.tsx`: Functional product workspace for the CS153 demo.
- `frontend/app/product/page.tsx`: Product/workflow explanation.
- `frontend/app/evidence-review/page.tsx`: Evidence and contradiction review page.
- `frontend/app/security/page.tsx`: Security and demo-safety posture page.
- `frontend/components/`: Reusable UI components.
- `frontend/lib/analysis-api.ts`: Client-side FastAPI adapter with mock fallback.
- `frontend/lib/mock-analysis.ts`: Realistic sample DepositionIQ outputs used by
  the UI when the backend API is unavailable or demo mode is needed.

The frontend can call the Python FastAPI backend for live analysis. It preserves the
mock data as a fallback so the UI remains usable if the backend is not running.

## System Architecture

DepositionIQ uses a modular frontend/backend architecture. The Streamlit app and
FastAPI service both call the same shared Python pipeline, while the Next.js demo
interface can either call FastAPI for live analysis or fall back to realistic mock
outputs for presentation safety.

```text
User input
  ├─ Text transcript
  ├─ PDF transcript -> pypdf text extraction -> macOS Vision OCR fallback
  └─ Audio upload -> optional local Whisper/faster-whisper transcription

Frontend
  ├─ Streamlit prototype: app.py
  └─ Next.js demo UI: frontend/

Backend API
  └─ FastAPI: api.py
       ├─ GET /health
       ├─ POST /analyze
       └─ POST /transcribe-analyze

Shared pipeline: src/pipeline.py
  -> Ingestion
  -> Segmentation
  -> Claim extraction
  -> Contradiction detection
  -> Evidence/citation verification
  -> Cross-exam generation
  -> Witness profile and report export
```

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
   Produces downloadable Markdown output with claims, contradictions, questions,
   citations, and review caveats.

8. **Streamlit UI (`app.py`)**
   Orchestrates the pipeline and presents results in six tabs:
   Overview, Witness Profile, Claims, Contradictions, Cross Examination, and Report.
   The Witness Profile tab includes an export button that adds the profile to the
   downloadable final report.

9. **Next.js UI (`frontend/`)**
    Provides the polished CS153 demo interface with landing, product, security,
    evidence review, and demo routes. The `/demo` route sends transcript text to
    FastAPI, displays live backend status, and renders claims, contradictions,
    evidence, cross-examination strategy, and report export.

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

DepositionIQ supports three transcript input modes:

- **Raw text:** Paste transcript text directly into the app. This is the fastest path
  for demos and works best when transcript turns use `Q:` and `A:` prefixes.
- **PDF upload:** Upload one or more deposition PDFs. The app first extracts embedded
  text with `pypdf`; when a PDF has no selectable text, it falls back to local macOS
  Vision OCR if available. It then cleans line breaks, normalizes `Q:` / `A:` turns,
  and displays the extracted text for review before analysis.
- **Experimental audio upload:** Upload `.mp3`, `.wav`, `.m4a`, or compatible `.mp4`
  audio to `POST /transcribe-analyze`. The backend transcribes the recording locally
  or server-side when optional transcription dependencies are installed, then runs
  the same analysis pipeline.

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

- Number of claims extracted.
- Number of contradictions found.
- Contradiction summaries.
- Citations used.
- Generated cross-examination questions.

Expected interpretation notes are documented in
`examples/expected_findings.md`.

### Run the FastAPI Backend API

The FastAPI service wraps the same shared backend pipeline used by Streamlit.

From the repository root, with Python dependencies installed:

```bash
uvicorn api:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

Analyze transcript text:

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"transcript_text":"Q: What time did you arrive?\nA: I arrived at 9:00 a.m.\nQ: When did you actually arrive?\nA: I did not arrive until 10:30 a.m."}'
```

The response includes `transcript_id`, `claims`, `contradictions`,
`cross_exam_questions`, `witness_profile`, `case_summary`, and
`report_markdown`.

### Experimental Audio Transcription

DepositionIQ includes an optional audio-to-transcript path for demo exploration.
The primary and recommended CS153 demo path remains pasted transcript text because
it is deterministic and stable. Audio upload is experimental.

Supported upload types:

- `.mp3`
- `.wav`
- `.m4a`
- `.mp4` audio, when the local transcription backend can decode it

The FastAPI endpoint is:

```text
POST /transcribe-analyze
```

It accepts a multipart field named `audio_file`, transcribes the audio locally or
server-side, then sends the transcript through the same `run_pipeline(...)` flow as
`POST /analyze`. The response includes `transcript_text` plus the normal analysis
fields: `transcript_id`, `claims`, `contradictions`, `cross_exam_questions`,
`witness_profile`, `case_summary`, and `report_markdown`.

Install one optional local transcription dependency to enable the feature:

```bash
pip install faster-whisper
```

or:

```bash
pip install openai-whisper
```

The implementation uses CPU-friendly defaults and does not require a GPU or cloud
API key. If neither optional dependency is installed, `/transcribe-analyze` returns
a clear error:

```text
Audio transcription is not installed. Install optional audio dependencies or use pasted transcript text.
```

Example request:

```bash
curl -X POST http://localhost:8000/transcribe-analyze \
  -F "audio_file=@/path/to/deposition_audio.wav"
```

Limitations:

- Transcription quality depends on recording clarity and speaker overlap.
- Large files may take time on CPU.
- The audio path is hidden behind an experimental upload section in the Next.js
  `/demo` workspace so the main pasted transcript demo remains reliable.

### Run the Next.js Frontend Prototype

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

For live analysis, run the FastAPI backend on `http://localhost:8000` in another
terminal. The Next.js dashboard sends pasted transcript text to `POST /analyze` and
updates claims, contradictions, cross-exam questions, witness profile metrics, and
the downloadable report from the backend response.

To point the frontend at a different backend URL:

```bash
NEXT_PUBLIC_DEPOSITIONIQ_API_URL=http://localhost:8000 npm run dev
```

If the backend is unavailable, the frontend automatically falls back to the
realistic mock data in `frontend/lib/mock-analysis.ts`.

The `/demo` workspace also includes an **Experimental audio upload** panel. After
uploading audio, the frontend calls `POST /transcribe-analyze`, fills the editable
transcript box with the returned `transcript_text`, and renders the same live
claims, contradictions, evidence, cross-exam strategy, and report output used by
pasted transcripts.

## Error Handling

The app validates transcript input before analysis:

- Empty input produces a user-facing error.
- Input without witness answers marked by `A:` produces a user-facing error.
- PDFs without selectable text use macOS Vision OCR when available, otherwise they
  produce a user-facing OCR guidance message.
- Audio uploads return a user-facing message if the file type is unsupported or
  optional transcription dependencies are not installed.
- Unexpected pipeline failures are displayed in Streamlit with exception details for
  debugging.

## Evaluation & Testing

DepositionIQ is evaluated at the prototype level rather than through a formal
benchmark. The current checks are designed to show that the end-to-end demo works
on representative transcript inputs and that outputs remain citation-grounded.

Validated workflows:

- Text transcript workflow tested through Streamlit, FastAPI `POST /analyze`, and
  the Next.js `/demo` workspace.
- PDF ingestion workflow tested for text-layer PDFs and image-only PDFs using the
  macOS Vision OCR fallback path when available.
- Audio upload/transcription workflow tested through `POST /transcribe-analyze`
  with optional local transcription dependencies.
- Backend validation script tested on clean, obvious-contradiction, and
  subtle-contradiction examples in `examples/`.
- Contradiction detection examples include arrival-time inconsistencies,
  preservation/deletion inconsistencies, and memory/recall inconsistencies.
- Citation/evidence linking checks confirm that claims and contradictions retain
  line references or transcript citations when available.
- Cross-examination generation checks confirm that questions are tied to detected
  issues and source claims.

These checks provide evidence that the system is functional for a CS153 prototype.
They are not a substitute for a legal accuracy benchmark, attorney validation, or
production QA.

### Validation Checklist

Before demos or submissions, verify:

```bash
curl http://localhost:8000/health
```

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"transcript_text":"Q: What time did you arrive?\nA: I arrived at 9:00 a.m.\nQ: When did you actually arrive?\nA: I did not arrive until 10:30 a.m."}'
```

For audio dependency fallback behavior, start FastAPI without installing
`faster-whisper` or `openai-whisper`, then call:

```bash
curl -X POST http://localhost:8000/transcribe-analyze \
  -F "audio_file=@/path/to/sample.wav"
```

Expected result: a clear message explaining that optional audio dependencies are
not installed.

Also run:

```bash
python scripts/validate_backend.py
cd frontend
npm run typecheck
npm run build
```

## Development Notes

This repository intentionally uses deterministic implementations so the system is easy
to understand and extend. Recommended next steps:

- Replace heuristic claim extraction with an LLM-backed extractor.
- Add transcript file upload for PDF, TXT, and DOCX transcripts.
- Store segment offsets for precise legal citations.
- Add exhibit ingestion and retrieval-augmented verification.
- Add tests for each pipeline stage.
- Add prompt templates and schema validation for model outputs.

## Limitations

- DepositionIQ is a prototype system built for research and educational use.
- Contradictions are candidate review issues, not legal conclusions.
- Outputs require attorney review before they are used in litigation strategy.
- Results depend on transcript quality, formatting, and speaker labeling.
- OCR quality may vary for scanned PDFs, handwritten notes, poor scans, or unusual
  transcript layouts.
- Audio transcription quality may vary with recording clarity, speaker overlap,
  accents, background noise, and microphone quality.
- The current contradiction logic is deterministic and heuristic where applicable;
  it is designed for explainable demo behavior rather than exhaustive legal review.
- The system is not legal advice and is not production-ready.

## AI Usage Disclosure

This project was developed with AI-assisted coding tools, including OpenAI Codex
and ChatGPT.

These tools were used during development for:

- Frontend development.
- Backend scaffolding.
- Debugging.
- Refactoring.
- Documentation.
- UI iteration.
- Test generation.

The project concept, legal workflow design, system architecture, contradiction
detection workflow, feature selection, evaluation design, and final product
decisions were directed by the author. AI-generated code was reviewed, tested,
modified, and integrated into the final system by the author.

## External References / Examples Reviewed

The README does not rely on named external legal technology products or
organizations for claims about functionality, testing, or validation. Product
inspiration and comparisons, where discussed in development, are not required to
run or evaluate this repository.

## Legal Disclaimer

DepositionIQ is a research and educational scaffold. It is not legal advice and
should not be used for legal strategy without qualified attorney review.
