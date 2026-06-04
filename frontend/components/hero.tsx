"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  Link2,
  MessageSquareQuote,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const workflowSteps = [
  {
    label: "Transcript",
    title: "Source testimony",
    detail: "Gates Dep. 589:4-15",
  },
  {
    label: "Claims",
    title: "Citation-backed claims",
    detail: "4 extracted issues",
  },
  {
    label: "Review",
    title: "Contradiction review",
    detail: "2 attorney priorities",
  },
  {
    label: "Strategy",
    title: "Cross-exam plan",
    detail: "Questions and objectives",
  },
];

const evidenceRows = [
  {
    citation: "Gates Dep. 589:4-15",
    text: "I delete most incoming e-mails after reading them.",
    result: "Email retention claim",
  },
  {
    citation: "Gates Dep. 589:20-25",
    text: "I don't recall any specific message relating to DR DOS.",
    result: "Memory limitation",
  },
  {
    citation: "Gates Dep. 590:11-22",
    text: "I don't preserve messages that I send unless I copy myself.",
    result: "Preservation scope",
  },
];

const ribbonItems = [
  { label: "Transcript", icon: FileText, color: "text-slate-300" },
  { label: "Claims", icon: SearchCheck, color: "text-sky-300" },
  { label: "Evidence", icon: Link2, color: "text-cyan-300" },
  { label: "Contradictions", icon: ShieldAlert, color: "text-amber-300" },
  { label: "Cross-Exam", icon: MessageSquareQuote, color: "text-violet-300" },
  { label: "Report", icon: FileCheck2, color: "text-emerald-300" },
];

const backgroundTiles = [
  { label: "Extract claims", tone: "text-sky-200 border-sky-300/15 bg-sky-300/[0.055]" },
  { label: "Analyze depositions", tone: "text-slate-200 border-white/10 bg-white/[0.035]" },
  { label: "Link citations", tone: "text-cyan-200 border-cyan-300/15 bg-cyan-300/[0.05]" },
  { label: "Detect contradictions", tone: "text-amber-200 border-amber-300/18 bg-amber-300/[0.055]" },
  { label: "Build cross-exam", tone: "text-violet-200 border-violet-300/15 bg-violet-300/[0.05]" },
  { label: "Review testimony", tone: "text-slate-200 border-white/10 bg-white/[0.035]" },
  { label: "Export report", tone: "text-emerald-200 border-emerald-300/15 bg-emerald-300/[0.05]" },
  { label: "Preserve evidence", tone: "text-blue-200 border-blue-300/15 bg-blue-300/[0.05]" },
  { label: "Flag recall gaps", tone: "text-amber-200 border-amber-300/18 bg-amber-300/[0.05]" },
  { label: "Verify conflicts", tone: "text-emerald-200 border-emerald-300/15 bg-emerald-300/[0.05]" },
  { label: "Map timeline", tone: "text-cyan-200 border-cyan-300/15 bg-cyan-300/[0.045]" },
  { label: "Prepare memo", tone: "text-slate-200 border-white/10 bg-white/[0.035]" },
];

function WorkflowRibbon() {
  const doubled = [...ribbonItems, ...ribbonItems];

  return (
    <div className="pointer-events-none absolute inset-x-4 bottom-8 z-10 mx-auto hidden max-w-7xl overflow-hidden rounded-xl border border-white/10 bg-[#0B0F17]/72 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-md lg:block">
      <div className="marquee-track flex w-max gap-2">
        {doubled.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center gap-2 rounded-md border border-white/10 bg-[#070A0F]/86 px-4 py-2 text-xs text-slate-300"
            >
              <Icon className={`size-3.5 ${item.color}`} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EvidenceSurface() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(59,130,246,0.14),transparent_28rem),radial-gradient(circle_at_84%_58%,rgba(245,158,11,0.08),transparent_24rem),linear-gradient(180deg,#070A0F_0%,#05070B_76%,#070A0F_100%)]" />

      <div className="absolute inset-x-[-8%] top-[8%] h-[680px] rotate-[-3deg] opacity-70 blur-[0.2px]">
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {backgroundTiles.map((tile, index) => (
            <motion.div
              key={tile.label}
              className={`h-24 rounded-lg border px-4 py-3 text-xs shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-sm ${tile.tone}`}
              initial={{ opacity: 0.34, y: 8 }}
              animate={{
                opacity: index % 4 === 0 ? [0.34, 0.72, 0.34] : [0.26, 0.42, 0.26],
                y: index % 3 === 0 ? [8, 0, 8] : [0, -5, 0],
              }}
              transition={{ duration: 7 + (index % 5), repeat: Infinity, ease: "easeInOut", delay: index * 0.22 }}
            >
              <div className="font-mono text-[10px] text-current opacity-60">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="mt-5 font-medium text-current">{tile.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-[-10%] top-[31%] h-[360px] opacity-55">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
          role="img"
        >
          <defs>
            <linearGradient id="evidenceLink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0)" />
              <stop offset="52%" stopColor="rgba(56,189,248,0.34)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0)" />
            </linearGradient>
            <linearGradient id="contradictionStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251,191,36,0)" />
              <stop offset="50%" stopColor="rgba(251,191,36,0.42)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M-80 210 C 215 76, 442 310, 690 178 S 1080 56, 1520 206"
            fill="none"
            stroke="url(#evidenceLink)"
            strokeWidth="2.3"
            initial={{ pathLength: 0.2, pathOffset: 0 }}
            animate={{ pathLength: [0.26, 0.62, 0.26], pathOffset: [0, 0.08, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M-40 248 C 240 190, 432 232, 606 250 S 984 312, 1500 162"
            fill="none"
            stroke="url(#contradictionStroke)"
            strokeWidth="2.1"
            strokeDasharray="10 14"
            animate={{ pathLength: [0.18, 0.7, 0.18], opacity: [0.18, 0.5, 0.18] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="absolute inset-y-0 left-0 w-[58%] bg-[linear-gradient(90deg,#070A0F_0%,rgba(7,10,15,0.97)_42%,rgba(7,10,15,0.72)_74%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070A0F] to-transparent" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070A0F] px-4 pt-24">
      <EvidenceSurface />
      <WorkflowRibbon />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 pb-32 pt-20 lg:grid-cols-[minmax(0,0.88fr)_minmax(500px,1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl rounded-2xl border border-white/[0.07] bg-[#070A0F]/72 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-sm md:p-7"
        >
          <div className="inline-flex rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400">
            Deposition review workspace
          </div>
          <h1 className="mt-7 text-balance text-left font-serif text-5xl font-normal leading-[1.02] tracking-tight text-white md:text-7xl">
            Find contradictions before opposing counsel does.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            DepositionIQ turns transcript testimony into citation-backed claims,
            contradiction review, and cross-examination strategy.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group min-w-0">
              <Link href="/demo">
                <span>Analyze Transcript</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="group min-w-0">
              <Link href="/evidence-review">
                <span>Review Evidence</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="rounded-xl border border-white/10 bg-[#0B0F17]/90 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-md"
        >
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-xs text-slate-500">Review packet</div>
              <div className="mt-1 text-sm font-medium text-white">
                Deposition analysis workflow
              </div>
            </div>
            <div className="rounded-md border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-200">
              Ready
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="group rounded-md border border-white/10 bg-[#070A0F]/90 p-3 transition hover:border-slate-200/20 hover:bg-[#0D131D]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                  <CheckCircle2 className="size-3.5 text-emerald-300/80 transition group-hover:text-emerald-200" />
                </div>
                <div className="mt-4 text-xs text-slate-500">{step.label}</div>
                <div className="mt-1 text-sm text-white">{step.title}</div>
                <div className="mt-2 text-xs leading-5 text-slate-500">{step.detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-[#070A0F]/92 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
              <FileText className="size-4 text-slate-400" />
              Transcript Evidence
            </div>
            <div className="space-y-3">
              {evidenceRows.map((row) => (
                <div key={row.citation} className="group grid gap-3 rounded-md border border-white/10 bg-[#0B0F17] p-3 transition hover:border-slate-200/20 hover:bg-[#101722] md:grid-cols-[132px_1fr_150px]">
                  <div className="font-mono text-[10px] text-sky-300">{row.citation}</div>
                  <div className="text-xs leading-5 text-slate-300">{row.text}</div>
                  <div className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 text-[11px] text-slate-400 transition group-hover:border-sky-200/20 group-hover:text-slate-200">
                    {row.result}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-4 text-amber-200" />
              <div>
                <div className="text-sm font-medium text-white">
                  Contradiction Review Prioritized
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Evidence excerpts, citation chips, and follow-up questions stay
                  adjacent so reviewers can test each issue quickly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
