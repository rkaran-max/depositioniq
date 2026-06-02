"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const fragments = [
  "Gates Dep. 589:4-15",
  "590:11-22",
  "transcript.ingested",
  "claims.extracted",
  "contradiction.verified",
  "evidence.linked",
  "cross_exam.generated",
  "courtshadow.enabled",
  "report.exported",
];

const transcriptLines = [
  "Q. Did you preserve DR DOS-related messages?",
  "A. I delete most incoming e-mails after reading them.",
  "Q. Do you recall any specific DR DOS message?",
  "A. I don't recall any specific message.",
  "Q. Did you preserve messages that you sent?",
  "A. I don't preserve messages that I send unless I copy myself.",
];

const traceRows = [
  ["transcript.ingested", "94 testimony turns"],
  ["claims.extracted", "18 structured claims"],
  ["contradiction.verified", "2 verified issues"],
  ["evidence.linked", "4 citation spans retained"],
  ["cross_exam.generated", "7 attorney prompts"],
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b border-white/10 bg-[#070707] px-4 pt-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.032)_1px,transparent_1px)] bg-[size:44px_44px] opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_32%,rgba(34,211,238,0.11),transparent_28rem),linear-gradient(90deg,rgba(7,7,7,0.25),rgba(7,7,7,0.72)_72%)]" />
      <div className="deposition-record-layer pointer-events-none absolute inset-0 opacity-35" />

      <div className="absolute inset-0 overflow-hidden">
        {fragments.map((fragment, index) => (
          <motion.div
            key={fragment}
            className="absolute font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-200/20"
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 120, opacity: [0, 0.42, 0] }}
            transition={{
              repeat: Infinity,
              duration: 13 + index * 1.05,
              delay: index * 0.65,
              ease: "linear",
            }}
            style={{
              left: `${4 + (index % 5) * 21}%`,
              top: `${16 + (index % 6) * 12}%`,
            }}
          >
            {fragment}
          </motion.div>
        ))}
        {transcriptLines.map((line, index) => (
          <motion.div
            key={line}
            className="absolute max-w-[520px] font-mono text-[11px] leading-6 text-slate-400/16"
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: -32, opacity: [0, 0.55, 0] }}
            transition={{
              repeat: Infinity,
              duration: 18 + index * 1.5,
              delay: index * 1.3,
              ease: "easeInOut",
            }}
            style={{
              right: `${2 + (index % 3) * 15}%`,
              top: `${24 + index * 10}%`,
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      <svg
        className="pointer-events-none absolute right-[4%] top-[18%] hidden h-[520px] w-[520px] opacity-45 lg:block"
        viewBox="0 0 520 520"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M120 144L252 216L392 132M252 216L332 338M252 216L150 370"
          stroke="#22D3EE"
          strokeOpacity="0.22"
          strokeWidth="1"
          animate={{ pathLength: [0.25, 1, 0.25], opacity: [0.15, 0.4, 0.15] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />
        {[
          [120, 144, "589:4-15"],
          [252, 216, "claim"],
          [392, 132, "590:11-22"],
          [332, 338, "conflict"],
          [150, 370, "cross-exam"],
        ].map(([cx, cy, label], index) => (
          <g key={label}>
            <motion.circle
              cx={cx}
              cy={cy}
              r="5"
              fill="#22D3EE"
              animate={{ opacity: [0.3, 0.85, 0.3], scale: [1, 1.24, 1] }}
              transition={{ repeat: Infinity, duration: 3.2, delay: index * 0.35 }}
            />
            <text
              x={Number(cx) + 12}
              y={Number(cy) + 4}
              fill="#67E8F9"
              fillOpacity="0.42"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="10"
              letterSpacing="1.2"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 py-24 lg:grid-cols-[minmax(0,0.92fr)_460px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            Legal reasoning agent / CourtShadow enabled
          </div>
          <h1 className="mt-8 max-w-5xl text-left font-serif text-5xl font-normal leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
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
            <Button asChild size="lg" className="group min-w-56 justify-between font-mono text-xs uppercase tracking-[0.14em]">
              <a href="#dashboard">
                <span>Analyze Transcript</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg" className="group min-w-60 justify-between font-mono text-xs uppercase tracking-[0.14em]">
              <a href="#product">
                <span>View Product Console</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative hidden rounded-xl border border-white/10 bg-[#0B0F17]/82 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur lg:block"
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
            {traceRows.map(([label, value], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.42, delay: 0.3 + index * 0.08 }}
                className="rounded-lg border border-white/10 bg-[#070707] p-3 transition hover:border-cyan-300/20"
              >
                <div className="text-cyan-200">{label}</div>
                <div className="mt-1 text-slate-500">{value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
