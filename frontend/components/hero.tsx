"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileArchive,
  FileCheck2,
  FileText,
  Link2,
  MessageSquareQuote,
  SearchCheck,
  ShieldAlert,
  UploadCloud,
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

const backgroundTiles = [
  { label: "Transcript Intake", icon: FileText, accent: "bg-slate-300", tone: "text-slate-200 border-white/10 bg-white/[0.04] hover:border-slate-200/25", x: "44%", y: "10%", width: "170px" },
  { label: "Audio Upload", icon: UploadCloud, accent: "bg-blue-300", tone: "text-blue-200 border-blue-300/15 bg-blue-300/[0.045] hover:border-blue-300/35", x: "68%", y: "8%", width: "154px" },
  { label: "PDF Ingestion", icon: FileArchive, accent: "bg-cyan-300", tone: "text-cyan-200 border-cyan-300/15 bg-cyan-300/[0.045] hover:border-cyan-300/35", x: "82%", y: "16%", width: "150px" },
  { label: "Claim Extraction", icon: SearchCheck, accent: "bg-sky-300", tone: "text-sky-200 border-sky-300/15 bg-sky-300/[0.055] hover:border-sky-300/35", x: "57%", y: "26%", width: "172px" },
  { label: "Citation Linking", icon: Link2, accent: "bg-cyan-300", tone: "text-cyan-200 border-cyan-300/15 bg-cyan-300/[0.055] hover:border-cyan-300/35", x: "75%", y: "31%", width: "164px" },
  { label: "Evidence Trace", icon: Link2, accent: "bg-cyan-300", tone: "text-cyan-200 border-cyan-300/15 bg-cyan-300/[0.045] hover:border-cyan-300/35", x: "47%", y: "48%", width: "158px" },
  { label: "Contradiction Review", icon: ShieldAlert, accent: "bg-amber-300", tone: "text-amber-200 border-amber-300/18 bg-amber-300/[0.055] hover:border-amber-300/40", x: "65%", y: "52%", width: "190px" },
  { label: "Recall Gaps", icon: MessageSquareQuote, accent: "bg-amber-300", tone: "text-amber-200 border-amber-300/18 bg-amber-300/[0.045] hover:border-amber-300/40", x: "84%", y: "48%", width: "148px" },
  { label: "Preservation Issues", icon: ShieldAlert, accent: "bg-amber-300", tone: "text-amber-200 border-amber-300/18 bg-amber-300/[0.05] hover:border-amber-300/40", x: "52%", y: "68%", width: "184px" },
  { label: "Cross-Exam Strategy", icon: MessageSquareQuote, accent: "bg-violet-300", tone: "text-violet-200 border-violet-300/15 bg-violet-300/[0.055] hover:border-violet-300/35", x: "74%", y: "70%", width: "190px" },
  { label: "Attorney Review", icon: CheckCircle2, accent: "bg-emerald-300", tone: "text-emerald-200 border-emerald-300/15 bg-emerald-300/[0.05] hover:border-emerald-300/35", x: "88%", y: "66%", width: "166px" },
  { label: "Report Export", icon: FileCheck2, accent: "bg-emerald-300", tone: "text-emerald-200 border-emerald-300/15 bg-emerald-300/[0.05] hover:border-emerald-300/35", x: "69%", y: "86%", width: "156px" },
];

const ribbonItems = [
  { label: "Transcript", icon: FileText, color: "text-slate-300" },
  { label: "Audio", icon: UploadCloud, color: "text-blue-300" },
  { label: "PDF", icon: FileArchive, color: "text-cyan-300" },
  { label: "Claims", icon: SearchCheck, color: "text-sky-300" },
  { label: "Evidence", icon: Link2, color: "text-cyan-300" },
  { label: "Citations", icon: Link2, color: "text-cyan-300" },
  { label: "Contradictions", icon: ShieldAlert, color: "text-amber-300" },
  { label: "Recall Gaps", icon: MessageSquareQuote, color: "text-amber-300" },
  { label: "Cross-Exam", icon: MessageSquareQuote, color: "text-violet-300" },
  { label: "Report", icon: FileCheck2, color: "text-emerald-300" },
  { label: "Attorney Review", icon: CheckCircle2, color: "text-emerald-300" },
];

function WorkflowRibbon() {
  const doubled = [...ribbonItems, ...ribbonItems];

  return (
    <div className="relative z-10 mx-auto -mt-14 mb-16 hidden max-w-7xl overflow-hidden rounded-xl border border-white/10 bg-[#0B0F17]/82 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-md lg:block">
      <div className="marquee-track flex w-max gap-2">
        {doubled.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center gap-2 rounded-md border border-white/10 bg-[#070A0F]/88 px-4 py-2 text-xs text-slate-300"
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
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const isActive = Boolean(activeTile);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(59,130,246,0.16),transparent_28rem),radial-gradient(circle_at_86%_58%,rgba(245,158,11,0.09),transparent_24rem),linear-gradient(180deg,#070A0F_0%,#05070B_76%,#070A0F_100%)]" />

      <div className="pointer-events-none absolute right-[-5%] top-[5%] h-[760px] w-[68%]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 900 760"
          preserveAspectRatio="none"
          role="img"
        >
          <defs>
            <linearGradient id="evidenceLink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0)" />
              <stop offset="52%" stopColor="rgba(56,189,248,0.42)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0)" />
            </linearGradient>
            <linearGradient id="contradictionStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251,191,36,0)" />
              <stop offset="50%" stopColor="rgba(251,191,36,0.50)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0)" />
            </linearGradient>
            <linearGradient id="reviewStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(167,139,250,0)" />
              <stop offset="48%" stopColor="rgba(167,139,250,0.42)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0.12)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M116 120 C 220 190, 288 214, 356 276 S 490 368, 590 358"
            fill="none"
            stroke="url(#evidenceLink)"
            strokeWidth="1.8"
            initial={{ pathLength: 0.2, pathOffset: 0 }}
            animate={{ pathLength: [0.24, 0.78, 0.24], pathOffset: [0, 0.06, 0], opacity: isActive ? 0.72 : 0.42 }}
            transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M358 278 C 430 356, 482 405, 535 500 S 650 598, 706 612"
            fill="none"
            stroke="url(#contradictionStroke)"
            strokeWidth="1.9"
            strokeDasharray="10 14"
            animate={{ pathLength: [0.18, 0.72, 0.18], opacity: isActive ? [0.4, 0.72, 0.4] : [0.22, 0.52, 0.22] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M202 54 C 152 112, 120 164, 130 220 S 272 352, 286 476"
            fill="none"
            stroke="url(#evidenceLink)"
            strokeWidth="1.35"
            animate={{ pathLength: [0.18, 0.66, 0.18], opacity: isActive ? [0.32, 0.62, 0.32] : [0.14, 0.34, 0.14] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M280 602 C 376 628, 510 658, 620 620 S 730 570, 795 525"
            fill="none"
            stroke="url(#reviewStroke)"
            strokeWidth="1.6"
            animate={{ pathLength: [0.2, 0.82, 0.2], opacity: isActive ? [0.34, 0.68, 0.34] : [0.16, 0.42, 0.16] }}
            transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <motion.div
        className="pointer-events-auto absolute inset-0"
        animate={{ x: [-5, 5, -5] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      >
        {backgroundTiles.map((tile, index) => (
          <motion.div
            key={tile.label}
            onHoverStart={() => setActiveTile(tile.label)}
            onHoverEnd={() => setActiveTile(null)}
            whileHover={{
              opacity: 0.96,
              y: -4,
              transition: { duration: 0.18 },
            }}
            className={`group/tile absolute hidden h-28 overflow-hidden rounded-lg border px-4 py-3 text-xs shadow-[0_18px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm transition-colors md:block ${tile.tone}`}
            style={{ left: tile.x, top: tile.y, width: tile.width }}
            initial={{ opacity: 0.42, y: 8 }}
            animate={{
              opacity: activeTile === tile.label ? 0.96 : index % 4 === 0 ? [0.48, 0.74, 0.48] : [0.34, 0.54, 0.34],
              y: activeTile === tile.label ? -4 : index % 3 === 0 ? [8, 0, 8] : [0, -4, 0],
            }}
            transition={{ duration: 7 + (index % 5), repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
          >
            <div className={`absolute inset-x-0 top-0 h-0.5 opacity-40 transition-opacity group-hover/tile:opacity-95 ${tile.accent}`} />
            <div className="flex items-center justify-between">
              <tile.icon className="size-3.5 opacity-70 transition-opacity group-hover/tile:opacity-100" />
              <span className="font-mono text-[10px] text-current opacity-45">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-7 font-medium text-current">{tile.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[62%] bg-[linear-gradient(90deg,#070A0F_0%,rgba(7,10,15,0.985)_46%,rgba(7,10,15,0.80)_76%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070A0F] to-transparent" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070A0F] px-4 pt-24">
      <EvidenceSurface />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 pb-24 pt-20 lg:grid-cols-[minmax(0,0.88fr)_minmax(500px,1fr)]">
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
      <WorkflowRibbon />
    </section>
  );
}
