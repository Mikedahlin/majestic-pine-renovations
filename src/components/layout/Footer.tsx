import Link from "next/link";
import { CONTACT, FACEBOOK_URL, NAV_ITEMS } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const featuredServices = SERVICES.filter((s) => s.featured).slice(0, 4);

  return (
    <footer className="bg-charcoal text-warm-white">
      <div className="border-b border-white/10 bg-pine-green py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Ready to Build With Confidence?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-warm-white/80">
            Secure your spot on our production calendar. Connect with our team
            for an instant estimate.
          </p>
          <div className="mt-8">
            <Button href="/contact">Request Your Free Consultation</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-heading text-lg font-bold uppercase tracking-widest">
              Majestic Pine
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-bronze">
              Renovations
            </p>
            <p className="mt-4 text-sm text-warm-white/70 leading-relaxed">
              Premier residential and commercial general contracting for
              Minneapolis, Buffalo, and the Twin Cities Metro.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-bronze">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-warm-white/70 hover:text-bronze transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-bronze">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              {featuredServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-warm-white/70 hover:text-bronze transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-bronze hover:text-warm-white transition-colors"
                >
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-bronze">
              Contact
            </h3>
            <address className="mt-4 space-y-2 not-italic text-sm text-warm-white/70">
              <p>Headquarters: {CONTACT.headquarters}</p>
              <p>Service Area: {CONTACT.serviceArea}</p>
              <p>
                <a href={`tel:${CONTACT.phone.replace(/\D/g, "")}`} className="hover:text-bronze">
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-bronze">
                  {CONTACT.email}
                </a>
              </p>
              <p>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bronze"
                >
                  Facebook
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 border-t border-white/10 pt-8">
          <svg
            className="animate-flag h-6 w-8"
            viewBox="0 0 60 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="60" height="40" fill="#DC143C" />
            <rect x="0" y="4" width="60" height="4" fill="white" />
            <rect x="0" y="12" width="60" height="4" fill="white" />
            <rect width="24" height="20" fill="#002868" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((r) => (
              r % 2 === 0 && Array.from({ length: 6 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={2 + c * 4} cy={2 + r * 2} r="0.6" fill="white" />
              ))
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((r) => (
              r % 2 === 1 && Array.from({ length: 5 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={4 + c * 4} cy={2 + r * 2} r="0.6" fill="white" />
              ))
            ))}
            <rect x="0" y="20" width="60" height="4" fill="white" />
            <rect x="0" y="28" width="60" height="4" fill="white" />
            <rect x="0" y="36" width="60" height="4" fill="white" />
          </svg>
          <span className="text-xs uppercase tracking-widest text-bronze font-semibold">
            Proudly Made in America
          </span>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 pt-4 md:flex-row">
          <p className="text-xs text-warm-white/50">
            © {new Date().getFullYear()} Majestic Pine Renovations. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-warm-white/50">
            <Link href="/privacy" className="hover:text-bronze transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-bronze transition-colors">
              Terms of Service
            </Link>
            <Link href="/licensing" className="hover:text-bronze transition-colors">
              Licensing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
