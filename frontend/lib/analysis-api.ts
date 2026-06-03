import type {
  AgentTraceEvent,
  Claim,
  ClaimRelationshipEdge,
  ClaimRelationshipNode,
  Contradiction,
  CrossExamCard,
  EvidenceTrace,
  MetricTone,
  PipelineStage,
  TranscriptEvidence,
} from "@/lib/mock-analysis";
import * as mock from "@/lib/mock-analysis";

type Risk = "Low" | "Medium" | "High";

type BackendClaim = {
  id: string;
  claim: string;
  topic: string;
  certainty: string;
  confidence: number;
  citation: string;
  text: string;
  evidence?: string;
};

type BackendContradiction = {
  id: string;
  topic: string;
  entity: string;
  severity: string;
  status: string;
  summary: string;
  description?: string;
  reasoning?: string;
  evidence?: string[];
  claim_ids?: string[];
};

type BackendQuestion = {
  id: string;
  theme: string;
  question: string;
  purpose: string;
  related_contradiction_id?: string | null;
  source_claim_ids?: string[];
};

type BackendWitnessProfile = {
  name: string;
  overview: string;
  key_topics: string[];
  potential_vulnerabilities: string[];
  potential_strengths: string[];
  contradiction_risk: Risk;
};

type BackendAnalysisResponse = {
  transcript_id: string;
  claims: BackendClaim[];
  contradictions: BackendContradiction[];
  cross_exam_questions: BackendQuestion[];
  witness_profile: BackendWitnessProfile;
  case_summary: {
    witness: string;
    key_themes: string[];
    notable_testimony: string[];
    follow_up_areas: string[];
  };
  report_markdown: string;
};

export type DashboardAnalysisState = {
  sourceMode: "mock" | "api";
  statusLabel: string;
  transcriptId?: string;
  sampleTranscript: string;
  depositionMetrics: Array<{
    label: string;
    value: string;
    detail: string;
    tone: MetricTone;
  }>;
  pipelineStages: PipelineStage[];
  agentTrace: AgentTraceEvent[];
  claims: Claim[];
  contradictions: Contradiction[];
  strategyCards: CrossExamCard[];
  claimRelationshipNodes: ClaimRelationshipNode[];
  claimRelationshipEdges: ClaimRelationshipEdge[];
  evidenceTrace: EvidenceTrace[];
  transcriptEvidence: TranscriptEvidence[];
  lawyerWorkflow: typeof mock.lawyerWorkflow;
  reportArtifacts: typeof mock.reportArtifacts;
  witnessProfile: {
    name: string;
    overview: string;
    topics: string[];
    vulnerabilities: string[];
    strengths: string[];
    risk: Risk;
  };
  reportMarkdown: string;
};

const API_URL = process.env.NEXT_PUBLIC_DEPOSITIONIQ_API_URL ?? "http://localhost:8000";

export function createMockAnalysisState(): DashboardAnalysisState {
  return {
    sourceMode: "mock",
    statusLabel: "demo.fallback",
    sampleTranscript: mock.sampleTranscript,
    depositionMetrics: mock.depositionMetrics,
    pipelineStages: mock.pipelineStages,
    agentTrace: mock.agentTrace,
    claims: mock.claims,
    contradictions: mock.contradictions,
    strategyCards: mock.strategyCards,
    claimRelationshipNodes: mock.claimRelationshipNodes,
    claimRelationshipEdges: mock.claimRelationshipEdges,
    evidenceTrace: mock.evidenceTrace,
    transcriptEvidence: mock.transcriptEvidence,
    lawyerWorkflow: mock.lawyerWorkflow,
    reportArtifacts: mock.reportArtifacts,
    witnessProfile: mock.witnessProfile,
    reportMarkdown: "# DepositionIQ Demo Report\n\nStart the FastAPI backend to export a live analysis report.",
  };
}

export async function analyzeTranscript(transcriptText: string): Promise<DashboardAnalysisState> {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript_text: transcriptText }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Analysis request failed with ${response.status}`);
  }

  const payload = (await response.json()) as BackendAnalysisResponse;
  return normalizeBackendAnalysis(payload, transcriptText);
}

function normalizeBackendAnalysis(
  payload: BackendAnalysisResponse,
  transcriptText: string,
): DashboardAnalysisState {
  const claims = payload.claims.map((claim): Claim => ({
    id: claim.id,
    claim: claim.claim,
    topic: claim.topic,
    certainty: titleCase(claim.certainty),
    confidence: `${Math.round(claim.confidence * 100)}%`,
    citation: claim.citation,
  }));

  const claimLookup = new Map(payload.claims.map((claim) => [claim.id, claim]));
  const contradictions = payload.contradictions.map((item): Contradiction => {
    const linkedClaims = (item.claim_ids ?? [])
      .map((claimId) => claimLookup.get(claimId))
      .filter((claim): claim is BackendClaim => Boolean(claim));
    const citations = unique(linkedClaims.map((claim) => claim.citation));
    return {
      severity: normalizeRisk(item.severity),
      title: item.summary,
      summary: item.description || item.reasoning || item.summary,
      citations,
      verified: item.status === "verified",
      whyItMatters:
        item.description ||
        "This issue should be reviewed against the linked transcript excerpts before examination.",
      linkedEvidence: linkedClaims.map((claim) => claim.id),
      objective: `Test ${item.entity || item.topic} testimony against the cited record.`,
    };
  });

  const strategyCards = buildStrategyCards(payload.cross_exam_questions, payload.contradictions);
  const evidenceTrace = payload.claims.slice(0, 6).map((claim): EvidenceTrace => ({
    id: claim.id,
    source: claim.citation,
    signal: signalFromTopic(claim.topic),
    excerpt: claim.text,
    confidence: `${Math.round(claim.confidence * 100)}%`,
  }));
  const transcriptEvidence = payload.claims.slice(0, 6).map((claim): TranscriptEvidence => {
    const related = payload.contradictions.find((item) =>
      item.claim_ids?.includes(claim.id),
    );
    return {
      id: claim.id,
      citation: claim.citation,
      text: claim.evidence || `${claim.citation}: ${claim.text}`,
      highlights: [claim.text],
      extractedClaim: claim.claim,
      relatedContradiction: related?.summary,
      crossExamRelevance: related ? normalizeRisk(related.severity) : "Low",
    };
  });

  const topicCounts = countBy(payload.claims.map((claim) => claim.topic));
  const topicContradictions = countBy(payload.contradictions.map((item) => item.topic));
  const claimRelationshipNodes = Object.entries(topicCounts).map(
    ([topic, count], index): ClaimRelationshipNode => ({
      id: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `topic-${index}`,
      topic,
      claimCount: count,
      risk: topicContradictions[topic] ? "Medium" : "Low",
      linkedContradictions: topicContradictions[topic] ?? 0,
      attorneyUse: topicContradictions[topic]
        ? "Review linked contradictions and prepare follow-up questions."
        : "Confirm claim support and preserve citation context.",
    }),
  );
  const claimRelationshipEdges = payload.contradictions.map(
    (item): ClaimRelationshipEdge => ({
      from: item.topic,
      to: "Cross-Examination Targets",
      relationship: item.status === "verified" ? "requires follow-up" : "linked by citation",
      citations: unique(
        (item.claim_ids ?? [])
          .map((claimId) => claimLookup.get(claimId)?.citation)
          .filter((citation): citation is string => Boolean(citation)),
      ),
    }),
  );

  const verifiedCount = payload.contradictions.filter((item) => item.status === "verified").length;
  const risk = payload.witness_profile.contradiction_risk ?? "Low";

  return {
    sourceMode: "api",
    statusLabel: "backend.connected",
    transcriptId: payload.transcript_id,
    sampleTranscript: transcriptText,
    depositionMetrics: [
      {
        label: "Claims Extracted",
        value: String(payload.claims.length),
        detail: `${claims.filter((claim) => claim.certainty === "High").length} high-certainty`,
        tone: "sky",
      },
      {
        label: "Contradictions Found",
        value: String(payload.contradictions.length),
        detail: `${verifiedCount} verified`,
        tone: "amber",
      },
      {
        label: "Verified Issues",
        value: String(verifiedCount),
        detail: "Transcript-supported",
        tone: "emerald",
      },
      {
        label: "Attorney Attention Level",
        value: risk === "High" ? "High" : risk === "Medium" ? "Moderate" : "Routine",
        detail: `${risk} contradiction risk`,
        tone: risk === "High" ? "rose" : "amber",
      },
    ],
    pipelineStages: [
      { id: "ingest", label: "ingest.transcript", status: "complete", latency: "live", output: payload.transcript_id },
      { id: "segment", label: "segment.testimony", status: "complete", latency: "live", output: "Q/A turns normalized" },
      { id: "extract", label: "extract.claims", status: "complete", latency: "live", output: `${payload.claims.length} structured claims` },
      { id: "verify", label: "verify.conflicts", status: "complete", latency: "live", output: `${payload.contradictions.length} candidates` },
      { id: "generate", label: "generate.cross_exam", status: "complete", latency: "live", output: `${payload.cross_exam_questions.length} prompts` },
    ],
    agentTrace: [
      { time: "api", event: "transcript.ingested", detail: `Analyzed ${payload.transcript_id} through FastAPI.`, status: "ok" },
      { time: "api", event: "claims.extracted", detail: `${payload.claims.length} structured witness claims returned.`, status: "ok" },
      { time: "api", event: "contradiction.verified", detail: `${verifiedCount} verified issue(s) linked to citations.`, status: verifiedCount ? "review" : "ok" },
      { time: "api", event: "cross_exam.generated", detail: `${payload.cross_exam_questions.length} attorney prompts generated.`, status: "ok" },
    ],
    claims,
    contradictions,
    strategyCards,
    claimRelationshipNodes,
    claimRelationshipEdges:
      claimRelationshipEdges.length > 0
        ? claimRelationshipEdges
        : [
            {
              from: "Claims",
              to: "Evidence",
              relationship: "linked by citation",
              citations: payload.claims.slice(0, 3).map((claim) => claim.citation),
            },
          ],
    evidenceTrace,
    transcriptEvidence,
    lawyerWorkflow: mock.lawyerWorkflow,
    reportArtifacts: mock.reportArtifacts,
    witnessProfile: {
      name: payload.witness_profile.name,
      overview: payload.witness_profile.overview,
      topics: payload.witness_profile.key_topics,
      vulnerabilities: payload.witness_profile.potential_vulnerabilities,
      strengths: payload.witness_profile.potential_strengths,
      risk,
    },
    reportMarkdown: payload.report_markdown,
  };
}

function buildStrategyCards(
  questions: BackendQuestion[],
  contradictions: BackendContradiction[],
): CrossExamCard[] {
  if (questions.length === 0) {
    return mock.strategyCards;
  }

  const contradictionLookup = new Map(contradictions.map((item) => [item.id, item]));
  const paired: CrossExamCard[] = [];

  for (let index = 0; index < questions.length; index += 2) {
    const primary = questions[index];
    const followUp = questions[index + 1];
    const contradiction = primary.related_contradiction_id
      ? contradictionLookup.get(primary.related_contradiction_id)
      : undefined;
    paired.push({
      objective: primary.purpose || primary.theme,
      primaryQuestion: primary.question,
      followUpQuestion: followUp?.question ?? "What documents would refresh your recollection?",
      citation: primary.source_claim_ids?.join(", ") || contradiction?.id || "Claim foundation",
      attorneyNote: followUp?.purpose ?? "Use the answer to preserve a clear record for follow-up.",
      risk: contradiction ? normalizeRisk(contradiction.severity) : "Low",
    });
  }

  return paired;
}

function normalizeRisk(value: string): Risk {
  const normalized = titleCase(value);
  if (normalized === "High" || normalized === "Medium" || normalized === "Low") {
    return normalized;
  }
  return "Low";
}

function titleCase(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});
}

function signalFromTopic(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
}
