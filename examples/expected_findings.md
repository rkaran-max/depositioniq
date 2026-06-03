# Expected Backend Validation Findings

These examples are lightweight validation fixtures, not formal benchmarks. They are
designed to show that the deterministic DepositionIQ backend can extract claims,
surface contradiction candidates, preserve citations, and generate cross-examination
questions on small deposition-style transcripts.

## clean_no_contradiction.txt

Expected behavior:

- Extract several structured witness claims about arrival, preservation, and records.
- Detect no direct contradiction.
- Generate a fallback foundation question because there are claims but no conflicts.
- Preserve line citations for the extracted claims.

## obvious_contradiction.txt

Expected behavior:

- Extract claims about arrival at a product review meeting.
- Detect a direct arrival-time conflict between:
  - the witness saying they arrived or were present at 9:00 a.m., and
  - the witness later saying they did not arrive until 10:30 a.m.
- Generate cross-examination questions that ask the witness to reconcile the two
  answers and identify objective records such as calendars or badge logs.

## subtle_contradiction.txt

Expected behavior:

- Extract claims about email preservation, deletion, and communications with Dana.
- Detect a preservation/deletion inconsistency where the witness says emails were
  preserved but also says related emails were deleted after reading.
- Flag a communication/memory tension where the witness first states that emails
  were sent, then later uses low-certainty recall language about the same communication.
- Generate cross-examination questions focused on preservation practice, deletion,
  and separating lack of recollection from nonexistence of a communication record.

## Interpretation Notes

The current backend uses deterministic fallback logic. Counts may change as the
heuristics improve, but validation output should continue to show:

- claim extraction for all three examples,
- zero or near-zero contradictions for the clean example,
- at least one contradiction candidate for the obvious example,
- at least one low-certainty or needs-review issue for the subtle example,
- citations and cross-examination questions for contradiction-bearing examples.
