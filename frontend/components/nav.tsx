"use client";

import { Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Product", href: "#product" },
  { label: "Security", href: "#security" },
  { label: "CourtShadow", href: "#courtshadow-product" },
  { label: "Demo", href: "#dashboard" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070707]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <a href="#" className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10">
            <Gavel className="size-4 text-cyan-200" />
          </div>
          <span className="text-sm font-medium text-white">DepositionIQ</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button asChild size="sm" className="font-mono text-xs">
          <a href="#dashboard">Analyze transcript</a>
        </Button>
      </div>
    </header>
  );
}
