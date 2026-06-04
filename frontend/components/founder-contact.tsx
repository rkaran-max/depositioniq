"use client";

import { useState } from "react";
import { Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const email = "nadiya@stanford.edu";

export function FounderContact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <footer className="bg-[#070707] px-4 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-[#0B0F17] p-8 md:p-12 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300">
              Founder access
            </div>
            <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-white md:text-5xl">
              Talk to the founder
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
              For pilots, research collaborations, legal technology partnerships,
              and early access inquiries.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#070707] p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10">
                <Mail className="size-5 text-cyan-200" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  contact.email
                </div>
                <div className="mt-1 text-white">{email}</div>
              </div>
            </div>
            <Button onClick={copyEmail} className="mt-5 w-full text-sm">
              <Copy className="size-4" />
              {copied ? "Copied" : "Copy email"}
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 text-sm md:grid-cols-4">
          <div>
            <div className="text-white">DepositionIQ</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Product</div>
            <div className="mt-3 space-y-2 text-slate-500">
              <div>Features</div>
              <div>Evidence Review</div>
              <div>Demo</div>
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Contact</div>
            <div className="mt-3 text-slate-500">{email}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Index</div>
            <div className="mt-3 space-y-2 text-slate-500">
              <div>CS153 Frontier Systems</div>
              <div>© 2026 DepositionIQ</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
