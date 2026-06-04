"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const backgroundPages = [
  {
    citation: "Gates Dep. 589:4-15",
    title: "Email retention testimony",
    lines: ["Q. What is your practice with incoming e-mails?", "A. I delete most incoming e-mails after reading them.", "Q. Are those messages preserved elsewhere?"],
    className: "left-[4%] top-24 hidden w-[320px] -rotate-6 lg:block",
    delay: 0,
  },
  {
    citation: "Gates Dep. 590:11-22",
    title: "Preservation scope",
    lines: ["Q. Do you preserve messages that you send?", "A. Not unless I copy myself.", "Q. Would DR DOS communications be included?"],
    className: "right-[8%] top-28 hidden w-[340px] rotate-3 xl:block",
    delay: 0.8,
  },
  {
    citation: "Gates Dep. 591:2-12",
    title: "Recall limitation",
    lines: ["Q. Do you recall specific DR DOS messages?", "A. I don't recall any specific message.", "Q. Is that based on memory or records?"],
    className: "bottom-12 left-[38%] hidden w-[300px] rotate-2 lg:block",
    delay: 1.4,
  },
];

const workflowSteps = [
  {
    label: "Transcript",
    title: "Source testimony",
    detail: "Gates Dep. 589:4-15",
  },
  {
    label: "Claims",
    title: "Structured assertions",
    detail: "4 citation-backed claims",
  },
  {
    label: "Review",
    title: "Contradiction analysis",
    detail: "2 issues for attorney review",
  },
  {
    label: "Report",
    title: "Cross-exam plan",
    detail: "Attorney-ready markdown",
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

function DepositionSceneBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_28%,rgba(14,165,233,0.09),transparent_30rem),radial-gradient(circle_at_78%_12%,rgba(148,163,184,0.07),transparent_28rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070A0F] to-transparent" />

      {backgroundPages.map((page) => (
        <motion.div
          key={page.citation}
          className={`absolute rounded-xl border border-white/10 bg-white/[0.045] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.26)] backdrop-blur-sm ${page.className}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 0.5, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: page.delay },
            y: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: page.delay },
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="font-serif text-sm text-slate-200">{page.title}</div>
              <div className="mt-1 font-mono text-[10px] text-sky-200/80">{page.citation}</div>
            </div>
            <div className="rounded border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">
              exhibit
            </div>
          </div>
          <div className="space-y-2.5">
            {page.lines.map((line, index) => (
              <div key={line} className="flex gap-3">
                <span className="mt-0.5 font-mono text-[9px] text-slate-600">
                  {String(index + 4).padStart(2, "0")}
                </span>
                <span
                  className={`h-4 flex-1 rounded-sm ${
                    index === 1 ? "bg-sky-200/18" : "bg-slate-200/8"
                  }`}
                />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        className="absolute left-[58%] top-[18%] hidden size-40 rounded-full border border-sky-200/30 bg-sky-100/[0.025] shadow-[0_0_42px_rgba(56,189,248,0.10)] backdrop-blur-[1px] lg:block"
        animate={{ x: [-18, 20, -18], y: [0, 16, 0], rotate: [-4, 3, -4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-5 rounded-full border border-white/10" />
        <div className="absolute -bottom-8 right-4 h-14 w-2 rotate-[-42deg] rounded-full bg-slate-300/18" />
      </motion.div>

      <motion.div
        className="absolute left-[14%] top-[54%] hidden h-px w-[42rem] origin-left bg-gradient-to-r from-transparent via-sky-200/20 to-transparent lg:block"
        animate={{ opacity: [0.12, 0.34, 0.12], scaleX: [0.86, 1, 0.86] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070A0F] px-4 pt-24">
      <DepositionSceneBackground />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-14 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Deposition review workspace
          </div>
          <h1 className="mt-7 text-balance text-left font-serif text-5xl font-normal leading-[1.02] tracking-tight text-white md:text-7xl">
            Litigation analysis with evidence at the center
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            DepositionIQ turns transcript testimony into traceable claims,
            contradiction review, and cross-examination preparation for legal teams.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group min-w-52 justify-between font-mono text-xs uppercase tracking-[0.12em]">
              <a href="#dashboard">
                <span>Analyze Transcript</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="group min-w-56 justify-between font-mono text-xs uppercase tracking-[0.12em]">
              <a href="#contradiction-review">
                <span>Review Evidence</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="rounded-2xl border border-white/10 bg-[#0B0F17]/95 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                review packet
              </div>
              <div className="mt-1 text-sm font-medium text-white">
                Deposition analysis workflow
              </div>
            </div>
            <div className="rounded-md border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 font-mono text-[10px] text-emerald-200">
              ready
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="rounded-lg border border-white/10 bg-[#070A0F] p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                  <CheckCircle2 className="size-3.5 text-emerald-300" />
                </div>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  {step.label}
                </div>
                <div className="mt-1 text-sm text-white">{step.title}</div>
                <div className="mt-2 text-xs leading-5 text-slate-500">{step.detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-[#070A0F] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
              <FileText className="size-4 text-slate-400" />
              Transcript evidence
            </div>
            <div className="space-y-3">
              {evidenceRows.map((row) => (
                <div key={row.citation} className="grid gap-3 rounded-lg border border-white/10 bg-[#0B0F17] p-3 md:grid-cols-[132px_1fr_150px]">
                  <div className="font-mono text-[10px] text-sky-300">{row.citation}</div>
                  <div className="text-xs leading-5 text-slate-300">{row.text}</div>
                  <div className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 font-mono text-[10px] text-slate-400">
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
                  Contradiction review prioritized
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  The workspace keeps evidence excerpts, citation chips, and attorney
                  follow-up questions adjacent so reviewers can test each issue quickly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
