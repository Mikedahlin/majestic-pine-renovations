import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-heading text-4xl font-bold uppercase tracking-wide text-pine-green">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-concrete">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8">
        <Button href="/">Return Home</Button>
      </div>
      <p className="mt-6 text-sm text-concrete">
        Or{" "}
        <Link href="/contact" className="text-bronze hover:text-pine-green underline">
          contact our team
        </Link>
      </p>
    </section>
  );
}
