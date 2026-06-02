export type MetricTone = "sky" | "amber" | "emerald" | "rose";

export type Claim = {
  id: string;
  claim: string;
  topic: string;
  certainty: string;
  confidence: string;
  citation: string;
};

export type Contradiction = {
  severity: "High" | "Medium" | "Low";
  title: string;
  summary: string;
  citations: string[];
  verified: boolean;
};

export type PipelineStage = {
  id: string;
  label: string;
  status: "complete" | "active" | "queued";
  latency: string;
  output: string;
};

export type AgentTraceEvent = {
  time: string;
  event: string;
  detail: string;
  status: "ok" | "review" | "warn";
};

export type EvidenceTrace = {
  id: string;
  source: string;
  signal: string;
  excerpt: string;
  confidence: string;
};

export const sampleTranscript =
  "Q: Did you preserve DR DOS-related messages?\nA: I don't preserve most e-mail I receive or send.\n\nQ: Did you delete e-mails relating to DR DOS?\nA: I delete most incoming e-mails after reading them. I cannot recall any specific DR DOS message I deleted.\n\nQ: Were sent messages preserved elsewhere?\nA: I usually did not preserve sent mail unless I copied myself, which was rare.";

export const depositionMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
}> = [
  {
    label: "Claims Extracted",
    value: "18",
    detail: "5 high-value claims",
    tone: "sky",
  },
  {
    label: "Contradictions Found",
    value: "3",
    detail: "1 verified candidate",
    tone: "amber",
  },
  {
    label: "Verified Issues",
    value: "2",
    detail: "Transcript-supported",
    tone: "emerald",
  },
  {
    label: "Attorney Attention Level",
    value: "High",
    detail: "Preservation vector",
    tone: "rose",
  },
];

export const intelligenceSummary = {
  contradictionRisk: "Medium contradiction risk",
  body:
    "Email deletion practices and DR DOS recall should receive focused attorney review before examination.",
  dominantTopics: "Email retention, DR DOS",
  attorneyAttention: "High priority",
};

export const pipelineStages: PipelineStage[] = [
  {
    id: "ingest",
    label: "ingest.transcript",
    status: "complete",
    latency: "241ms",
    output: "94 testimony turns",
  },
  {
    id: "segment",
    label: "segment.testimony",
    status: "complete",
    latency: "118ms",
    output: "Q/A boundaries locked",
  },
  {
    id: "extract",
    label: "extract.claims",
    status: "complete",
    latency: "632ms",
    output: "18 structured claims",
  },
  {
    id: "verify",
    label: "verify.conflicts",
    status: "active",
    latency: "811ms",
    output: "3 contradiction candidates",
  },
  {
    id: "generate",
    label: "generate.cross_exam",
    status: "queued",
    latency: "pending",
    output: "7 attorney prompts",
  },
];

export const agentTrace: AgentTraceEvent[] = [
  {
    time: "00:00.241",
    event: "transcript.ingested",
    detail: "Normalized witness-answer turns and preserved Gates Dep. citation markers.",
    status: "ok",
  },
  {
    time: "00:00.514",
    event: "topic.router",
    detail: "Routed 11 claims into Email Retention, Document Preservation, and DR DOS Communications.",
    status: "ok",
  },
  {
    time: "00:01.049",
    event: "contradiction.scan",
    detail: "Detected tension between broad deletion practice and specific memory disclaimer.",
    status: "review",
  },
  {
    time: "00:01.387",
    event: "evidence.linker",
    detail: "Attached source spans 589:4-15, 589:20-25, and 590:11-22 to verified issue K-001.",
    status: "ok",
  },
  {
    time: "00:01.922",
    event: "risk.model",
    detail: "Preservation vector elevated attorney attention because custodian trail remains unresolved.",
    status: "warn",
  },
];

export const claims: Claim[] = [
  {
    id: "C-001",
    claim:
      "The witness states that most incoming emails were deleted as part of ordinary practice.",
    topic: "Email Retention",
    certainty: "High",
    confidence: "96%",
    citation: "Gates Dep. 589:4-15",
  },
  {
    id: "C-002",
    claim:
      "The witness cannot recall any specific DR DOS message that he deleted or caused to be deleted.",
    topic: "DR DOS Communications",
    certainty: "Medium",
    confidence: "91%",
    citation: "Gates Dep. 589:20-25",
  },
  {
    id: "C-003",
    claim:
      "The witness says he does not preserve most sent emails, except rare self-copy instances.",
    topic: "Document Preservation",
    certainty: "High",
    confidence: "95%",
    citation: "Gates Dep. 590:11-22",
  },
  {
    id: "C-004",
    claim:
      "The witness does not identify a specific custodian source for deleted DR DOS communications.",
    topic: "Personal Knowledge",
    certainty: "Medium",
    confidence: "88%",
    citation: "Gates Dep. 591:2-12",
  },
];

export const contradictions: Contradiction[] = [
  {
    severity: "Medium",
    title: "Memory testimony versus deletion practice",
    summary:
      "The witness describes broad email deletion behavior while disclaiming recall of specific DR DOS messages. The tension is factual and should be tested against retention policy and message logs.",
    citations: ["589:4-15", "589:20-25", "590:8-14"],
    verified: true,
  },
  {
    severity: "Low",
    title: "Sent-email preservation scope",
    summary:
      "The witness indicates sent messages were generally not preserved, with rare exceptions for self-copying. Follow-up should clarify whether that practice applied during the relevant DR DOS period.",
    citations: ["590:11-22"],
    verified: false,
  },
  {
    severity: "Medium",
    title: "Custodian trail uncertainty",
    summary:
      "The testimony leaves open whether deleted incoming mail, rare self-copied sent mail, backups, or custodian mailboxes could preserve relevant DR DOS communications.",
    citations: ["590:11-22", "591:2-12"],
    verified: true,
  },
];

export const strategyCards = [
  {
    title: "Pin down retention policy",
    body:
      "Ask whether Microsoft had a written email retention policy and whether the witness understood it during the DR DOS period.",
  },
  {
    title: "Separate practice from recollection",
    body:
      "Distinguish general deletion habits from specific recollection of DR DOS-related communications.",
  },
  {
    title: "Establish custodian trail",
    body:
      "Identify where sent messages, self-copies, backups, and custodian mailboxes would have resided.",
  },
];

export const claimsGraph = [
  {
    source: "Email deletion practice",
    target: "DR DOS recall gap",
    weight: "0.82",
    relation: "memory tension",
  },
  {
    source: "Sent mail preservation",
    target: "Custodian trail",
    weight: "0.74",
    relation: "record availability",
  },
  {
    source: "Retention policy",
    target: "Follow-up target",
    weight: "0.91",
    relation: "exam priority",
  },
];

export const evidenceTrace: EvidenceTrace[] = [
  {
    id: "E-589-04",
    source: "Gates Dep. 589:4-15",
    signal: "incoming_mail_deleted",
    excerpt:
      "Witness describes ordinary practice of deleting most incoming email after reading.",
    confidence: "96%",
  },
  {
    id: "E-589-20",
    source: "Gates Dep. 589:20-25",
    signal: "specific_recall_gap",
    excerpt:
      "Witness cannot recall specific DR DOS messages deleted or caused to be deleted.",
    confidence: "91%",
  },
  {
    id: "E-590-11",
    source: "Gates Dep. 590:11-22",
    signal: "sent_mail_not_preserved",
    excerpt:
      "Witness states sent emails generally were not preserved unless copied to self.",
    confidence: "95%",
  },
];

export const reportArtifacts = [
  "claims.md",
  "contradiction_review.md",
  "witness_profile.md",
  "cross_exam_plan.md",
];

export const witnessProfile = {
  name: "Bill Gates",
  overview:
    "The witness testified about email deletion practices, limited preservation of sent messages, and recollection gaps concerning DR DOS-related communications. The profile flags record-retention and timeline follow-up vectors without drawing legal conclusions.",
  topics: [
    "Email deletion practices",
    "Document retention",
    "DR DOS communications",
  ],
  vulnerabilities: [
    "Memory gaps on specific DR DOS messages",
    "Document retention and preservation issues",
    "Timeline ambiguity around deleted communications",
  ],
  strengths: [
    "Several claims have transcript citations",
    "Limited verified contradiction exposure",
    "Clear testimony on ordinary email practices",
  ],
  risk: "Medium" as const,
};
