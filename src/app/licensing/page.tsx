import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = buildMetadata({
  title: "Licensing",
  description: "Licensing and insurance information for Majestic Pine Renovations.",
  keyword: "Minnesota licensed contractor Majestic Pine Renovations",
  path: "/licensing",
});

export default function LicensingPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <SectionHeading title="Licensing & Insurance" />
        <p className="text-concrete leading-relaxed">
          Majestic Pine Renovations is fully licensed and insured for residential
          and commercial construction work in Minnesota. Certificate of insurance
          and license details are available upon request for active bids and
          commercial projects.
        </p>
      </div>
    </section>
  );
}
