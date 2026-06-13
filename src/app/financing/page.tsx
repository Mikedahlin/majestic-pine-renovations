import type { Metadata } from "next";
import { HeroSection } from "@/components/ui/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInUp } from "@/components/ui/FadeInUp";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildMetadata, PAGE_META } from "@/lib/metadata";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata(PAGE_META.financing);

const options = [
  {
    title: "0% Introductory APR",
    description:
      "Qualified residential projects may qualify for promotional financing with zero interest during the introductory period — keeping your capital working elsewhere.",
  },
  {
    title: "Long-Term Fixed Rates",
    description:
      "Lock in predictable monthly payments with fixed-rate terms designed for major remodels, additions, and whole-home transformations.",
  },
  {
    title: "Staged Draw Programs",
    description:
      "Align financing disbursements with project milestones. Funds release as work completes — protecting both your investment and our build schedule.",
  },
];

const financingFaqs = [
  {
    question: "Can I finance a commercial build-out?",
    answer:
      "Yes. We partner with lending institutions that offer both residential and commercial financing programs tailored to tenant improvements and build-outs.",
  },
  {
    question: "How does the staged draw program work?",
    answer:
      "Funds are released at predefined project milestones — typically after inspection sign-offs — ensuring your investment aligns with completed work.",
  },
];

export default function FinancingPage() {
  return (
    <>
      <SchemaScript data={faqSchema(financingFaqs)} />

      <HeroSection
        title="Luxury Remodeling, Intelligently Financed."
        subtitle="Your capital should work for you. Majestic Pine Renovations partners with elite lending institutions to provide flexible, high-limit financing options for both residential and commercial projects."
        backgroundImage="/service-photos/outdoor-lifestyle.jpg"
        fullScreen={false}
      />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading
              title="Financing Options"
              subtitle="Flexible programs designed for projects of every scale."
              align="center"
            />
          </FadeInUp>
          <div className="grid gap-8 md:grid-cols-3">
            {options.map((option, i) => (
              <FadeInUp key={option.title} delay={i * 100}>
                <div className="border border-pine-green/20 bg-warm-white p-8 h-full">
                  <div className="mb-4 h-1 w-12 bg-bronze" />
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-pine-green">
                    {option.title}
                  </h3>
                  <p className="mt-4 text-concrete leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </FadeInUp>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/contact">Apply for Financing</Button>
          </div>
        </div>
      </section>
    </>
  );
}
