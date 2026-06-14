import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Majestic Pine Renovations.",
  keyword: "Majestic Pine Renovations privacy policy",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 prose prose-neutral">
        <SectionHeading title="Privacy Policy" />
        <p className="text-concrete leading-relaxed">
          Majestic Pine Renovations collects contact information you submit through
          our website forms solely to respond to project inquiries. We do not sell
          personal information. Uploaded project photos are used only for estimating
          and are retained according to our internal data retention policy.
        </p>
        <p className="text-concrete leading-relaxed">
          Questions? Email{" "}
          <a href="mailto:hello@majesticpinerenovations.com" className="text-bronze">
            hello@majesticpinerenovations.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
