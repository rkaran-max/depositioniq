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

## Notes

This frontend uses realistic mock data based on a Bill Gates deposition excerpt
covering email retention, document preservation, DR DOS communications,
contradiction risk, and cross-examination targets.

The fixture data lives in `frontend/lib/mock-analysis.ts`. Until backend
integration is added, update that file to change the sample claims,
contradictions, witness profile, metrics, and transcript text displayed by the UI.
