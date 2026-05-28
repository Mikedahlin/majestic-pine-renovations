import Link from "next/link";
import { CONTACT, NAV_ITEMS } from "@/lib/constants";
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
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-warm-white/50">
            © {new Date().getFullYear()} Majestic Pine Renovations. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-warm-white/50">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Licensing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
