"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type ReactElement,
} from "react";
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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

const FULL_STEPS = [
  { key: "project", label: "Project" },
  { key: "contact", label: "Contact" },
  { key: "photos", label: "Photos" },
] as const;

const COMPACT_STEPS = FULL_STEPS.slice(0, 2);

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 9.5V20h13V9.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 20v-6h5v6" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="17" />
      <path strokeLinecap="round" d="M8.5 7.5h1.5M14 7.5h1.5M8.5 11h1.5M14 11h1.5M8.5 14.5h1.5M14 14.5h1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 20.5v-3.5h3v3.5" />
    </svg>
  );
}

function ExteriorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3.2M6 6l2.2 2.2M18 6l-2.2 2.2M3 13h3.2M17.8 13H21" />
      <circle cx="12" cy="13" r="4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 20.5h9" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V4m0 0 4 4m-4-4-4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5 shrink-0" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h7l4 4V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.5V8h4" />
    </svg>
  );
}

const CATEGORY_META: Record<
  (typeof PROJECT_CATEGORIES)[number],
  { Icon: () => ReactElement; blurb: string }
> = {
  Residential: { Icon: HomeIcon, blurb: "Kitchens, baths, additions & full remodels" },
  Commercial: { Icon: BuildingIcon, blurb: "Build-outs, renovations & tenant improvements" },
  Exterior: { Icon: ExteriorIcon, blurb: "Siding, decks, outdoor living & curb appeal" },
};

export function LeadForm({ compact = false }: LeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");

  const [projectCategory, setProjectCategory] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [customBudgetRange, setCustomBudgetRange] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const steps = compact ? COMPACT_STEPS : FULL_STEPS;
  const lastStepIndex = steps.length - 1;

  function validateProjectStep(): boolean {
    if (!projectCategory) {
      setStepError("Select a project category to continue.");
      return false;
    }
    if (!budgetRange) {
      setStepError("Select a budget range to continue.");
      return false;
    }
    if (budgetRange === CUSTOM_BUDGET_RANGE && !customBudgetRange.trim()) {
      setStepError('Give us a rough number, or just say "still deciding."');
      return false;
    }
    return true;
  }

  function validateContactStep(): boolean {
    const fieldNames = ["firstName", "lastName", "propertyAddress", "phone", "email"];
    for (const name of fieldNames) {
      const el = formRef.current?.elements.namedItem(name);
      if (el instanceof HTMLInputElement && !el.reportValidity()) {
        return false;
      }
    }
    return true;
  }

  function goNext() {
    setStepError("");
    if (step === 0 && !validateProjectStep()) return;
    if (step === 1 && !validateContactStep()) return;
    setStep((s) => Math.min(s + 1, lastStepIndex));
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleFilesSelected(list: FileList | null) {
    if (!list || list.length === 0) return;

    const incoming = Array.from(list);
    const rejected: string[] = [];
    const accepted: File[] = [];

    for (const file of incoming) {
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`"${file.name}" is over 10MB`);
        continue;
      }
      accepted.push(file);
    }

    setFiles((prev) => {
      const merged = [...prev, ...accepted];
      if (merged.length > MAX_FILES) {
        rejected.push(`Only the first ${MAX_FILES} files are kept`);
      }
      return merged.slice(0, MAX_FILES);
    });

    if (rejected.length > 0) setStepError(rejected.join(". "));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFilesSelected(e.dataTransfer.files);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setStepError("");

    if (!validateProjectStep()) {
      setStep(0);
      return;
    }
    if (!validateContactStep()) {
      setStep(1);
      return;
    }

    setState("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    files.forEach((file) => formData.append("files", file));

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
      setStep(0);
      setProjectCategory("");
      setBudgetRange("");
      setCustomBudgetRange("");
      setFiles([]);
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "success") {
    return (
      <div className="border border-bronze bg-pine-green/5 p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-2 border-bronze text-bronze">
          <CheckIcon className="h-7 w-7" />
        </div>
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
    "w-full border border-pine-green/20 bg-warm-white px-4 py-3 text-charcoal placeholder:text-concrete/60 transition-colors duration-200 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={`border border-pine-green/10 bg-warm-white p-6 shadow-[0_25px_70px_-40px_rgba(18,18,18,0.45)] ${compact ? "sm:p-8" : "sm:p-10"}`}
    >
      <p className="mb-6 text-xs uppercase tracking-widest text-concrete sm:hidden">
        Step {step + 1} of {steps.length} — {steps[step].label}
      </p>

      <ol className="mb-10 hidden items-center sm:flex">
        {steps.map((s, i) => {
          const isComplete = i < step;
          const isActive = i === step;
          return (
            <li key={s.key} className={`flex items-center ${i < lastStepIndex ? "flex-1" : ""}`}>
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold transition-colors duration-300 ${
                    isComplete
                      ? "border-bronze bg-bronze text-warm-white"
                      : isActive
                        ? "border-bronze text-bronze"
                        : "border-concrete/30 text-concrete/50"
                  }`}
                >
                  {isComplete ? <CheckIcon /> : i + 1}
                </span>
                <span
                  className={`text-xs uppercase tracking-widest ${
                    isActive || isComplete ? "text-pine-green" : "text-concrete/50"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < lastStepIndex && (
                <span
                  className={`mx-3 h-px flex-1 transition-colors duration-300 ${
                    isComplete ? "bg-bronze" : "bg-concrete/20"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Step: Project */}
      <div key={`project-${step === 0}`} className={step === 0 ? "animate-step-in" : "hidden"}>
        <div>
          <p className="mb-3 text-sm uppercase tracking-wider text-pine-green">
            Project Category *
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {PROJECT_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.Icon;
              const selected = projectCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setProjectCategory(cat);
                    setStepError("");
                  }}
                  className={`flex flex-col items-start gap-2 border p-4 text-left transition-all duration-200 ${
                    selected
                      ? "border-bronze bg-pine-green/5 ring-1 ring-bronze"
                      : "border-pine-green/20 hover:border-bronze/50"
                  }`}
                >
                  <span className={selected ? "text-bronze" : "text-pine-green"}>
                    <Icon />
                  </span>
                  <span className="font-heading text-sm font-bold uppercase tracking-wide text-charcoal">
                    {cat}
                  </span>
                  <span className="text-xs leading-snug text-concrete">{meta.blurb}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm uppercase tracking-wider text-pine-green">
            Estimated Budget Range *
          </p>
          <div className="flex flex-wrap gap-2">
            {BUDGET_RANGES.map((range) => {
              const selected = budgetRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setBudgetRange(range);
                    setStepError("");
                  }}
                  className={`border px-4 py-2 text-sm transition-all duration-200 ${
                    selected
                      ? "border-bronze bg-bronze text-warm-white"
                      : "border-pine-green/20 text-charcoal hover:border-bronze/60"
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>

          {budgetRange === CUSTOM_BUDGET_RANGE && (
            <div className="mt-4">
              <label
                htmlFor="customBudgetRange"
                className="mb-1 block text-sm uppercase tracking-wider text-pine-green"
              >
                Custom Budget Estimate *
              </label>
              <input
                id="customBudgetRange"
                name="customBudgetRange"
                type="text"
                required
                value={customBudgetRange}
                onChange={(e) => setCustomBudgetRange(e.target.value)}
                placeholder='Example: $35,000 or "still deciding"'
                className={inputClass}
              />
            </div>
          )}
        </div>

        <input type="hidden" name="projectCategory" value={projectCategory} />
        <input type="hidden" name="budgetRange" value={budgetRange} />
      </div>

      {/* Step: Contact */}
      <div key={`contact-${step === 1}`} className={step === 1 ? "animate-step-in" : "hidden"}>
        <div className="grid gap-5 sm:grid-cols-2">
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

        <div className="mt-5">
          <label htmlFor="propertyAddress" className="mb-1 block text-sm uppercase tracking-wider text-pine-green">
            Property Address *
          </label>
          <input id="propertyAddress" name="propertyAddress" type="text" required className={inputClass} />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
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

        <div className="mt-5 flex items-start gap-3">
          <input
            id="smsOptIn"
            name="smsOptIn"
            type="checkbox"
            value="true"
            className="mt-1 h-4 w-4 accent-bronze"
          />
          <label htmlFor="smsOptIn" className="text-sm leading-relaxed text-concrete">
            I agree to receive SMS updates about my project. Message and data rates may apply.
          </label>
        </div>
      </div>

      {/* Step: Photos (full form only) */}
      {!compact && (
        <div key={`photos-${step === 2}`} className={step === 2 ? "animate-step-in" : "hidden"}>
          <p className="mb-1 text-sm uppercase tracking-wider text-pine-green">Upload Files</p>
          <p className="mb-4 text-xs text-concrete">
            Blueprints, inspiration photos, or current space images (optional, max 10MB each, up to 5 files)
          </p>

          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-10 text-center transition-colors duration-200 ${
              isDragging ? "border-bronze bg-bronze/5" : "border-pine-green/20 hover:border-bronze/60"
            }`}
          >
            <span className="text-pine-green">
              <UploadIcon />
            </span>
            <p className="text-sm text-charcoal">
              <span className="font-semibold text-bronze">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-concrete">Images, PDF, or DWG — up to 10MB each</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.dwg"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilesSelected(e.target.files)}
          />

          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between gap-3 border border-pine-green/10 bg-pine-green/5 px-3 py-2 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2 text-charcoal">
                    <FileIcon />
                    <span className="truncate">{file.name}</span>
                    <span className="shrink-0 text-xs text-concrete">
                      ({(file.size / 1024 / 1024).toFixed(1)}MB)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="shrink-0 text-xs uppercase tracking-wider text-concrete hover:text-bronze"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {stepError && (
        <p className="mt-6 text-sm text-red-700" role="alert">
          {stepError}
        </p>
      )}
      {state === "error" && (
        <p className="mt-6 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-pine-green/10 pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="text-sm uppercase tracking-widest text-concrete transition-colors hover:text-bronze"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {step < lastStepIndex ? (
          <Button type="button" onClick={goNext}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={state === "submitting"} className="w-full sm:w-auto">
            {state === "submitting" ? "Submitting..." : "Submit Project Details"}
          </Button>
        )}
      </div>
    </form>
  );
}
