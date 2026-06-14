import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeadForm } from "@/components/ui/LeadForm";
import { ContactChatbot } from "@/components/ui/ContactChatbot";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { contactPageSchema } from "@/lib/schema";
import { CONTACT, FACEBOOK_URL } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata: Metadata = buildMetadata(PAGE_META.contact);

export default function ContactPage() {
  return (
    <>
      <SchemaScript data={contactPageSchema()} />

      <HeroSection
        title="Initiate Your Project."
        backgroundClass="bg-cover bg-center"
        style={{ backgroundImage: `url('${SITE_IMAGES.contactHero}')` }}
        fullScreen={false}
      />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <FadeInUp>
                <SectionHeading title="Contact Information" />
                <address className="space-y-4 not-italic text-concrete">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-pine-green">
                      Headquarters
                    </p>
                    <p className="mt-1">
                      {CONTACT.streetAddress}
                      <br />
                      {CONTACT.headquarters}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-pine-green">
                      Service Area
                    </p>
                    <p className="mt-1">{CONTACT.serviceArea}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-pine-green">
                      Phone
                    </p>
                    <p className="mt-1">
                      <a
                        href={`tel:${CONTACT.phone.replace(/\D/g, "")}`}
                        className="hover:text-bronze transition-colors"
                      >
                        {CONTACT.phone}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-pine-green">
                      Email
                    </p>
                    <p className="mt-1">
                      <a
                        href={`mailto:${CONTACT.email}`}
                        className="hover:text-bronze transition-colors"
                      >
                        {CONTACT.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-pine-green">
                      Facebook
                    </p>
                    <p className="mt-1">
                      <a
                        href={FACEBOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-bronze transition-colors"
                      >
                        Majestic Pine Renovations llc
                      </a>
                    </p>
                  </div>
                </address>

                <div className="mt-10 border-l-2 border-bronze pl-4">
                  <p className="text-sm text-concrete leading-relaxed">
                    For active commercial accounts or immediate structural
                    stabilization inquiries, please utilize our 24/7 priority
                    dispatch number provided in your client portal.
                  </p>
                </div>
              </FadeInUp>
            </div>

            <div className="lg:col-span-3">
              <FadeInUp delay={100}>
                <ContactChatbot />
              </FadeInUp>

              <FadeInUp delay={180}>
                <div id="project-details-form" className="mt-12">
                  <SectionHeading title="Project Details Form" />
                  <LeadForm />
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
