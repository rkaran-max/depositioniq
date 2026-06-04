"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileText } from "lucide-react";

const consoleRows = [
  ["Transcript intake", "PDF and text transcripts"],
  ["Evidence extraction", "Citation-backed claims"],
  ["Contradiction review", "Attorney review queue"],
  ["Report export", "Markdown case summary"],
];

const features = [
  {
    number: "01",
    title: "Citation-Grounded Reasoning",
    body: "Every extracted claim and contradiction remains tied to the source transcript span.",
  },
  {
    number: "02",
    title: "Verified Contradiction Review",
    body: "The system distinguishes memory gaps, factual tension, and follow-up needs.",
  },
  {
    number: "03",
    title: "Attorney-Ready Cross-Exam Strategy",
    body: "Outputs become objectives, primary questions, follow-ups, and attorney notes.",
  },
];

export function ProductConsole() {
  return (
    <section id="product" className="border-b border-white/10 bg-[#070707] px-4 py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-[#0B0F17] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <FileText className="size-4 text-slate-400" />
              analysis workspace
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-slate-400">
              evidence review
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {consoleRows.map(([label, value], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                className="rounded-lg border border-white/10 bg-[#070707] p-4"
              >
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                  {value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
            Review workflow
          </div>
          <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-white md:text-5xl">
            Deterministic Evidence Review
          </h2>
          <div className="mt-8 space-y-4">
            {features.map((feature) => (
              <div key={feature.number} className="rounded-xl border border-white/10 bg-[#0A0D12] p-5">
                <div className="font-mono text-[10px] text-slate-500">{feature.number}</div>
                <div className="mt-2 text-lg text-white">{feature.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
