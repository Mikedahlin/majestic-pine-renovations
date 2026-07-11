import Link from "next/link";
import { UsFlagIcon } from "@/components/ui/UsFlagIcon";

export function Footer() {
  return (
    <footer className="bg-charcoal">
      <div className="border-b border-white/10 bg-[#1a1a2e] py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 px-6 lg:px-8">
          <UsFlagIcon className="animate-flag-wave h-12 w-[72px] flex-shrink-0 rounded-sm border border-white/40" />
          <span className="text-sm font-semibold uppercase tracking-widest text-warm-white">
            Proudly Made in America
          </span>
          <UsFlagIcon
            className="animate-flag-wave h-12 w-[72px] flex-shrink-0 rounded-sm border border-white/40"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="group inline-block">
              <span className="font-heading text-lg font-bold uppercase tracking-widest text-warm-white">
                Majestic Pine
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-bronze">
                Renovations
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-warm-white/60">
              Remodeling and construction for homes, cabins, and commercial
              spaces across Minnesota.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-bronze">
              Services
            </h4>
            <ul className="space-y-2">
              {[
                ["Kitchen Remodeling", "/services/kitchen-remodeling"],
                ["Bathroom Remodeling", "/services/bathroom-remodeling"],
                ["Basement Finishing", "/services/basement-finishing"],
                ["Decks & Outdoor", "/services/decks-outdoor-living"],
                ["Roofing", "/services/roofing"],
                ["Siding", "/services/siding"],
                ["Home Additions", "/services/additions"],
                ["Garage Builds", "/services/garage-builds"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-warm-white/60 transition-colors hover:text-bronze"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-bronze">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                ["Home", "/"],
                ["About Us", "/about-us"],
                ["Commercial", "/commercial-contracting-minnesota"],
                ["Services", "/services"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-warm-white/60 transition-colors hover:text-bronze"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-bronze">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-warm-white/60">
              <li>(612) 363-2614</li>
              <li>
                <a
                  href="mailto:majesticpinerenovations@gmail.com"
                  className="transition-colors hover:text-bronze"
                >
                  majesticpinerenovations@gmail.com
                </a>
              </li>
              <li>196 Carling Ave SE, Buffalo, MN 55313</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-8 text-center">
        <p className="text-xs text-warm-white/40">
          Built with modern web standards. Need a site like this for your business?
        </p>
        <a
          href="/contact"
          className="mt-1 inline-block text-xs text-bronze transition-colors hover:text-warm-white"
        >
          Talk to us about your next website project
        </a>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 pb-8 pt-8 md:flex-row lg:px-8">
        <p className="text-xs text-warm-white/50">
          Copyright {new Date().getFullYear()} Majestic Pine Renovations. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="text-xs text-warm-white/50 hover:text-bronze transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
