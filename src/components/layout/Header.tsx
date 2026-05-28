"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="group">
          <span className="font-heading text-lg font-bold uppercase tracking-widest text-warm-white">
            Majestic Pine
          </span>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-bronze">
            Renovations
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wider text-warm-white/80 transition-colors hover:text-bronze"
            >
              {item.label}
            </Link>
          ))}
          <Button href="/contact" className="!px-6 !py-3 !text-xs">
            Free Consultation
          </Button>
        </nav>

        <button
          type="button"
          className="lg:hidden text-warm-white p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          className="lg:hidden border-t border-white/10 bg-charcoal/95 px-6 py-6"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-wider text-warm-white/80 hover:text-bronze"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button href="/contact" className="mt-2 w-full text-center">
              Free Consultation
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
