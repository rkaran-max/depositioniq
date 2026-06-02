"use client";

import { Button } from "@/components/ui/button";

const links = [
  { label: "Product", href: "#product" },
  { label: "Security", href: "#security" },
  { label: "CourtShadow", href: "#courtshadow-product" },
  { label: "Demo", href: "#dashboard" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#070707]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <a href="#" className="flex items-center gap-3">
          <img
            src="/brand/depositioniq-favicon.svg"
            alt=""
            className="size-8 rounded-lg"
          />
          <span className="text-sm font-medium text-white">DepositionIQ</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-200"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan-300/70 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <Button asChild size="sm" className="group min-w-44 justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
          <a href="#dashboard">
            <span>Analyze transcript</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
