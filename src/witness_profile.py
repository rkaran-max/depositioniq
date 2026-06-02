"""Witness profile generation for litigation intelligence review."""

from __future__ import annotations


class WitnessProfileGenerator:
    """Generate a first-pass litigation memo profile from analyzed testimony."""

    def generate(
        self,
        case_summary: dict,
        claims: list[dict],
        contradictions: list[dict],
        questions: list[dict],
        segments: list[dict],
    ) -> dict:
        """Build a witness profile using all extracted claims and verification output."""
        risk = self._contradiction_risk(contradictions, claims)
        key_topics = self._key_topics(claims, case_summary)
        important_claims = self._important_claims(claims)
        vulnerabilities = self._vulnerabilities(claims, contradictions, key_topics)
        strengths = self._strengths(claims, contradictions)
        citations = self._supporting_citations(claims, contradictions)

        return {
            "name": case_summary.get("witness") or "Unknown witness",
            "overview": self._overview(
                case_summary.get("witness") or "Unknown witness",
                claims,
                contradictions,
                risk,
                key_topics,
            ),
            "key_topics": key_topics,
            "important_claims": important_claims,
            "potential_vulnerabilities": vulnerabilities,
            "potential_strengths": strengths,
            "contradiction_risk": risk,
            "cross_examination_targets": self._cross_examination_targets(
                claims, contradictions, key_topics
            ),
            "suggested_follow_up_questions": self._suggested_questions(
                questions, vulnerabilities, key_topics
            ),
            "supporting_citations": citations,
            "transcript_excerpts": self._transcript_excerpts(segments),
        }

    def _overview(
        self,
        witness: str,
        claims: list[dict],
        contradictions: list[dict],
        risk: str,
        key_topics: list[str],
    ) -> str:
        """Create a professional 2-4 sentence litigation overview."""
        topic_text = ", ".join(key_topics[:3]) if key_topics else "the reviewed testimony"
        supported_count = sum(1 for claim in claims if claim.get("verification_status") == "supported")
        verified_count = sum(1 for item in contradictions if item.get("status") == "verified")

        sentences = [
            f"{witness} provided testimony principally concerning {topic_text}.",
            (
                f"The analysis identified {len(claims)} extracted claims, "
                f"{supported_count} of which are grounded in transcript text."
            ),
        ]
        if contradictions:
            sentences.append(
                f"The contradiction risk is assessed as {risk} based on "
                f"{verified_count} verified contradiction candidate(s) and related testimony patterns."
            )
        else:
            sentences.append(
                f"The contradiction risk is assessed as {risk}; this is an analytical inference from the current transcript excerpt, not a legal conclusion."
            )
        sentences.append(
            "The profile distinguishes transcript-supported facts from inferred follow-up priorities for attorney review."
        )
        return " ".join(sentences)

    def _key_topics(self, claims: list[dict], case_summary: dict) -> list[str]:
        """Rank legal topics by frequency while preserving review relevance."""
        summary_topics = case_summary.get("key_themes") or []
        if summary_topics:
            return summary_topics[:5]

        counts: dict[str, int] = {}
        for claim in claims:
            counts[claim["topic"]] = counts.get(claim["topic"], 0) + 1
        ranked = sorted(counts, key=lambda topic: (-counts[topic], topic))
        return ranked[:5] or ["Other"]

    def _important_claims(self, claims: list[dict]) -> list[str]:
        """Select the most useful claims for a first-pass witness profile."""
        sorted_claims = sorted(
            claims,
            key=lambda claim: (
                claim.get("verification_status") != "supported",
                -claim.get("confidence", 0),
                claim.get("line_number", 0),
            ),
        )
        return [
            f"{claim['claim']} ({claim['citation']})"
            for claim in sorted_claims[:5]
        ]

    def _vulnerabilities(
        self,
        claims: list[dict],
        contradictions: list[dict],
        key_topics: list[str],
    ) -> list[str]:
        """Identify potential examination vulnerabilities without legal conclusions."""
        vulnerabilities: list[str] = []
        lowered_topics = " ".join(key_topics).lower()
        if any(claim.get("certainty") == "low" for claim in claims):
            vulnerabilities.append("Memory gaps or limited recollection on material topics")
        if any("Timeline" == topic for topic in key_topics) or "timeline" in lowered_topics:
            vulnerabilities.append("Timeline inconsistencies or chronology gaps")
        if (
            any(topic in key_topics for topic in ["Email Retention", "Document Preservation"])
            or "retention" in lowered_topics
            or "document" in lowered_topics
            or "deletion" in lowered_topics
        ):
            vulnerabilities.append("Document retention and preservation issues")
        if contradictions:
            vulnerabilities.append("Credibility concerns from inconsistent testimony candidates")
        if not vulnerabilities:
            vulnerabilities.append("No major vulnerability detected in the current excerpt")
        return vulnerabilities[:5]

    def _strengths(self, claims: list[dict], contradictions: list[dict]) -> list[str]:
        """Identify areas that may support the witness's testimony."""
        strengths: list[str] = []
        supported = [claim for claim in claims if claim.get("verification_status") == "supported"]
        if supported:
            strengths.append("Most extracted claims have direct transcript support")
        if not contradictions:
            strengths.append("Limited contradiction exposure in the reviewed excerpt")
        if any(claim.get("confidence", 0) >= 0.9 for claim in supported):
            strengths.append("Several claims have strong factual support and clear citations")
        if not strengths:
            strengths.append("Strengths require further review against the full record")
        return strengths[:4]

    def _contradiction_risk(self, contradictions: list[dict], claims: list[dict]) -> str:
        """Score contradiction risk as Low, Medium, or High."""
        verified = [item for item in contradictions if item.get("status") == "verified"]
        high = [item for item in verified if item.get("severity") == "high"]
        low_certainty = [claim for claim in claims if claim.get("certainty") == "low"]
        if len(high) >= 2 or len(verified) >= 3:
            return "High"
        if high or verified or contradictions or len(low_certainty) >= 2:
            return "Medium"
        return "Low"

    def _cross_examination_targets(
        self,
        claims: list[dict],
        contradictions: list[dict],
        key_topics: list[str],
    ) -> list[str]:
        """Generate ranked cross-examination target areas."""
        targets: list[str] = []
        lowered_topics = " ".join(key_topics).lower()
        for contradiction in contradictions[:3]:
            targets.append(
                f"Reconcile {contradiction['topic']} testimony about {contradiction['entity']}"
            )
        if "email" in lowered_topics or "retention" in lowered_topics or "deletion" in lowered_topics:
            targets.append("Clarify email deletion and retention practices")
        if "dr dos" in lowered_topics:
            targets.append("Establish timeline and scope of DR DOS communications")
        if "document" in lowered_topics or "preservation" in lowered_topics:
            targets.append("Test preservation practices and recordkeeping basis")
        if not targets and claims:
            targets.append("Confirm basis and source support for the most important claims")
        return list(dict.fromkeys(targets))[:3]

    def _suggested_questions(
        self,
        questions: list[dict],
        vulnerabilities: list[str],
        key_topics: list[str],
    ) -> list[str]:
        """Generate follow-up questions using cross-exam output and inferred gaps."""
        suggested = [question["question"] for question in questions[:3]]
        lowered_topics = " ".join(key_topics).lower()
        if len(suggested) < 3 and ("email" in lowered_topics or "retention" in lowered_topics):
            suggested.append("What policy governed whether you preserved or deleted email messages?")
        if len(suggested) < 3 and "dr dos" in lowered_topics:
            suggested.append("What records would show the timing and recipients of DR DOS communications?")
        if len(suggested) < 3 and vulnerabilities:
            suggested.append("What documents would refresh your recollection on the areas you could not recall?")
        return suggested[:3]

    def _supporting_citations(
        self,
        claims: list[dict],
        contradictions: list[dict],
    ) -> list[str]:
        """Collect transcript citations that support the profile."""
        citations: list[str] = []
        for claim in claims[:6]:
            citations.append(f"{claim['citation']}: {claim['claim']}")
        for contradiction in contradictions[:3]:
            for evidence in contradiction.get("evidence", []):
                citations.append(evidence)
        return list(dict.fromkeys(citations))[:8]

    def _transcript_excerpts(self, segments: list[dict]) -> list[str]:
        """Provide short source excerpts for reviewer orientation."""
        excerpts: list[str] = []
        for segment in segments:
            if segment["speaker"] == "Witness" and segment["text"]:
                citation = (
                    f"Line {segment['line_number']}"
                    if segment["line_number"] == segment.get("end_line_number", segment["line_number"])
                    else f"Lines {segment['line_number']}-{segment.get('end_line_number')}"
                )
                excerpts.append(f"{citation}: {segment['text']}")
            if len(excerpts) == 3:
                break
        return excerpts
