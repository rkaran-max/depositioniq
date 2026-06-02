"""Evidence verification placeholders."""

from __future__ import annotations


class EvidenceVerifier:
    """Check whether extracted claims are grounded in transcript evidence."""

    def verify(self, claims: list[dict], transcript_text: str) -> list[dict]:
        """Attach placeholder verification status to each claim."""
        verified_claims: list[dict] = []

        for claim in claims:
            status = "supported" if claim["text"] in transcript_text else "needs_review"
            verified_claim = {
                **claim,
                "verification_status": status,
                "verification_notes": (
                    "Direct text match found in transcript."
                    if status == "supported"
                    else "Claim should be reviewed against source context."
                ),
            }
            verified_claims.append(verified_claim)

        return verified_claims
