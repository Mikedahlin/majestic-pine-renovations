import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of service for Majestic Pine Renovations.",
  keyword: "Majestic Pine Renovations terms of service",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <SectionHeading title="Terms of Service" />
        <p className="text-concrete leading-relaxed">
          Website content is provided for general information about Majestic Pine
          Renovations services. Estimates, timelines, and scope are confirmed only
          through written proposals and signed agreements. By using this site you
          agree not to misuse forms, chat tools, or uploaded content.
        </p>
      </div>
    </section>
  );
}
