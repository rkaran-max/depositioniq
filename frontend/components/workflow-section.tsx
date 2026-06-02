"use client";

import { motion } from "framer-motion";
import { FileSearch, MousePointer2 } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Transcript Intake",
    body: "Upload scanned PDFs, text transcripts, or copied testimony.",
  },
  {
    number: "02",
    title: "Evidence Traceability",
    body: "Every claim and contradiction links back to the transcript.",
  },
  {
    number: "03",
    title: "CourtShadow Layer",
    body: "Analyze discourse patterns, pressure language, framing, and credibility markers.",
  },
];

export function WorkflowSection() {
  return (
    <section id="courtshadow-product" className="border-b border-white/10 bg-[#070707] px-4 py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300">
            Universal connectivity
          </div>
          <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-white md:text-5xl">
            Universal Litigation Workflow
          </h2>
          <div className="mt-8 space-y-4">
            {features.map((feature) => (
              <div key={feature.number} className="border-l border-white/10 pl-5">
                <div className="font-mono text-[10px] text-cyan-300">{feature.number}</div>
                <div className="mt-2 text-lg text-white">{feature.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="absolute left-0 top-0 w-[86%] rounded-2xl border border-white/10 bg-[#0B0F17] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.48)]"
          >
            <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <FileSearch className="size-4 text-cyan-300" />
              deposition.parser
            </div>
            {[
              "$ parse /uploads/gates_deposition.pdf",
              "ocr.layer: ready",
              "q_a_turns: 94",
              "citations: retained",
              "status: normalized",
            ].map((line) => (
              <div key={line} className="border-t border-white/10 py-3 font-mono text-xs text-slate-400">
                {line}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30, y: 36 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="absolute bottom-0 right-0 w-[82%] rounded-2xl border border-cyan-300/15 bg-[#0A0D12] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.52)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                attorney.review.console
              </div>
              <motion.div
                animate={{ x: [0, 8, 0], y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="flex items-center gap-1 font-mono text-[10px] text-cyan-300"
              >
                <MousePointer2 className="size-3.5" />
                selecting citation
              </motion.div>
            </div>
            {[
              ["Claim", "Deletes most incoming emails"],
              ["Evidence", "Gates Dep. 589:4-15"],
              ["Issue", "Memory testimony versus deletion practice"],
              ["Next action", "Draft cross-exam objective"],
            ].map(([label, value]) => (
              <div key={label} className="mb-2 rounded-lg border border-white/10 bg-[#070707] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">{label}</div>
                <div className="mt-1 text-sm text-slate-200">{value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
