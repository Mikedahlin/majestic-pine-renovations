import Link from "next/link";
import { CONTACT, NAV_ITEMS } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import { Button } from "@/components/ui/Button";

export function Footer() {
  const featuredServices = SERVICES.filter((s) => s.featured).slice(0, 4);

  return (
    <footer className="bg-charcoal text-warm-white">
      <div className="border-b border-white/10 bg-pine-green py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wide md:text-4xl">
            Ready to Talk Through the Project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-warm-white/80">
            Tell us what you want to build, repair, or remodel, and we will help
            you figure out the right next step.
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
            <p className="mt-4 text-sm leading-relaxed text-warm-white/70">
              More than 30 years of hands-on experience you can trust for
              Minnesota homes, cabins, shops, and commercial spaces.
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
                    className="text-sm text-warm-white/70 transition-colors hover:text-bronze"
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
                    className="text-sm text-warm-white/70 transition-colors hover:text-bronze"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-bronze transition-colors hover:text-warm-white"
                >
                  View All Services -&gt;
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-bronze">
              Contact
            </h3>
            <address className="mt-4 space-y-2 text-sm not-italic text-warm-white/70">
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
            Copyright {new Date().getFullYear()} Majestic Pine Renovations. All rights reserved.
          </p>
          <p className="text-xs text-warm-white/50">
            Buffalo, Minnesota | Residential and commercial construction
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-warm-white/70">
          <span
            className="relative h-4 w-6 overflow-hidden border border-white/30 bg-[repeating-linear-gradient(to_bottom,#b22234_0,#b22234_1.23px,#fff_1.23px,#fff_2.46px)]"
            aria-hidden="true"
          >
            <span className="absolute left-0 top-0 h-[54%] w-[42%] bg-[#3c3b6e]" />
          </span>
          Made in America
        </div>
      </div>
    </footer>
  );
}
