"use client";

import { useState, type FormEvent } from "react";
import {
  BUDGET_RANGES,
  CUSTOM_BUDGET_RANGE,
  PROJECT_CATEGORIES,
} from "@/lib/constants";
import { Button } from "./Button";

type LeadFormProps = {
  compact?: boolean;
};

type FormState = "idle" | "submitting" | "success" | "error";

export function LeadForm({ compact = false }: LeadFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Submission failed");
      }

      setState("success");
      setSelectedBudgetRange("");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "success") {
    return (
      <div className="border border-bronze bg-pine-green/5 p-8 text-center">
        <h3 className="font-heading text-xl font-bold uppercase text-pine-green">
          Project Details Received
        </h3>
        <p className="mt-3 text-concrete">
          Thank you. Our team will review your submission and contact you within
          one business day.
        </p>
        <button
          type="button"
          className="mt-6 text-sm uppercase tracking-widest text-bronze hover:text-pine-green"
          onClick={() => setState("idle")}
        >
          Submit Another Project
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full border border-pine-green/20 bg-warm-white px-4 py-3 text-charcoal placeholder:text-concrete/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className={`grid gap-5 ${compact ? "md:grid-cols-2" : "md:grid-cols-2"}`}>
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            First Name *
          </label>
          <input id="firstName" name="firstName" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Last Name *
          </label>
          <input id="lastName" name="lastName" type="text" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="propertyAddress" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
          Property Address *
        </label>
        <input id="propertyAddress" name="propertyAddress" type="text" required className={inputClass} />
      </div>

      <div className={`grid gap-5 ${compact ? "md:grid-cols-2" : "md:grid-cols-2"}`}>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Phone *
          </label>
          <input id="phone" name="phone" type="tel" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Email Address *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="smsOptIn"
          name="smsOptIn"
          type="checkbox"
          value="true"
          className="mt-1 h-4 w-4 accent-bronze"
        />
        <label htmlFor="smsOptIn" className="text-sm text-concrete leading-relaxed">
          I agree to receive SMS updates about my project. Message and data rates may apply.
        </label>
      </div>

      <div className={`grid gap-5 ${compact ? "md:grid-cols-2" : "md:grid-cols-2"}`}>
        <div>
          <label htmlFor="projectCategory" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Project Category *
          </label>
          <select id="projectCategory" name="projectCategory" required className={inputClass}>
            <option value="">Select category</option>
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budgetRange" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Estimated Budget Range *
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            required
            className={inputClass}
            value={selectedBudgetRange}
            onChange={(event) => setSelectedBudgetRange(event.target.value)}
          >
            <option value="">Select range</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedBudgetRange === CUSTOM_BUDGET_RANGE && (
        <div>
          <label htmlFor="customBudgetRange" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Custom Budget Estimate *
          </label>
          <input
            id="customBudgetRange"
            name="customBudgetRange"
            type="text"
            required
            placeholder="Example: $35,000 or still deciding"
            className={inputClass}
          />
        </div>
      )}

      {!compact && (
        <div>
          <label htmlFor="files" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Upload Files
          </label>
          <p className="mb-2 text-xs text-concrete">
            Blueprints, inspiration photos, or short voice notes (max 10MB each)
          </p>
          <input
            id="files"
            name="files"
            type="file"
            multiple
            accept="image/*,audio/*,.pdf,.dwg,.dxf"
            className="w-full text-sm text-concrete file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:uppercase file:tracking-wider file:text-warm-white hover:file:bg-bronze"
          />
        </div>
      )}

      {state === "error" && (
        <p className="text-sm text-red-700" role="alert">{errorMessage}</p>
      )}

      <Button type="submit" disabled={state === "submitting"} className="w-full md:w-auto">
        {state === "submitting" ? "Submitting..." : "Submit Project Details"}
      </Button>
    </form>
  );
}
