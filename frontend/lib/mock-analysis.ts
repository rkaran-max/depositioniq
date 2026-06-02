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
