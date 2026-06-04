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
  whyItMatters: string;
  linkedEvidence: string[];
  objective: string;
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

export type ClaimRelationshipNode = {
  id: string;
  topic: string;
  claimCount: number;
  risk: "Low" | "Medium" | "High";
  linkedContradictions: number;
  attorneyUse: string;
};

export type ClaimRelationshipEdge = {
  from: string;
  to: string;
  relationship: "supports" | "creates tension with" | "requires follow-up" | "linked by citation";
  citations: string[];
};

export type TranscriptEvidence = {
  id: string;
  citation: string;
  text: string;
  highlights: string[];
  extractedClaim: string;
  relatedContradiction?: string;
  crossExamRelevance: "Low" | "Medium" | "High";
};

export type CrossExamCard = {
  objective: string;
  primaryQuestion: string;
  followUpQuestion: string;
  citation: string;
  attorneyNote: string;
  risk: "Low" | "Medium" | "High";
};

export type LawyerWorkflowStep = {
  step: string;
  title: string;
  description: string;
  output: string;
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
    whyItMatters:
      "The witness's inability to recall a specific DR DOS email does not resolve whether relevant email existed and was deleted under the stated practice.",
    linkedEvidence: ["E-589-04", "E-589-20"],
    objective:
      "Separate ordinary deletion practice from the narrower claim that no specific DR DOS message is remembered.",
  },
  {
    severity: "Low",
    title: "Sent-email preservation scope",
    summary:
      "The witness indicates sent messages were generally not preserved, with rare exceptions for self-copying. Follow-up should clarify whether that practice applied during the relevant DR DOS period.",
    citations: ["590:11-22"],
    verified: false,
    whyItMatters:
      "Sent mail could be an independent source of DR DOS communications, but the testimony leaves the preservation exception undefined.",
    linkedEvidence: ["E-590-11"],
    objective:
      "Identify whether any self-copied sent mail, backups, or custodian mailboxes preserved relevant communications.",
  },
  {
    severity: "Medium",
    title: "Custodian trail uncertainty",
    summary:
      "The testimony leaves open whether deleted incoming mail, rare self-copied sent mail, backups, or custodian mailboxes could preserve relevant DR DOS communications.",
    citations: ["590:11-22", "591:2-12"],
    verified: true,
    whyItMatters:
      "The preservation path matters because the witness's personal practice may not describe every location where responsive messages could exist.",
    linkedEvidence: ["E-590-11", "E-591-02"],
    objective:
      "Force a record-source inventory before moving from lack of recollection to absence of evidence.",
  },
];

export const strategyCards: CrossExamCard[] = [
  {
    objective:
      "Separate general email deletion practice from specific memory denial.",
    primaryQuestion:
      "You testified that you delete most incoming emails after reading them, correct?",
    followUpQuestion:
      "So your inability to recall a specific DR DOS email does not mean such an email never existed, correct?",
    citation: "Gates Dep. 589:4-15, 589:20-25",
    attorneyNote:
      "Use this sequence to prevent the witness from converting lack of memory into absence of records.",
    risk: "High",
  },
  {
    objective:
      "Establish whether preservation duties or policies constrained deletion practices.",
    primaryQuestion:
      "During the relevant DR DOS period, were you aware of any obligation to preserve business communications?",
    followUpQuestion:
      "What policy or instruction told you which emails could be deleted and which had to be retained?",
    citation: "Gates Dep. 590:8-14, 591:2-12",
    attorneyNote:
      "Do not ask for a legal conclusion; ask for facts about instructions, policy, and practice.",
    risk: "Medium",
  },
  {
    objective:
      "Map the record locations where sent or deleted messages might still exist.",
    primaryQuestion:
      "You said you generally did not preserve messages you sent unless you copied yourself, correct?",
    followUpQuestion:
      "Where would self-copied messages, server backups, or custodian mailbox records have been stored?",
    citation: "Gates Dep. 590:11-22, 591:2-12",
    attorneyNote:
      "This supports a document-source inventory without accusing the witness of spoliation.",
    risk: "Medium",
  },
];

export const claimRelationshipNodes: ClaimRelationshipNode[] = [
  {
    id: "email-retention",
    topic: "Email Retention",
    claimCount: 6,
    risk: "High",
    linkedContradictions: 2,
    attorneyUse: "Anchor deletion practice before testing memory testimony.",
  },
  {
    id: "drdos-communications",
    topic: "DR DOS Communications",
    claimCount: 4,
    risk: "Medium",
    linkedContradictions: 1,
    attorneyUse: "Tie recall gaps to specific communication categories.",
  },
  {
    id: "document-preservation",
    topic: "Document Preservation",
    claimCount: 5,
    risk: "High",
    linkedContradictions: 2,
    attorneyUse: "Identify policy and custodian-source follow-up.",
  },
  {
    id: "memory-recall",
    topic: "Memory / Recall Gaps",
    claimCount: 3,
    risk: "Medium",
    linkedContradictions: 2,
    attorneyUse: "Separate lack of recollection from nonexistence of records.",
  },
  {
    id: "cross-exam-targets",
    topic: "Cross-Examination Targets",
    claimCount: 7,
    risk: "High",
    linkedContradictions: 3,
    attorneyUse: "Convert verified tensions into attorney question sequences.",
  },
];

export const claimRelationshipEdges: ClaimRelationshipEdge[] = [
  {
    from: "Email Retention",
    to: "Memory / Recall Gaps",
    relationship: "creates tension with",
    citations: ["589:4-15", "589:20-25"],
  },
  {
    from: "Document Preservation",
    to: "Cross-Examination Targets",
    relationship: "requires follow-up",
    citations: ["590:11-22", "591:2-12"],
  },
  {
    from: "DR DOS Communications",
    to: "Memory / Recall Gaps",
    relationship: "linked by citation",
    citations: ["589:20-25"],
  },
  {
    from: "Email Retention",
    to: "Document Preservation",
    relationship: "supports",
    citations: ["589:4-15", "590:11-22"],
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
  {
    id: "E-591-02",
    source: "Gates Dep. 591:2-12",
    signal: "custodian_source_unknown",
    excerpt:
      "Witness does not identify a specific custodian source for deleted DR DOS communications.",
    confidence: "88%",
  },
];

export const transcriptEvidence: TranscriptEvidence[] = [
  {
    id: "E-589-04",
    citation: "Gates Dep. 589:4-15",
    text:
      "Q. What was your practice with incoming email? A. I delete most incoming e-mails after I read them. If I did not need the message for current work, I generally did not keep it.",
    highlights: ["I delete most incoming e-mails"],
    extractedClaim:
      "The witness states that most incoming emails were deleted as part of ordinary practice.",
    relatedContradiction: "Memory testimony versus deletion practice",
    crossExamRelevance: "High",
  },
  {
    id: "E-589-20",
    citation: "Gates Dep. 589:20-25",
    text:
      "Q. Do you recall deleting any DR DOS-related email? A. I don't recall any specific message relating to DR DOS that I deleted or caused to be deleted.",
    highlights: ["I don't recall any specific message"],
    extractedClaim:
      "The witness cannot recall any specific DR DOS message that he deleted or caused to be deleted.",
    relatedContradiction: "Memory testimony versus deletion practice",
    crossExamRelevance: "High",
  },
  {
    id: "E-590-11",
    citation: "Gates Dep. 590:11-22",
    text:
      "Q. Did you preserve messages that you sent? A. I don't preserve messages that I send unless I copy myself, and that was not my usual practice.",
    highlights: ["I don't preserve messages that I send"],
    extractedClaim:
      "The witness says he does not preserve most sent emails, except rare self-copy instances.",
    relatedContradiction: "Sent-email preservation scope",
    crossExamRelevance: "Medium",
  },
  {
    id: "E-591-02",
    citation: "Gates Dep. 591:2-12",
    text:
      "Q. Where would a DR DOS communication be located if it was not in your mailbox? A. I don't know which backup, server, or custodian location would have retained it.",
    highlights: ["I don't know which backup, server, or custodian location"],
    extractedClaim:
      "The witness does not identify a specific custodian source for deleted DR DOS communications.",
    relatedContradiction: "Custodian trail uncertainty",
    crossExamRelevance: "High",
  },
];

export const lawyerWorkflow: LawyerWorkflowStep[] = [
  {
    step: "01",
    title: "Review evidence",
    description:
      "Start with citation-linked excerpts and confirm each extracted claim against the transcript text.",
    output: "Supported claim set",
  },
  {
    step: "02",
    title: "Test contradiction",
    description:
      "Compare memory disclaimers against deletion and preservation testimony before treating a gap as meaningful.",
    output: "Verified issue list",
  },
  {
    step: "03",
    title: "Draft cross-exam",
    description:
      "Convert each verified issue into an objective, primary question, follow-up, and attorney note.",
    output: "Question sequence",
  },
  {
    step: "04",
    title: "Export report",
    description:
      "Bundle claims, evidence spans, contradiction review, and cross-examination targets into attorney-ready Markdown.",
    output: "DepositionIQ report",
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
    "The witness testified about email deletion practices, limited preservation of sent messages, and recollection gaps concerning DR DOS-related communications. The profile flags record-retention and timeline follow-up areas without drawing legal conclusions.",
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
