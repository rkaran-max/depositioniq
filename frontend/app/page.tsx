"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Code2,
  FileText,
  GitBranch,
  Link2,
  Lock,
  Network,
  Search,
  ShieldAlert,
  Target,
  Terminal,
  UploadCloud,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  agentTrace,
  claimRelationshipEdges,
  claimRelationshipNodes,
  contradictions,
  depositionMetrics,
  evidenceTrace,
  lawyerWorkflow,
  pipelineStages,
  reportArtifacts,
  sampleTranscript,
  strategyCards,
  transcriptEvidence,
  witnessProfile,
} from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

const statusTone = {
  complete: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  active: "border-sky-300/25 bg-sky-300/10 text-sky-200",
  queued: "border-slate-300/15 bg-slate-300/10 text-slate-300",
};

const traceTone = {
  ok: "bg-emerald-300 text-emerald-950",
  review: "bg-sky-300 text-sky-950",
  warn: "bg-violet-300 text-violet-950",
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
        "relative overflow-hidden rounded-xl border border-white/10 bg-[#0B0F17]/90 shadow-[0_24px_90px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 scanline-overlay opacity-[0.025]" />
      {children}
    </motion.section>
  );
}

function HighlightedTranscript({
  text,
  highlights,
}: {
  text: string;
  highlights: string[];
}) {
  const escaped = highlights.map((phrase) =>
    phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));

  return (
    <p className="font-mono text-xs leading-6 text-slate-300">
      {parts.map((part, index) => {
        const isHighlighted = highlights.some(
          (phrase) => phrase.toLowerCase() === part.toLowerCase(),
        );
        return isHighlighted ? (
          <mark
            key={`${part}-${index}`}
            className="rounded border border-sky-300/20 bg-sky-300/10 px-1 py-0.5 text-sky-100"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </p>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070A0F] text-slate-100">
      <div className="pointer-events-none absolute inset-0 noise-overlay opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[1540px] gap-4 p-4">
        <Sidebar />

        <section className="min-w-0 flex-1">
          <header className="sticky top-4 z-30 mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#070A0F]/85 p-2.5 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#0B0F17] px-3 py-2">
              <Search className="size-3.5 text-slate-500" />
              <Input
                className="h-6 border-0 bg-transparent p-0 font-mono text-xs text-slate-300 placeholder:text-slate-600 focus-visible:ring-0"
                placeholder="cmd+k / search testimony, citations, contradictions, vectors"
              />
            </div>
            <Badge variant="slate" className="hidden font-mono uppercase tracking-[0.16em] md:inline-flex">
              build 0.4.2
            </Badge>
            <Button variant="secondary" size="sm" className="font-mono text-xs">
              <Terminal className="size-3.5" />
              trace
            </Button>
          </header>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_430px]">
            <motion.div
              {...panelMotion}
              id="overview"
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F17]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:p-8"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
              <div className="absolute right-8 top-8 hidden rounded-lg border border-white/10 bg-[#070A0F]/80 px-3 py-2 font-mono text-[10px] text-slate-500 lg:block">
                case.kernel / microsoft-drdos-retention
              </div>
              <Badge variant="green" className="font-mono uppercase tracking-[0.18em]">
                <motion.span
                  className="mr-2 size-1.5 rounded-full bg-emerald-300"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                />
                Legal reasoning agent / active
              </Badge>

              <div className="mt-10 max-w-3xl">
                <h1 className="text-balance text-4xl font-medium tracking-tight text-white md:text-6xl">
                  Deposition intelligence for litigation teams
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
                <Button size="lg" className="font-mono text-xs uppercase tracking-[0.12em]">
                  Analyze Transcript
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="secondary" size="lg" className="font-mono text-xs uppercase tracking-[0.12em]">
                  View Sample Case
                </Button>
              </div>
            </motion.div>

            <ConsolePanel className="p-4">
              <SectionLabel
                eyebrow="agent trace"
                title="Reasoning event stream"
                action="live / deterministic fallback"
              />
              <div className="space-y-2">
                {agentTrace.map((event, index) => (
                  <motion.div
                    key={event.time}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * index, duration: 0.35 }}
                    className="rounded-lg border border-white/10 bg-[#070A0F] p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-mono text-[10px] text-slate-500">{event.time}</div>
                      <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px]", traceTone[event.status])}>
                        {event.status}
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-xs text-slate-200">{event.event}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{event.detail}</p>
                  </motion.div>
                ))}
              </div>
            </ConsolePanel>
          </section>

          <ConsolePanel id="agent-pipeline" className="mt-4 p-4">
            <SectionLabel
              eyebrow="agent pipeline"
              title="ingest.transcript -> segment.testimony -> extract.claims -> verify.conflicts -> generate.cross_exam"
              action="pipeline.latency 1.8s"
            />
            <div className="grid gap-2 lg:grid-cols-5">
              {pipelineStages.map((stage, index) => (
                <div key={stage.id} className="relative rounded-lg border border-white/10 bg-[#070A0F] p-3">
                  {index < pipelineStages.length - 1 ? (
                    <div className="absolute -right-3 top-1/2 hidden h-px w-5 bg-sky-300/30 lg:block" />
                  ) : null}
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

          <ConsolePanel id="lawyer-workflow" className="mt-4 p-4">
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

          <section className="mt-4 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <ConsolePanel id="live-analysis-console" className="p-4">
              <SectionLabel eyebrow="live analysis console" title="Transcript input / PDF ingestion" action="source.mode demo" />
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
                  defaultValue={sampleTranscript}
                />
              </div>
            </ConsolePanel>

            <ConsolePanel id="claims-graph" className="p-4">
              <SectionLabel eyebrow="claim relationship map" title="Legal topics, risk, and citation-linked relationships" action="map.mode evidence" />
              <div className="grid gap-3 lg:grid-cols-[0.55fr_0.45fr]">
                <div className="space-y-2">
                  {claimRelationshipNodes.map((node) => (
                    <div key={node.id} className="rounded-lg border border-white/10 bg-[#070A0F] p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                            topic.node
                          </div>
                          <div className="mt-1 text-sm font-medium text-white">{node.topic}</div>
                        </div>
                        <span className={cn("rounded-full border px-2 py-1 font-mono text-[10px]", riskBadgeTone[node.risk])}>
                          {node.risk} risk
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded border border-white/10 bg-[#111827] px-2 py-1.5">
                          <div className="font-mono text-[10px] text-slate-600">claims</div>
                          <div className="text-sm text-slate-200">{node.claimCount}</div>
                        </div>
                        <div className="rounded border border-white/10 bg-[#111827] px-2 py-1.5">
                          <div className="font-mono text-[10px] text-slate-600">contradictions</div>
                          <div className="text-sm text-slate-200">{node.linkedContradictions}</div>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-500">{node.attorneyUse}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-white/10 bg-[#070A0F] p-3">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                    <GitBranch className="size-3.5" />
                    relationship.edges
                  </div>
                  <div className="space-y-2">
                    {claimRelationshipEdges.map((edge) => (
                      <div key={`${edge.from}-${edge.to}`} className="rounded-lg border border-white/10 bg-[#111827] p-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-slate-200">{edge.from}</span>
                          <span className="rounded border border-sky-300/20 bg-sky-300/10 px-2 py-0.5 font-mono text-[10px] text-sky-200">
                            {edge.relationship}
                          </span>
                          <span className="text-slate-200">{edge.to}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {edge.citations.map((citation) => (
                            <span key={citation} className="rounded border border-white/10 bg-[#070A0F] px-2 py-1 font-mono text-[10px] text-slate-400">
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ConsolePanel>
          </section>

          <ConsolePanel id="transcript-evidence-viewer" className="mt-4 p-4">
            <SectionLabel
              eyebrow="transcript evidence viewer"
              title="Citation-linked excerpts, extracted claims, and examination relevance"
              action="highlight.mode phrase"
            />
            <div className="grid gap-3 lg:grid-cols-2">
              {transcriptEvidence.map((excerpt) => (
                <div key={excerpt.id} className="rounded-lg border border-white/10 bg-[#070A0F] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BookOpenText className="size-4 text-sky-300" />
                      <div className="font-mono text-[11px] text-sky-300">{excerpt.citation}</div>
                    </div>
                    <span className={cn("rounded-full border px-2 py-1 font-mono text-[10px]", riskBadgeTone[excerpt.crossExamRelevance])}>
                      {excerpt.crossExamRelevance} exam relevance
                    </span>
                  </div>
                  <div className="mt-4 rounded-lg border border-white/10 bg-[#111827] p-3">
                    <HighlightedTranscript text={excerpt.text} highlights={excerpt.highlights} />
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <div className="rounded border border-white/10 bg-[#0B0F17] p-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                        extracted claim
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{excerpt.extractedClaim}</p>
                    </div>
                    <div className="rounded border border-white/10 bg-[#0B0F17] p-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                        linked issue
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {excerpt.relatedContradiction ?? "No contradiction currently linked"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
              <SectionLabel eyebrow="courtshadow discourse layer" title="Record-shadow and adversarial posture analysis" action="preview.module" />
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
                  Mock-backed frontend with production-shaped artifacts ready for backend integration.
                </p>
                <Button className="mt-4 w-full font-mono text-xs uppercase tracking-[0.12em]">
                  Export Report
                </Button>
              </div>
            </div>
          </ConsolePanel>
        </section>
      </div>
    </main>
  );
}
