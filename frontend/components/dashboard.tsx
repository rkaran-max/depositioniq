"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileText,
  Link2,
  Lock,
  Network,
  Search,
  ShieldAlert,
  Target,
  Terminal,
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
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
          {eyebrow}
        </div>
        <h2 className="mt-1 text-sm font-medium text-slate-100">{title}</h2>
      </div>
      {action ? <div className="font-mono text-[10px] text-sky-300">{action}</div> : null}
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
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
            analysis.source
          </div>
          <div className="mt-1 text-sm font-medium text-white">
            {isLive ? "Live Backend: Connected" : "Demo Mode: Mock Analysis"}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          source
        </div>
        <div className="mt-1 font-mono text-xs text-slate-300">
          {isLive ? "FastAPI /analyze" : "frontend/lib/mock-analysis.ts"}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          transcript id
        </div>
        <div className="mt-1 font-mono text-xs text-sky-300">
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
  } = analysis;

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setAnalysisNotice("Sending transcript to DepositionIQ FastAPI backend...");
    try {
      const nextAnalysis = await analyzeTranscript(transcriptText);
      setAnalysis(nextAnalysis);
      setAnalysisNotice(`Live backend analysis complete: ${nextAnalysis.transcriptId}`);
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

  function handleViewSampleCase() {
    const sampleAnalysis = createMockAnalysisState();
    setAnalysis(sampleAnalysis);
    setTranscriptText(sampleAnalysis.sampleTranscript);
    setAnalysisNotice("Loaded sample case in demo mode.");
    document
      .getElementById("live-analysis-console")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070A0F] text-slate-100">
      <div className="pointer-events-none absolute inset-0 noise-overlay opacity-25" />

      <div className="relative mx-auto flex w-full max-w-[1480px] gap-5 p-5">
        <Sidebar />

        <section className="min-w-0 flex-1">
          <header className="sticky top-4 z-30 mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#070A0F]/90 p-2.5 shadow-[0_12px_42px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2">
              <Search className="size-3.5 text-slate-500" />
              <Input
                className="h-6 border-0 bg-transparent p-0 font-mono text-xs text-slate-300 placeholder:text-slate-600 focus-visible:ring-0"
                placeholder="cmd+k / search testimony, citations, contradictions, vectors"
              />
            </div>
            <Badge variant="slate" className="hidden font-mono uppercase tracking-[0.16em] md:inline-flex">
              {statusLabel}
            </Badge>
            <Button variant="secondary" size="sm" className="font-mono text-xs">
              <Terminal className="size-3.5" />
              trace
            </Button>
          </header>

          <BackendStatusBanner sourceMode={sourceMode} transcriptId={transcriptId} />

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_420px]">
            <motion.div
              {...panelMotion}
              id="overview"
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F17] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.32)] md:p-8"
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
                  className="font-mono text-xs uppercase tracking-[0.12em]"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Transcript"}
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleViewSampleCase}
                  className="font-mono text-xs uppercase tracking-[0.12em]"
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
              action="deterministic pipeline"
            />
            <div className="grid gap-2 lg:grid-cols-5">
              {pipelineStages.map((stage, index) => (
                <div key={stage.id} className="relative rounded-lg border border-white/10 bg-[#070A0F] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-mono text-[11px] text-slate-200">{stage.label}</div>
                    <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[10px]", statusTone[stage.status])}>
                      {stage.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-2">
                    <div className="text-xs text-slate-500">{stage.output}</div>
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
              action="attorney.path guided"
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
                  <div className="mt-4 rounded border border-white/10 bg-[#111827] px-2 py-1.5 font-mono text-[10px] text-slate-400">
                    output: {step.output}
                  </div>
                </div>
              ))}
            </div>
          </ConsolePanel>

          <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <ConsolePanel id="live-analysis-console" className="p-5">
              <SectionLabel eyebrow="live analysis console" title="Transcript input / PDF ingestion" action={`source.mode ${sourceMode}`} />
              <div className="grid gap-3 md:grid-cols-[0.42fr_0.58fr]">
                <div className="rounded-lg border border-dashed border-sky-300/20 bg-[#070A0F] p-4">
                  <UploadCloud className="size-5 text-sky-300" />
                  <div className="mt-4 font-mono text-xs text-slate-200">upload.transcript_pdf</div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    OCR fallback, Q/A cleanup, page-line preservation, and citation-aware text extraction.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500">
                    <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1">ocr.ready</span>
                    <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-1">citations.on</span>
                  </div>
                </div>
                <Textarea
                  className="min-h-52 resize-none border-white/10 bg-[#070A0F] font-mono text-xs leading-6 text-slate-300 placeholder:text-slate-700"
                  value={transcriptText}
                  onChange={(event) => setTranscriptText(event.target.value)}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !transcriptText.trim()}
                  className="font-mono text-xs uppercase tracking-[0.12em]"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Deposition"}
                  <ArrowRight className="size-4" />
                </Button>
                <div className="font-mono text-[10px] text-slate-500">
                  {transcriptId ? `transcript_id: ${transcriptId}` : analysisNotice}
                </div>
              </div>
            </ConsolePanel>

            <ConsolePanel id="claims-graph" className="p-5">
              <SectionLabel eyebrow="review priorities" title="Contradictions and evidence requiring attorney attention" action={`${contradictions.length} issues`} />
              <div className="space-y-3">
                {contradictions.slice(0, 3).map((contradiction) => (
                  <div key={contradiction.title} className="rounded-lg border border-white/10 bg-[#070A0F] p-4">
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
                      {contradiction.citations.map((citation) => (
                        <span key={citation} className="rounded-md border border-white/10 bg-[#0B0F17] px-2 py-1 font-mono text-[10px] text-slate-400">
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
              eyebrow="transcript evidence viewer"
              title="Citation-linked excerpts, extracted claims, and examination relevance"
              action="highlight.mode phrase"
            />
            <EvidenceViewer excerpts={transcriptEvidence} />
          </ConsolePanel>

          <ConsolePanel id="claims" className="mt-4 p-4">
            <SectionLabel eyebrow="claims review" title="Structured witness claims from backend analysis" action={`${claims.length} claims`} />
            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#070A0F]">
              <table className="w-full text-left text-xs">
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

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <ConsolePanel id="contradiction-review" className="p-4">
              <SectionLabel eyebrow="contradiction review" title="Verified conflicts and unresolved testimony gaps" action="review.queue 3" />
              <div className="space-y-3">
                {contradictions.map((contradiction) => (
                  <div key={contradiction.title} className="rounded-lg border border-white/10 bg-[#070A0F] p-4">
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
                      {contradiction.linkedEvidence.map((evidenceId) => (
                        <span key={evidenceId} className="inline-flex items-center gap-1 rounded border border-violet-300/15 bg-violet-300/10 px-2 py-1 font-mono text-[10px] text-violet-200">
                          <Link2 className="size-3" />
                          {evidenceId}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contradiction.citations.map((citation) => (
                        <span key={citation} className="rounded border border-white/10 bg-[#111827] px-2 py-1 font-mono text-[10px] text-slate-400">
                          {citation}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ConsolePanel>

            <ConsolePanel id="cross-examination" className="p-4">
              <SectionLabel eyebrow="cross-exam strategy" title="Attorney prompt synthesis" action="targets 7" />
              <div className="space-y-3">
                {strategyCards.map((card, index) => (
                  <div key={card.objective} className="group rounded-lg border border-white/10 bg-[#070A0F] p-4 transition hover:border-sky-300/25 hover:bg-[#0B0F17]">
                    <div className="flex items-center gap-3">
                      <div className="flex size-7 items-center justify-center rounded border border-sky-300/20 bg-sky-300/10 font-mono text-[10px] text-sky-200">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="text-sm font-medium text-white">{card.objective}</div>
                      <span className={cn("ml-auto rounded-full border px-2 py-1 font-mono text-[10px]", riskBadgeTone[card.risk])}>
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
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded border border-white/10 bg-[#111827] px-2 py-1 font-mono text-[10px] text-sky-300">
                      <Target className="size-3" />
                      {card.citation}
                    </div>
                  </div>
                ))}
              </div>
            </ConsolePanel>
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
            <ConsolePanel id="courtshadow" className="p-4">
              <SectionLabel eyebrow="discourse review" title="Record context and examination posture" action="review module" />
              <div className="rounded-lg border border-violet-300/15 bg-[#070A0F] p-4">
                <div className="flex items-start gap-3">
                  <Network className="mt-0.5 size-4 text-violet-300" />
                  <div>
                    <div className="text-sm font-medium text-white">Preservation shadow detected</div>
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      The witness acknowledges broad deletion behavior while disclaiming
                      recall of specific DR DOS messages. The discourse layer marks the
                      missing-message path as an examination vector, not a legal conclusion.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-3">
                  {["retention.policy", "custodian.timeline", "backup.surface"].map((item) => (
                    <div key={item} className="rounded border border-white/10 bg-[#111827] px-3 py-2 font-mono text-[10px] text-slate-400">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-white/10 bg-[#070A0F] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                  witness profile
                </div>
                <div className="mt-2 text-sm text-white">{witnessProfile.name}</div>
                <p className="mt-2 text-xs leading-6 text-slate-500">{witnessProfile.overview}</p>
              </div>
            </ConsolePanel>

            <ConsolePanel id="evidence-trace" className="p-4">
              <SectionLabel eyebrow="evidence trace" title="Citation-grounded support spans" action="support.coverage 94%" />
              <div className="space-y-2">
                {evidenceTrace.map((evidence) => (
                  <div key={evidence.id} className="grid gap-3 rounded-lg border border-white/10 bg-[#070A0F] p-3 md:grid-cols-[160px_1fr_70px]">
                    <div>
                      <div className="font-mono text-[10px] text-slate-600">{evidence.id}</div>
                      <div className="mt-1 font-mono text-[11px] text-sky-300">{evidence.source}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-slate-500">{evidence.signal}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{evidence.excerpt}</p>
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
            <SectionLabel eyebrow="report export" title="Attorney-ready Markdown artifacts" action="export.status ready" />
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
                      <div className="mt-3 font-mono text-[10px] text-slate-300">{artifact}</div>
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
                <Button asChild className="mt-4 w-full font-mono text-xs uppercase tracking-[0.12em]">
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
