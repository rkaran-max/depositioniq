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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_24%,rgba(56,189,248,0.10),transparent_30rem),linear-gradient(180deg,rgba(7,10,15,0.04),#070A0F_82%)]" />
      <div className="absolute inset-x-[-6%] top-[10%] h-[660px] opacity-95">
        <div className="absolute inset-0 rounded-[3rem] border border-white/[0.055] bg-[#0B0F17]/50 shadow-[0_60px_180px_rgba(0,0,0,0.52)]" />
        <div className="deposition-record-layer absolute inset-0 rounded-[3rem] opacity-30" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 660"
          preserveAspectRatio="none"
          role="img"
        >
          <defs>
            <linearGradient id="documentFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(15,23,42,0.88)" />
              <stop offset="100%" stopColor="rgba(7,10,15,0.74)" />
            </linearGradient>
            <linearGradient id="evidenceLink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.05)" />
              <stop offset="48%" stopColor="rgba(56,189,248,0.52)" />
              <stop offset="100%" stopColor="rgba(148,163,184,0.08)" />
            </linearGradient>
            <linearGradient id="contradictionStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251,191,36,0.10)" />
              <stop offset="50%" stopColor="rgba(251,191,36,0.58)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0.10)" />
            </linearGradient>
            <pattern id="documentTexture" width="96" height="44" patternUnits="userSpaceOnUse">
              <path d="M0 43.5H96" stroke="rgba(148,163,184,0.09)" strokeWidth="1" />
              <path d="M24 0V44" stroke="rgba(148,163,184,0.055)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="1440" height="660" fill="url(#documentTexture)" opacity="0.26" />

          <g opacity="0.92">
            <path d="M152 118h424c28 0 48 20 48 48v360c0 28-20 48-48 48H152c-28 0-48-20-48-48V166c0-28 20-48 48-48Z" fill="url(#documentFill)" stroke="rgba(255,255,255,0.10)" />
            <path d="M846 92h438c30 0 52 22 52 52v382c0 30-22 52-52 52H846c-30 0-52-22-52-52V144c0-30 22-52 52-52Z" fill="url(#documentFill)" stroke="rgba(255,255,255,0.10)" />
            <path d="M246 164h286M246 206h238M246 248h300M246 290h216M246 374h272M246 416h238M246 458h300" stroke="rgba(203,213,225,0.18)" strokeWidth="9" strokeLinecap="round" />
            <path d="M896 150h284M896 192h226M896 234h312M896 318h288M896 360h220M896 444h312M896 486h246" stroke="rgba(203,213,225,0.16)" strokeWidth="9" strokeLinecap="round" />
            <path d="M194 164h24M194 206h24M194 248h24M194 290h24M194 374h24M194 416h24M194 458h24M844 150h24M844 192h24M844 234h24M844 318h24M844 360h24M844 444h24M844 486h24" stroke="rgba(125,211,252,0.28)" strokeWidth="5" strokeLinecap="round" />
          </g>

          <motion.rect
            x="226"
            y="354"
            width="344"
            height="42"
            rx="7"
            fill="rgba(251,191,36,0.075)"
            stroke="rgba(251,191,36,0.24)"
            animate={{ opacity: [0.48, 0.86, 0.48] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect
            x="876"
            y="424"
            width="378"
            height="42"
            rx="7"
            fill="rgba(56,189,248,0.065)"
            stroke="rgba(56,189,248,0.22)"
            animate={{ opacity: [0.42, 0.78, 0.42] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.path
            d="M570 375 C 688 330, 750 314, 876 445"
            fill="none"
            stroke="url(#contradictionStroke)"
            strokeWidth="2"
            strokeDasharray="10 14"
            initial={{ pathLength: 0.15, opacity: 0.26 }}
            animate={{ pathLength: [0.32, 0.82, 0.32], opacity: [0.32, 0.72, 0.32] }}
            transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M624 255 C 710 246, 744 248, 794 212"
            fill="none"
            stroke="url(#evidenceLink)"
            strokeWidth="1.4"
            initial={{ pathLength: 0.18, opacity: 0.18 }}
            animate={{ pathLength: [0.22, 0.72, 0.22], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect
            x="82"
            y="104"
            width="1278"
            height="2"
            fill="rgba(226,232,240,0.18)"
            animate={{ y: [104, 540, 104], opacity: [0.08, 0.22, 0.08] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
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

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 py-20 lg:grid-cols-[minmax(0,0.88fr)_minmax(500px,1fr)]">
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
