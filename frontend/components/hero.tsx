"use client";

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

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070A0F] px-4 pt-24">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_28%_0%,rgba(56,189,248,0.08),transparent_34rem)]" />

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
