# Expected Backend Validation Findings

These examples are lightweight validation fixtures, not formal benchmarks. They are
designed to show that the deterministic DepositionIQ backend can extract claims,
surface contradiction candidates, preserve citations, and generate cross-examination
questions on small deposition-style transcripts.

## clean_no_contradiction.txt

Expected behavior:

- Extract several structured witness claims.
- Detect no direct contradiction.
- Generate a fallback foundation question because there are claims but no conflicts.
- Preserve line citations for the extracted claims.

## obvious_contradiction.txt

Expected behavior:

- Extract claims about DR DOS email deletion and preservation.
- Detect a direct conflict between:
  - the witness saying they deleted DR DOS email, and
  - the witness later saying they did not delete DR DOS email.
- Generate cross-examination questions that ask the witness to reconcile the two
  answers and identify confirming documents or logs.

## subtle_contradiction.txt

Expected behavior:

- Extract claims about DR DOS communications with Dana.
- Flag a communication/memory tension where the witness first states that email was
  sent, then later uses low-certainty recall language about the same communication.
- Generate cross-examination questions focused on separating lack of recollection
  from nonexistence of a communication record.

## Interpretation Notes

The current backend uses deterministic fallback logic. Counts may change as the
heuristics improve, but validation output should continue to show:

- claim extraction for all three examples,
- zero or near-zero contradictions for the clean example,
- at least one contradiction candidate for the obvious example,
- at least one low-certainty or needs-review issue for the subtle example,
- citations and cross-examination questions for contradiction-bearing examples.
