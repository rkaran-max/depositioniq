"""Evidence and contradiction verification for DepositionIQ."""

from __future__ import annotations


class EvidenceVerifier:
    """Check whether claims and contradictions are grounded in transcript evidence."""

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

    def verify_contradictions(
        self, contradictions: list[dict], claims: list[dict]
    ) -> list[dict]:
        """Verify contradiction candidates against claim evidence and shared context."""
        claim_lookup = {claim["id"]: claim for claim in claims}
        verified: list[dict] = []

        for contradiction in contradictions:
            linked_claims = [
                claim_lookup[claim_id]
                for claim_id in contradiction["claim_ids"]
                if claim_id in claim_lookup
            ]
            statuses = {claim.get("verification_status") for claim in linked_claims}
            polarities = {claim.get("polarity") for claim in linked_claims}
            same_context = len({claim.get("entity") for claim in linked_claims}) == 1

            is_verified = (
                len(linked_claims) == 2
                and statuses == {"supported"}
                and len(polarities) > 1
                and same_context
            )
            verified.append(
                {
                    **contradiction,
                    "status": "verified" if is_verified else "needs_review",
                    "verification_score": 0.91 if is_verified else 0.58,
                    "verification_notes": (
                        "Both claims are transcript-supported, share the same entity, "
                        "and express opposing polarity."
                        if is_verified
                        else "The candidate needs attorney review because support or polarity is incomplete."
                    ),
                }
            )

        return verified
