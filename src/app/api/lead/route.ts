import { NextResponse } from "next/server";
import {
  processLead,
  type LeadPayload,
} from "@/lib/integrations/lead-handler";
import {
  BUDGET_RANGES,
  CUSTOM_BUDGET_RANGE,
  PROJECT_CATEGORIES,
} from "@/lib/constants";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 5;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
]);

function validatePhone(phone: string): boolean {
  return /^[\d\s\-().+]{10,}$/.test(phone);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const website = (formData.get("website") as string)?.trim();

    if (website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    const propertyAddress = (formData.get("propertyAddress") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const smsOptIn = formData.get("smsOptIn") === "true";
    const projectCategory = formData.get("projectCategory") as string;
    const budgetRange = formData.get("budgetRange") as string;
    const customBudgetRange = (formData.get("customBudgetRange") as string)?.trim();
    const projectDetails = (formData.get("projectDetails") as string)?.trim();

    const errors: string[] = [];

    if (!firstName) errors.push("First name is required");
    if (!lastName) errors.push("Last name is required");
    if (!propertyAddress) errors.push("Property address is required");
    if (!phone || !validatePhone(phone)) errors.push("Valid phone number is required");
    if (!email || !validateEmail(email)) errors.push("Valid email is required");
    if (!PROJECT_CATEGORIES.includes(projectCategory as (typeof PROJECT_CATEGORIES)[number])) {
      errors.push("Valid project category is required");
    }
    if (!BUDGET_RANGES.includes(budgetRange as (typeof BUDGET_RANGES)[number])) {
      errors.push("Valid budget range is required");
    }
    if (budgetRange === CUSTOM_BUDGET_RANGE && !customBudgetRange) {
      errors.push("Custom budget estimate is required");
    }
    if (!projectDetails || projectDetails.length < 20) {
      errors.push("Please include a short project description");
    }

    const fileEntries = formData.getAll("files");
    const files: LeadPayload["files"] = [];
    let totalFileSize = 0;

    for (const entry of fileEntries) {
      if (!(entry instanceof File) || entry.size === 0) continue;

      if (entry.size > MAX_FILE_SIZE) {
        errors.push(`File "${entry.name}" exceeds 10MB limit`);
        continue;
      }
      if (!ALLOWED_FILE_TYPES.has(entry.type)) {
        errors.push(`File "${entry.name}" must be an image or PDF`);
        continue;
      }

      if (files.length >= MAX_FILES) {
        errors.push("Maximum 5 files allowed");
        break;
      }
      totalFileSize += entry.size;
      if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
        errors.push("Combined file size cannot exceed 20MB");
        break;
      }

      files.push({
        name: entry.name,
        size: entry.size,
        type: entry.type,
        content: Buffer.from(await entry.arrayBuffer()).toString("base64"),
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(". ") }, { status: 400 });
    }

    const lead: LeadPayload = {
      firstName,
      lastName,
      propertyAddress,
      phone,
      smsOptIn,
      email,
      projectCategory,
      projectDetails,
      budgetRange:
        budgetRange === CUSTOM_BUDGET_RANGE
          ? `${CUSTOM_BUDGET_RANGE}: ${customBudgetRange}`
          : budgetRange,
      files: files.length > 0 ? files : undefined,
      submittedAt: new Date().toISOString(),
    };

    const result = await processLead(lead);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[API /lead] Error:", error);
    return NextResponse.json(
      {
        error:
          "The online form is not connected yet. Please call (612) 363-2614 or email majesticpinerenovations@gmail.com.",
      },
      { status: 503 },
    );
  }
}
