# DepositionIQ Frontend

Next.js frontend prototype for DepositionIQ, built as a polished legal AI product
surface. The working Python/Streamlit prototype backend remains in the repository
root at `app.py` and `src/`.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- lucide-react icons
- framer-motion

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Connect to the Python Backend

From the repository root, install Python requirements and start the FastAPI API:

```bash
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

Then run the frontend in this directory:

```bash
npm run dev
```

The dashboard sends transcript text to `POST http://localhost:8000/analyze` by
default. To use a different API URL:

```bash
NEXT_PUBLIC_DEPOSITIONIQ_API_URL=http://localhost:8000 npm run dev
```

## Notes

This frontend can render live FastAPI analysis output from the Python backend. It
also preserves realistic mock data based on a Bill Gates deposition excerpt covering
email retention, document preservation, DR DOS communications, contradiction risk,
and cross-examination targets.

The fallback fixture data lives in `frontend/lib/mock-analysis.ts`. The backend
adapter lives in `frontend/lib/analysis-api.ts`.
