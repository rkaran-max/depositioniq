"""Evidence and contradiction verification for DepositionIQ."""

from __future__ import annotations


class EvidenceVerifier:
    """Check whether claims and contradictions are grounded in transcript evidence."""

    def verify(self, claims: list[dict], transcript_text: str) -> list[dict]:
        """Attach placeholder verification status to each claim."""
        verified_claims: list[dict] = []
        normalized_transcript = " ".join(transcript_text.split())

        for claim in claims:
            normalized_claim = " ".join(claim["text"].split())
            status = (
                "supported"
                if normalized_claim in normalized_transcript
                else "needs_review"
            )
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
            same_context = self._same_factual_context(linked_claims)
            contradiction_type = contradiction.get("type")
            supported_pair = len(linked_claims) == 2 and statuses == {"supported"} and same_context
            type_supported = contradiction_type in {
                "arrival_time_conflict",
                "preservation_deletion_conflict",
            }
            memory_supported = (
                contradiction_type == "memory_recall_conflict"
                and "low" in {claim.get("certainty") for claim in linked_claims}
                and any(claim.get("polarity") == "positive" for claim in linked_claims)
            )
            polarity_supported = contradiction_type == "direct_conflict" and len(polarities) > 1

            is_verified = supported_pair and (
                type_supported or memory_supported or polarity_supported
            )
            verified.append(
                {
                    **contradiction,
                    "status": "verified" if is_verified else "needs_review",
                    "verification_score": 0.91 if is_verified else 0.58,
                    "verification_notes": (
                        "Both claims are transcript-supported, share the same factual "
                        "context, and match a contradiction-specific verification rule."
                        if is_verified
                        else "The candidate needs attorney review because support or polarity is incomplete."
                    ),
                }
            )

        return verified

    def _same_factual_context(self, linked_claims: list[dict]) -> bool:
        """Return whether linked claims are close enough for contradiction verification."""
        if len({claim.get("entity") for claim in linked_claims}) == 1:
            return True

        scopes = {claim.get("contradiction_scope") for claim in linked_claims}
        entities = [str(claim.get("entity", "")).lower() for claim in linked_claims]
        if scopes == {"email_preservation_deletion"} and all(
            "email" in entity for entity in entities
        ):
            return True

        return False
