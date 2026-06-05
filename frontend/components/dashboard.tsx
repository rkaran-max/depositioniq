"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileText,
  Link2,
  Lock,
  Mic2,
  Network,
  Search,
  ShieldAlert,
  Target,
  UploadCloud,
} from "lucide-react";
import { AgentTrace } from "@/components/agent-trace";
import { EvidenceViewer } from "@/components/evidence-viewer";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  analyzeTranscript,
  createMockAnalysisState,
  transcribeAndAnalyzeAudio,
  type DashboardAnalysisState,
} from "@/lib/analysis-api";
import { cn } from "@/lib/utils";

const statusTone = {
  complete: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  active: "border-sky-300/25 bg-sky-300/10 text-sky-200",
  queued: "border-slate-300/15 bg-slate-300/10 text-slate-300",
};

const riskBadgeTone = {
  Low: "border-slate-300/15 bg-slate-300/10 text-slate-300",
  Medium: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  High: "border-rose-300/25 bg-rose-300/10 text-rose-200",
};

const panelMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut" },
};

type SearchResult = {
  id: string;
  category: string;
  title: string;
  snippet: string;
  citation?: string;
  targetId: string;
};

const RESULTS_SECTION_ID = "demo-results";

type WitnessContext = {
  label: string;
  summary: string;
  focusAreas: string[];
  citations: string[];
  note: string;
};

function SectionLabel({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[11px] font-medium text-slate-500">
          {eyebrow}
        </div>
        <h2 className="mt-1 break-words text-sm font-medium text-slate-100">{title}</h2>
      </div>
      {action ? <div className="max-w-full break-words font-mono text-[10px] text-sky-300">{action}</div> : null}
    </div>
  );
}

function ConsolePanel({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      {...panelMotion}
      id={id}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-[#0B0F17]/95 shadow-[0_16px_48px_rgba(0,0,0,0.28)]",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

function buildWitnessContext({
  claims,
  contradictions,
  transcriptEvidence,
  transcriptText,
  witnessProfile,
  inputMode,
}: Pick<
  DashboardAnalysisState,
  "claims" | "contradictions" | "transcriptEvidence" | "witnessProfile" | "inputMode"
> & {
  transcriptText: string;
}): WitnessContext {
  const claimText = claims.map((claim) => claim.claim).join(" ").toLowerCase();
  const issueText = contradictions.map((issue) => `${issue.title} ${issue.summary}`).join(" ").toLowerCase();
  const transcriptLower = transcriptText.toLowerCase();
  const combined = `${claimText} ${issueText} ${transcriptLower}`;
  const verifiedIssues = contradictions.filter((issue) => issue.verified).length;
  const topics = witnessProfile.topics.length
    ? witnessProfile.topics.slice(0, 3)
    : Array.from(new Set(claims.map((claim) => claim.topic))).slice(0, 3);
  const topicLabel = topics.length ? topics.join(", ") : "the transcript topics";
  const hasAffirmativePreservation = /\b(preserved|preserve|retained|retain|kept|saved)\b/.test(combined);
  const hasDeletion = /\b(delete|deleted|deletion|discard|discarded|did not preserve|do not preserve|not preserved)\b/.test(combined);
  const hasRecall = /\b(do not recall|don't recall|cannot recall|can't recall|memory|recollection)\b/.test(combined);

  let label = "No preservation or recall issue detected";
  if (hasAffirmativePreservation && hasDeletion) {
    label = "Preservation/deletion tension detected";
  } else if (hasDeletion) {
    label = "Retention gap detected";
  } else if (hasRecall) {
    label = "Recall limitation detected";
  }

  const witnessName =
    !witnessProfile.name?.trim() || witnessProfile.name.trim().toLowerCase() === "unknown witness"
      ? "Transcript witness"
      : witnessProfile.name.trim();
  const inputLabel = inputMode === "Demo" ? "demo transcript" : `${inputMode.toLowerCase()} transcript`;
  const highestPriority = contradictions[0]?.title;
  const hasDrDos = transcriptLower.includes("dr dos");
  const topicPhrase = hasDrDos ? topicLabel : topicLabel.replace(/DR DOS[^,]*/gi, "disputed communications");

  return {
    label,
    summary: `${witnessName} provided testimony from a ${inputLabel} concerning ${topicPhrase}. The current analysis identified ${claims.length} extracted claim${claims.length === 1 ? "" : "s"} and ${verifiedIssues} verified review issue${verifiedIssues === 1 ? "" : "s"}. ${
      highestPriority
        ? `The highest-priority issue is "${highestPriority}", which may merit attorney review.`
        : "No verified contradiction is currently prioritized, but the claims should remain tied to their citations for attorney review."
    } Outputs are review aids and not legal conclusions.`,
    focusAreas: [
      ...topics,
      ...(hasDeletion ? ["Retention and preservation practice"] : []),
      ...(hasRecall ? ["Memory and recall limitations"] : []),
      ...(contradictions.length ? ["Contradiction review"] : ["Citation support review"]),
    ].slice(0, 5),
    citations: Array.from(new Set(transcriptEvidence.map((evidence) => evidence.citation).filter(Boolean))).slice(0, 4),
    note:
      verifiedIssues > 0
        ? "Potential examination vector for attorney review."
        : "Use the linked citations to confirm whether follow-up is warranted.",
  };
}

function BackendStatusBanner({
  sourceMode,
  transcriptId,
}: {
  sourceMode: "mock" | "api";
  transcriptId?: string;
}) {
  const isLive = sourceMode === "api";

  return (
    <motion.div
      {...panelMotion}
      className={cn(
        "mb-6 grid gap-3 rounded-xl border bg-[#0B0F17] p-4 shadow-[0_14px_44px_rgba(0,0,0,0.24)] md:grid-cols-[1fr_auto_auto]",
        isLive ? "border-emerald-300/25" : "border-amber-300/20",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "size-2 rounded-full",
            isLive ? "bg-emerald-300 text-emerald-300" : "bg-amber-300 text-amber-300",
          )}
        />
        <div>
          <div className="text-[11px] font-medium text-slate-500">
            Analysis source
          </div>
          <div className="mt-1 text-sm font-medium text-white">
            {isLive ? "Live Backend: Connected" : "Demo Mode: Mock Analysis"}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2">
        <div className="text-[11px] font-medium text-slate-500">
          Source
        </div>
        <div className="mt-1 break-all font-mono text-xs text-slate-300">
          {isLive ? "FastAPI /analyze" : "frontend/lib/mock-analysis.ts"}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2">
        <div className="text-[11px] font-medium text-slate-500">
          Transcript ID
        </div>
        <div className="mt-1 break-all font-mono text-xs text-sky-300">
          {isLive ? transcriptId ?? "pending" : "N/A"}
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const [analysis, setAnalysis] = useState(createMockAnalysisState);
  const [transcriptText, setTranscriptText] = useState(analysis.sampleTranscript);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [analysisNotice, setAnalysisNotice] = useState(
    "Demo mode uses mock data until the FastAPI backend is running.",
  );

  const {
    agentTrace,
    claims,
    contradictions,
    depositionMetrics,
    evidenceTrace,
    lawyerWorkflow,
    pipelineStages,
    reportArtifacts,
    strategyCards,
    transcriptEvidence,
    witnessProfile,
    reportMarkdown,
    sourceMode,
    statusLabel,
    transcriptId,
    inputMode,
  } = analysis;

  const witnessContext = useMemo(
    () =>
      buildWitnessContext({
        claims,
        contradictions,
        transcriptEvidence,
        transcriptText,
        witnessProfile,
        inputMode,
      }),
    [claims, contradictions, inputMode, transcriptEvidence, transcriptText, witnessProfile],
  );

  const searchResults = useMemo(
    () =>
      buildSearchResults({
        query: searchQuery,
        transcriptText,
        claims,
        contradictions,
        transcriptEvidence,
        evidenceTrace,
        strategyCards,
        reportMarkdown,
      }),
    [
      searchQuery,
      transcriptText,
      claims,
      contradictions,
      transcriptEvidence,
      evidenceTrace,
      strategyCards,
      reportMarkdown,
    ],
  );

  function scrollToResults() {
    window.setTimeout(() => {
      document
        .getElementById(RESULTS_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function scrollToSection(targetId: string) {
    setIsSearchFocused(false);
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setAnalysisNotice("Sending transcript to DepositionIQ FastAPI backend...");
    try {
      const nextAnalysis = await analyzeTranscript(transcriptText);
      setAnalysis(nextAnalysis);
      setAnalysisNotice(`Live backend analysis complete: ${nextAnalysis.transcriptId}`);
      scrollToResults();
    } catch (error) {
      setAnalysis(createMockAnalysisState());
      setAnalysisNotice(
        `Backend unavailable; showing demo fallback. ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleAudioTranscribeAnalyze() {
    if (!audioFile) {
      setAnalysisNotice("Choose an audio file before starting transcription.");
      return;
    }

    setIsTranscribingAudio(true);
    setAnalysisNotice("Transcribing audio...");
    try {
      const result = await transcribeAndAnalyzeAudio(audioFile);
      setAnalysisNotice("Analyzing transcript...");
      setTranscriptText(result.transcriptText);
      setAnalysis(result.analysis);
      setAnalysisNotice(`Live audio analysis complete: ${result.analysis.transcriptId}`);
      scrollToResults();
    } catch (error) {
      setAnalysisNotice(
        error instanceof Error
          ? error.message
          : "Audio transcription is not installed. Install optional audio dependencies or use pasted transcript text.",
      );
    } finally {
      setIsTranscribingAudio(false);
    }
  }

  function handleViewSampleCase() {
    const sampleAnalysis = createMockAnalysisState();
    setAnalysis(sampleAnalysis);
    setTranscriptText(sampleAnalysis.sampleTranscript);
    setAnalysisNotice("Loaded sample case in demo mode.");
    scrollToResults();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070A0F] pt-16 text-slate-100">
      <div className="pointer-events-none absolute inset-0 noise-overlay opacity-25" />

      <div className="relative mx-auto flex w-full max-w-[1920px] gap-5 p-4 xl:gap-6 xl:p-6">
        <Sidebar />

        <section className="min-w-0 flex-1">
          <header className="relative z-20 mb-4 grid gap-3 rounded-lg border border-white/10 bg-[#070A0F]/90 p-2.5 shadow-[0_12px_42px_rgba(0,0,0,0.32)] backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div className="relative flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2">
              <Search className="size-3.5 text-slate-500" />
              <Input
                className="h-6 border-0 bg-transparent p-0 font-mono text-xs text-slate-300 placeholder:text-slate-600 focus-visible:ring-0"
                placeholder="Search testimony, citations, contradictions, and witness claims"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 140)}
              />
              {searchQuery.trim() ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={searchResults.length === 0}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    if (searchResults[0]) {
                      scrollToSection(searchResults[0].targetId);
                    }
                  }}
                  className="h-7 px-3 text-[11px]"
                >
                  Apply
                </Button>
              ) : null}
              {isSearchFocused && searchQuery.trim() ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-[#0B0F17] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                  {searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => scrollToSection(result.targetId)}
                          className="w-full rounded-lg border border-transparent px-3 py-2 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-slate-400">
                              {result.category}
                            </span>
                            {result.citation ? (
                              <span className="break-all font-mono text-[10px] text-sky-300">{result.citation}</span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-xs font-medium text-slate-100">{result.title}</div>
                          <div className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">{result.snippet}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-4 text-sm text-slate-500">No results found.</div>
                  )}
                </div>
              ) : null}
            </div>
            <Badge variant="slate" className="justify-center font-mono uppercase tracking-[0.16em]">
              {statusLabel}
            </Badge>
            <Button variant="secondary" size="sm" className="text-xs">
              <FileText className="size-3.5" />
              Status
            </Button>
          </header>

          <BackendStatusBanner sourceMode={sourceMode} transcriptId={transcriptId} />

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_440px]">
            <motion.div
              {...panelMotion}
              id="overview"
              className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0B0F17] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.32)] md:p-8"
            >
              <Badge variant="slate" className="font-mono uppercase tracking-[0.18em]">
                Evidence-led review
              </Badge>

              <div className="mt-10 max-w-3xl">
                <h1 className="text-balance text-4xl font-medium tracking-tight text-white md:text-5xl">
                  Review testimony, contradictions, and source evidence in one workspace
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Extract structured witness claims, verify contradictions against the
                  transcript record, and generate cross-examination plans with citation
                  grounded legal reasoning infrastructure.
                </p>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-4">
                {depositionMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-white/10 bg-[#070A0F] p-3"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      {metric.label}
                    </div>
                    <div className="mt-3 text-2xl font-medium text-white">{metric.value}</div>
                    <div className="mt-1 text-xs text-slate-500">{metric.detail}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !transcriptText.trim()}
                  className="text-sm"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Transcript"}
                  <ArrowRight className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleViewSampleCase}
                  className="text-sm"
                >
                  View Sample Case
                </Button>
              </div>
            </motion.div>

            <ConsolePanel className="p-4">
              <SectionLabel eyebrow="activity" title="Analysis status" action={sourceMode === "api" ? "live backend" : "demo fallback"} />
              <AgentTrace events={agentTrace} />
            </ConsolePanel>
          </section>

          <ConsolePanel id="agent-pipeline" className="mt-5 p-5">
            <SectionLabel
              eyebrow="processing summary"
              title="Transcript analysis stages"
              action="backend pipeline"
            />
            <div className="grid gap-2 lg:grid-cols-5">
              {pipelineStages.map((stage, index) => (
                <div key={stage.id} className="relative rounded-lg border border-white/10 bg-[#070A0F] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 break-words font-mono text-[11px] text-slate-200">{stage.label}</div>
                    <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px]", statusTone[stage.status])}>
                      {stage.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-2">
                    <div className="min-w-0 break-words text-xs text-slate-500">{stage.output}</div>
                    <div className="font-mono text-[10px] text-slate-600">{stage.latency}</div>
                  </div>
                </div>
              ))}
            </div>
          </ConsolePanel>

          <ConsolePanel id="lawyer-workflow" className="mt-5 p-5">
            <SectionLabel
              eyebrow="lawyer workflow"
              title="Review evidence -> Test contradiction -> Draft cross-exam -> Export report"
              action="guided review"
            />
            <div className="grid gap-3 md:grid-cols-4">
              {lawyerWorkflow.map((step, index) => (
                <div key={step.step} className="relative rounded-lg border border-white/10 bg-[#070A0F] p-4">
                  {index < lawyerWorkflow.length - 1 ? (
                    <div className="absolute -right-3 top-8 hidden h-px w-5 bg-violet-300/25 md:block" />
                  ) : null}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded border border-violet-300/20 bg-violet-300/10 font-mono text-[10px] text-violet-200">
                      {step.step}
                    </div>
                    <div className="text-sm font-medium text-white">{step.title}</div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">{step.description}</p>
                  <div className="mt-4 rounded border border-white/10 bg-[#111827] px-2 py-1.5 font-mono text-[10px] break-words text-slate-400">
                    output: {step.output}
                  </div>
                </div>
              ))}
            </div>
          </ConsolePanel>

          <section className="mt-5 grid scroll-mt-24 gap-5 2xl:grid-cols-[minmax(980px,1fr)_minmax(420px,480px)]" id="live-analysis-console">
            <ConsolePanel className="p-5">
              <SectionLabel eyebrow="transcript intake" title="Transcript, PDF, or experimental audio ingestion" action={sourceMode === "api" ? "Live backend" : "Demo fallback"} />
              <div className="grid gap-4 xl:grid-cols-[minmax(300px,340px)_minmax(520px,1fr)] 2xl:grid-cols-[minmax(330px,380px)_minmax(640px,1fr)]">
                <div className="grid gap-3 md:grid-cols-2 xl:block xl:space-y-3">
                  <div className="rounded-lg border border-amber-300/15 bg-amber-300/[0.035] p-4">
                    <div className="flex items-center gap-2">
                      <Mic2 className="size-4 text-amber-200" />
                      <div className="text-xs font-medium text-slate-100">Experimental audio upload</div>
                    </div>
                    <div className="mt-3 text-sm font-medium text-white">Upload deposition audio</div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Experimental: audio is transcribed locally/server-side, then analyzed through the same DepositionIQ pipeline.
                    </p>
                    <Input
                      type="file"
                      accept=".mp3,.wav,.m4a,.mp4,audio/mpeg,audio/wav,audio/mp4"
                      className="mt-3 h-auto cursor-pointer bg-[#070A0F] py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950"
                      onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="default"
                      onClick={handleAudioTranscribeAnalyze}
                      disabled={!audioFile || isTranscribingAudio || isAnalyzing}
                      className="mt-3 w-full text-xs"
                    >
                      {isTranscribingAudio ? "Transcribing audio..." : "Transcribe + Analyze Audio"}
                    </Button>
                    <div className="mt-2 text-[11px] leading-5 text-slate-500">
                      Supported: .mp3, .wav, .m4a, .mp4 audio. Pasted transcript remains the primary demo path.
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed border-sky-300/20 bg-[#070A0F] p-4">
                    <UploadCloud className="size-5 text-sky-300" />
                    <div className="mt-4 text-xs font-medium text-slate-200">PDF transcript upload</div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      OCR fallback, Q/A cleanup, page-line preservation, and citation-aware text extraction.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500">
                      <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1">OCR ready</span>
                      <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1">Citations on</span>
                    </div>
                  </div>
                </div>
                <Textarea
                  className="min-h-[420px] resize-y border-white/10 bg-[#070A0F] font-mono text-[13px] leading-6 text-slate-300 placeholder:text-slate-700 xl:min-h-[500px]"
                  value={transcriptText}
                  onChange={(event) => setTranscriptText(event.target.value)}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !transcriptText.trim()}
                  className="text-sm"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Deposition"}
                  <ArrowRight className="size-3.5" />
                </Button>
                <div className="font-mono text-[10px] text-slate-500">
                  {transcriptId ? `transcript_id: ${transcriptId}` : analysisNotice}
                </div>
              </div>
            </ConsolePanel>

            <ConsolePanel id={RESULTS_SECTION_ID} className="scroll-mt-24 p-5">
              <SectionLabel eyebrow="review priorities" title="Contradictions and evidence requiring attorney attention" action={`${contradictions.length} issues`} />
              <div className="space-y-3">
                {contradictions.slice(0, 3).map((contradiction, index) => (
                  <div key={`${contradiction.title}-${index}`} className="rounded-lg border border-white/10 bg-[#070A0F] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{contradiction.title}</div>
                        <p className="mt-2 text-xs leading-5 text-slate-500">{contradiction.summary}</p>
                      </div>
                      <Badge variant={contradiction.severity === "High" ? "red" : contradiction.severity === "Medium" ? "amber" : "slate"} className="font-mono">
                        {contradiction.severity}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contradiction.citations.map((citation, citationIndex) => (
                        <span key={`${citation}-${citationIndex}`} className="max-w-full rounded-md border border-white/10 bg-[#0B0F17] px-2 py-1 font-mono text-[10px] break-all text-slate-400">
                          {citation}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {contradictions.length === 0 ? (
                  <div className="rounded-lg border border-white/10 bg-[#070A0F] p-4 text-sm text-slate-400">
                    No contradiction candidates are currently displayed.
                  </div>
                ) : null}
              </div>
            </ConsolePanel>
          </section>

          <ConsolePanel id="transcript-evidence-viewer" className="mt-5 p-5">
            <SectionLabel
              eyebrow="evidence viewer"
              title="Citation-linked excerpts, extracted claims, and examination relevance"
              action="phrase highlights"
            />
            <EvidenceViewer excerpts={transcriptEvidence} />
          </ConsolePanel>

          <ConsolePanel id="claims" className="mt-4 p-4">
            <SectionLabel eyebrow="claims" title="Structured witness claims from backend analysis" action={`${claims.length} claims`} />
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#070A0F]">
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead className="border-b border-white/10 bg-[#111827] font-mono uppercase tracking-[0.18em] text-slate-600">
                  <tr>
                    <th className="px-3 py-3">Claim</th>
                    <th className="px-3 py-3">Topic</th>
                    <th className="px-3 py-3">Certainty</th>
                    <th className="px-3 py-3">Confidence</th>
                    <th className="px-3 py-3">Citation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="transition hover:bg-white/[0.035]">
                      <td className="max-w-2xl px-3 py-3 leading-5 text-slate-300">{claim.claim}</td>
                      <td className="px-3 py-3">
                        <Badge variant="violet" className="font-mono">{claim.topic}</Badge>
                      </td>
                      <td className="px-3 py-3 text-slate-400">{claim.certainty}</td>
                      <td className="px-3 py-3 font-mono text-sky-300">{claim.confidence}</td>
                      <td className="px-3 py-3 font-mono text-slate-500">{claim.citation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ConsolePanel>

          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.76fr)]">
            <ConsolePanel id="contradiction-review" className="p-4">
              <SectionLabel eyebrow="contradiction review" title="Verified conflicts and unresolved testimony gaps" action={`${contradictions.length} issues`} />
              <div className="space-y-3">
                {contradictions.map((contradiction, index) => (
                  <div key={`${contradiction.title}-${index}`} className="rounded-lg border border-white/10 bg-[#070A0F] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="size-4 text-violet-300" />
                        <div className="text-sm font-medium text-white">{contradiction.title}</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={contradiction.severity === "High" ? "red" : contradiction.severity === "Medium" ? "amber" : "slate"} className="font-mono">
                          {contradiction.severity}
                        </Badge>
                        {contradiction.verified ? (
                          <Badge variant="green" className="font-mono">
                            <CheckCircle2 className="mr-1 size-3" />
                            verified
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-slate-500">{contradiction.summary}</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <div className="rounded border border-white/10 bg-[#111827] p-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                          why it matters
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-400">{contradiction.whyItMatters}</p>
                      </div>
                      <div className="rounded border border-white/10 bg-[#111827] p-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                          cross-exam objective
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-400">{contradiction.objective}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contradiction.linkedEvidence.map((evidenceId, evidenceIndex) => (
                        <span key={`${evidenceId}-${evidenceIndex}`} className="inline-flex items-center gap-1 rounded border border-violet-300/15 bg-violet-300/10 px-2 py-1 font-mono text-[10px] text-violet-200">
                          <Link2 className="size-3" />
                          {evidenceId}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contradiction.citations.map((citation, citationIndex) => (
                        <span key={`${citation}-${citationIndex}`} className="rounded border border-white/10 bg-[#111827] px-2 py-1 font-mono text-[10px] text-slate-400">
                          {citation}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ConsolePanel>

            <ConsolePanel id="cross-examination" className="p-4">
              <SectionLabel eyebrow="cross-exam strategy" title="Attorney prompt synthesis" action={`${strategyCards.length} targets`} />
              <div className="space-y-3">
                {strategyCards.map((card, index) => (
                  <div key={`${card.objective}-${index}`} className="group rounded-lg border border-white/10 bg-[#070A0F] p-4 transition hover:border-sky-300/25 hover:bg-[#0B0F17]">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex size-7 items-center justify-center rounded border border-sky-300/20 bg-sky-300/10 font-mono text-[10px] text-sky-200">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0 flex-1 break-words text-sm font-medium text-white">{card.objective}</div>
                      <span className={cn("rounded-md border px-2 py-1 font-mono text-[10px]", riskBadgeTone[card.risk])}>
                        {card.risk}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="rounded border border-white/10 bg-[#111827] p-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                          primary question
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-300">{card.primaryQuestion}</p>
                      </div>
                      <div className="rounded border border-white/10 bg-[#111827] p-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                          follow-up
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-300">{card.followUpQuestion}</p>
                      </div>
                    </div>
                    <div className="mt-3 rounded border border-white/10 bg-[#0B0F17] p-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                        attorney note
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{card.attorneyNote}</p>
                    </div>
                    <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded border border-white/10 bg-[#111827] px-2 py-1 font-mono text-[10px] break-all text-sky-300">
                      <Target className="size-3 shrink-0" />
                      {card.citation}
                    </div>
                  </div>
                ))}
              </div>
            </ConsolePanel>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(380px,0.72fr)_minmax(0,1fr)]">
            <ConsolePanel id="witness-context" className="p-4">
              <SectionLabel eyebrow="witness context" title="Record context and follow-up posture" action="attorney review" />
              <div className="rounded-lg border border-violet-300/15 bg-[#070A0F] p-4">
                <div className="flex items-start gap-3">
                  <Network className="mt-0.5 size-4 shrink-0 text-violet-300" />
                  <div className="min-w-0">
                    <div className="break-words text-sm font-medium text-white">{witnessContext.label}</div>
                    <p className="mt-2 break-words text-xs leading-6 text-slate-500">{witnessContext.summary}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {witnessContext.focusAreas.slice(0, 3).map((item) => (
                    <div key={item} className="max-w-full rounded border border-white/10 bg-[#111827] px-3 py-2 font-mono text-[10px] break-words text-slate-400">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-white/10 bg-[#070A0F] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                  witness profile summary
                </div>
                <div className="mt-2 text-sm text-white">{witnessProfile.name}</div>
                <p className="mt-2 break-words text-xs leading-6 text-slate-500">{witnessProfile.overview}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {witnessContext.citations.length > 0 ? (
                    witnessContext.citations.map((citation) => (
                      <span key={citation} className="max-w-full rounded border border-sky-300/15 bg-sky-300/10 px-2 py-1 font-mono text-[10px] break-all text-sky-300">
                        {citation}
                      </span>
                    ))
                  ) : (
                    <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-slate-500">
                      citations pending
                    </span>
                  )}
                </div>
                <div className="mt-3 break-words text-[11px] leading-5 text-slate-500">{witnessContext.note}</div>
              </div>
            </ConsolePanel>

            <ConsolePanel id="evidence-trace" className="p-4">
              <SectionLabel eyebrow="evidence trace" title="Citation-grounded support spans" action="linked support" />
              <div className="space-y-2">
                {evidenceTrace.map((evidence) => (
                  <div key={evidence.id} className="grid gap-3 rounded-lg border border-white/10 bg-[#070A0F] p-3 md:grid-cols-[minmax(0,160px)_minmax(0,1fr)_minmax(64px,70px)]">
                    <div className="min-w-0">
                      <div className="break-all font-mono text-[10px] text-slate-600">{evidence.id}</div>
                      <div className="mt-1 break-all font-mono text-[11px] text-sky-300">{evidence.source}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="break-all font-mono text-[10px] text-slate-500">{evidence.signal}</div>
                      <p className="mt-1 break-words text-xs leading-5 text-slate-400">{evidence.excerpt}</p>
                    </div>
                    <div className="self-center rounded border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-center font-mono text-[11px] text-emerald-200">
                      {evidence.confidence}
                    </div>
                  </div>
                ))}
              </div>
            </ConsolePanel>
          </section>

          <ConsolePanel id="report" className="mt-4 p-4">
            <SectionLabel eyebrow="report export" title="Attorney-ready Markdown artifacts" action="ready" />
            <div className="grid gap-4 lg:grid-cols-[0.72fr_0.28fr]">
              <div className="rounded-lg border border-white/10 bg-[#070A0F] p-4">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <Code2 className="size-4 text-sky-300" />
                  depositioniq.report.bundle
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  {reportArtifacts.map((artifact) => (
                    <div key={artifact} className="rounded border border-white/10 bg-[#111827] p-3">
                      <FileText className="size-4 text-slate-500" />
                      <div className="mt-3 break-all font-mono text-[10px] text-slate-300">{artifact}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#070A0F] p-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <Lock className="size-3.5" />
                  deterministic demo
                </div>
                <div className="mt-4 text-sm text-white">No API key required</div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {sourceMode === "api"
                    ? "Live FastAPI backend output is ready for download."
                    : "Mock-backed fallback remains available when the backend API is offline."}
                </p>
                <Button asChild className="mt-4 w-full text-sm">
                  <a
                    href={`data:text/markdown;charset=utf-8,${encodeURIComponent(reportMarkdown)}`}
                    download="depositioniq-report.md"
                  >
                  Export Report
                  </a>
                </Button>
              </div>
            </div>
          </ConsolePanel>
        </section>
      </div>
    </main>
  );
}

function buildSearchResults({
  query,
  transcriptText,
  claims,
  contradictions,
  transcriptEvidence,
  evidenceTrace,
  strategyCards,
  reportMarkdown,
}: {
  query: string;
  transcriptText: string;
  claims: Array<{ id: string; claim: string; topic: string; citation: string }>;
  contradictions: Array<{ title: string; summary: string; citations: string[] }>;
  transcriptEvidence: Array<{
    id: string;
    citation: string;
    text: string;
    extractedClaim: string;
    relatedContradiction?: string;
  }>;
  evidenceTrace: Array<{ id: string; source: string; signal: string; excerpt: string }>;
  strategyCards: Array<{
    objective: string;
    primaryQuestion: string;
    followUpQuestion: string;
    citation: string;
    attorneyNote: string;
  }>;
  reportMarkdown: string;
}): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const candidates: SearchResult[] = [
    {
      id: "transcript-current",
      category: "Transcript",
      title: "Current transcript text",
      snippet: transcriptText,
      targetId: "live-analysis-console",
    },
    ...claims.map((claim) => ({
      id: `claim-${claim.id}`,
      category: "Claim",
      title: claim.claim,
      snippet: claim.topic,
      citation: claim.citation,
      targetId: "claims",
    })),
    ...contradictions.map((contradiction, index) => ({
      id: `contradiction-${index}-${contradiction.title}`,
      category: "Contradiction",
      title: contradiction.title,
      snippet: contradiction.summary,
      citation: contradiction.citations.join(", "),
      targetId: "contradiction-review",
    })),
    ...transcriptEvidence.map((evidence) => ({
      id: `transcript-evidence-${evidence.id}`,
      category: "Evidence",
      title: evidence.extractedClaim,
      snippet: [evidence.text, evidence.relatedContradiction].filter(Boolean).join(" "),
      citation: evidence.citation,
      targetId: "transcript-evidence-viewer",
    })),
    ...evidenceTrace.map((evidence) => ({
      id: `evidence-trace-${evidence.id}`,
      category: "Evidence Trace",
      title: evidence.signal,
      snippet: evidence.excerpt,
      citation: evidence.source,
      targetId: "evidence-trace",
    })),
    ...strategyCards.map((card, index) => ({
      id: `cross-exam-${index}-${card.objective}`,
      category: "Cross-Exam",
      title: card.objective,
      snippet: `${card.primaryQuestion} ${card.followUpQuestion} ${card.attorneyNote}`,
      citation: card.citation,
      targetId: "cross-examination",
    })),
    {
      id: "report-markdown",
      category: "Report",
      title: "Exported report markdown",
      snippet: reportMarkdown,
      targetId: "report",
    },
  ];

  return candidates
    .filter((candidate) =>
      [
        candidate.category,
        candidate.title,
        candidate.snippet,
        candidate.citation ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    .slice(0, 8)
    .map((candidate) => ({
      ...candidate,
      snippet: compactSnippet(candidate.snippet, normalizedQuery),
    }));
}

function compactSnippet(text: string, query: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 180) {
    return cleaned || "No additional context.";
  }

  const index = cleaned.toLowerCase().indexOf(query);
  const start = Math.max(0, index > -1 ? index - 70 : 0);
  const end = Math.min(cleaned.length, start + 180);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < cleaned.length ? "..." : "";
  return `${prefix}${cleaned.slice(start, end)}${suffix}`;
}
