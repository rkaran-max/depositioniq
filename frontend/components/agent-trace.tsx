"use client";

import { motion } from "framer-motion";
import type { AgentTraceEvent } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

const traceTone = {
  ok: "bg-emerald-300 text-emerald-950",
  review: "bg-sky-300 text-sky-950",
  warn: "bg-violet-300 text-violet-950",
};

export function AgentTrace({ events }: { events: AgentTraceEvent[] }) {
  return (
    <div className="space-y-2">
      {events.map((event, index) => (
        <motion.div
          key={event.time}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * index, duration: 0.35 }}
          className="rounded-lg border border-white/10 bg-[#070A0F] p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-[10px] text-slate-500">{event.time}</div>
            <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px]", traceTone[event.status])}>
              {event.status}
            </span>
          </div>
          <div className="mt-2 font-mono text-xs text-slate-200">{event.event}</div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{event.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}
