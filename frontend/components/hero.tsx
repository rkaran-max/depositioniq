"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const fragments = [
  "Gates Dep. 589:4-15",
  "claim.extracted",
  "verify.conflicts",
  "cross_exam.generated",
  "citation.trace",
  "CourtShadow.enabled",
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-white/10 bg-[#070707] px-4 pt-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.14),transparent_36rem),radial-gradient(circle_at_75%_65%,rgba(99,102,241,0.08),transparent_32rem)]" />
      <div className="hero-mesh pointer-events-none absolute inset-x-[-10%] top-[18%] h-96 opacity-60" />

      <div className="absolute inset-0 overflow-hidden">
        {fragments.map((fragment, index) => (
          <motion.div
            key={fragment}
            className="absolute font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/25"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 80, opacity: [0, 0.5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 10 + index * 1.2,
              delay: index * 0.8,
              ease: "linear",
            }}
            style={{
              left: `${8 + index * 14}%`,
              top: `${18 + (index % 4) * 15}%`,
            }}
          >
            {fragment}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 py-24 lg:grid-cols-[1fr_430px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100">
            Legal reasoning agent / CourtShadow enabled
          </div>
          <h1 className="mt-8 max-w-5xl font-serif text-5xl font-normal leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
            Deposition intelligence infrastructure for litigation teams
          </h1>
          <p className="mt-6 max-w-3xl font-serif text-2xl italic leading-9 text-cyan-200 md:text-3xl">
            The agentic review layer for testimony, contradictions, and cross-examination
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
            DepositionIQ converts unstructured testimony into structured claims,
            verified contradictions, citation-grounded evidence, and attorney-ready
            examination strategy.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group font-mono text-xs uppercase tracking-[0.14em]">
              <a href="#dashboard">
                Analyze transcript
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="font-mono text-xs uppercase tracking-[0.14em]">
              <a href="#product">View product console</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative hidden rounded-2xl border border-white/10 bg-[#0B0F17]/80 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur lg:block"
        >
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <FileText className="size-3.5 text-cyan-300" />
              live.case.trace
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 font-mono text-[10px] text-emerald-200">
              active
            </span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {[
              ["ingest.transcript", "94 testimony turns"],
              ["extract.claims", "18 structured claims"],
              ["verify.conflicts", "3 contradiction candidates"],
              ["link.evidence", "4 citation spans retained"],
              ["generate.cross_exam", "7 attorney prompts"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-[#070707] p-3">
                <div className="text-cyan-200">{label}</div>
                <div className="mt-1 text-slate-500">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
