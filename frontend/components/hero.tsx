"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, ShieldAlert } from "lucide-react";
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

function EvidenceSurface() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(56,189,248,0.12),transparent_34rem),linear-gradient(180deg,rgba(7,10,15,0.18),#070A0F_78%)]" />
      <div className="absolute inset-x-[-8%] top-[11%] h-[620px] opacity-90">
        <div className="absolute inset-0 rounded-[4rem] border border-white/[0.06] bg-[#0B0F17]/45 shadow-[0_60px_180px_rgba(0,0,0,0.55)]" />
        <div className="deposition-record-layer absolute inset-0 rounded-[4rem] opacity-45" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 620"
          preserveAspectRatio="none"
          role="img"
        >
          <defs>
            <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0)" />
              <stop offset="42%" stopColor="rgba(56,189,248,0.42)" />
              <stop offset="72%" stopColor="rgba(148,163,184,0.28)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0)" />
            </linearGradient>
            <linearGradient id="amberStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251,191,36,0)" />
              <stop offset="55%" stopColor="rgba(251,191,36,0.42)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0)" />
            </linearGradient>
            <pattern id="documentTexture" width="84" height="42" patternUnits="userSpaceOnUse">
              <path d="M0 41.5H84" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
              <path d="M18 0V42" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="1440" height="620" fill="url(#documentTexture)" opacity="0.32" />

          {[0, 1, 2, 3, 4].map((offset) => (
            <motion.path
              key={offset}
              d={`M-80 ${235 + offset * 42} C 210 ${130 + offset * 18}, 405 ${365 - offset * 22}, 680 ${245 + offset * 28} S 1100 ${150 + offset * 42}, 1520 ${255 + offset * 24}`}
              fill="none"
              stroke="url(#waveStroke)"
              strokeWidth={offset === 2 ? 2.2 : 1.2}
              opacity={offset === 2 ? 0.76 : 0.38}
              initial={{ pathLength: 0.2, pathOffset: 0 }}
              animate={{ pathLength: [0.26, 0.52, 0.26], pathOffset: [0, 0.08, 0] }}
              transition={{ duration: 10 + offset, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          <motion.path
            d="M285 398 C 470 312, 542 304, 640 348 S 820 452, 1000 316"
            fill="none"
            stroke="url(#amberStroke)"
            strokeWidth="2"
            strokeDasharray="8 12"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.76, 0.2] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {[
            [285, 398, "589:4"],
            [640, 348, "590:11"],
            [1000, 316, "591:2"],
            [780, 222, "claim"],
            [920, 420, "cross"],
          ].map(([cx, cy, label], index) => (
            <g key={`${cx}-${cy}-${label}`}>
              <motion.circle
                cx={cx}
                cy={cy}
                r={index === 1 ? 8 : 5}
                fill={index === 1 ? "rgba(251,191,36,0.38)" : "rgba(56,189,248,0.32)"}
                animate={{ r: index === 1 ? [8, 13, 8] : [5, 8, 5], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 4.5 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
              />
              <text x={Number(cx) + 16} y={Number(cy) + 4} fill="rgba(203,213,225,0.42)" fontSize="12" fontFamily="ui-monospace, SFMono-Regular">
                {label}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070A0F] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#070A0F] to-transparent" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070A0F] px-4 pt-24">
      <EvidenceSurface />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-14 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
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
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group min-w-48 justify-between">
              <Link href="/demo">
                <span>Analyze Transcript</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="group min-w-44 justify-between">
              <Link href="/evidence-review">
                <span>Review Evidence</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="rounded-2xl border border-white/10 bg-[#0B0F17]/88 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-md"
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
              <div key={step.label} className="group rounded-lg border border-white/10 bg-[#070A0F]/90 p-3 transition hover:border-sky-200/20 hover:bg-[#0D131D]">
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

          <div className="mt-5 rounded-xl border border-white/10 bg-[#070A0F]/92 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
              <FileText className="size-4 text-slate-400" />
              Transcript Evidence
            </div>
            <div className="space-y-3">
              {evidenceRows.map((row) => (
                <div key={row.citation} className="group grid gap-3 rounded-lg border border-white/10 bg-[#0B0F17] p-3 transition hover:border-sky-200/25 hover:bg-[#101722] md:grid-cols-[132px_1fr_150px]">
                  <div className="font-mono text-[10px] text-sky-300">{row.citation}</div>
                  <div className="text-xs leading-5 text-slate-300">{row.text}</div>
                  <div className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 text-[11px] text-slate-400 transition group-hover:border-sky-200/20 group-hover:text-slate-200">
                    {row.result}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
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
