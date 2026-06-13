import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/constants";

type ChatMessage = {
  role: "assistant" | "visitor";
  text: string;
};

type RawChatMessage = {
  role?: unknown;
  text?: unknown;
  content?: unknown;
  parts?: unknown;
};

function stripLeadingAssistant(contents: { role: string; text: string }[]) {
  const firstUser = contents.findIndex((m) => m.role === "user" || m.role === "visitor");
  return firstUser < 0 ? contents : contents.slice(firstUser);
}

const systemPrompt = `You are the website chat assistant for Majestic Pine Renovations in Buffalo, Minnesota.
Help homeowners and commercial clients understand what details to share before requesting a consultation.
Keep answers warm, practical, and short: 2 to 4 sentences.
Do not invent prices, availability, licenses, or guarantees.
Do not claim to schedule appointments directly.
Always guide serious project inquiries toward the contact form or phone number.
Company phone: ${CONTACT.phone}.
Service area: ${CONTACT.serviceArea}.`;

function normalizeRole(role: unknown): ChatMessage["role"] {
  if (role === "assistant" || role === "model") {
    return "assistant";
  }

  return "visitor";
}

function isLikelyMediaPart(part: Record<string, unknown>): boolean {
  const type = typeof part.type === "string" ? part.type.toLowerCase() : "";
  if (type.includes("image") || type.includes("audio")) return true;
  return Boolean(
    part.image ||
      part.image_url ||
      part.inline_data ||
      part.file_data ||
      part.audio ||
      part.input_audio ||
      part.input_image,
  );
}

function extractText(value: unknown): { text: string; hasMedia: boolean } {
  if (typeof value === "string") {
    return { text: value, hasMedia: false };
  }

  if (!Array.isArray(value)) {
    return { text: "", hasMedia: false };
  }

  const chunks: string[] = [];
  let hasMedia = false;

  for (const entry of value) {
    if (typeof entry === "string") {
      chunks.push(entry);
      continue;
    }

    if (!entry || typeof entry !== "object") {
      continue;
    }

    const part = entry as Record<string, unknown>;
    if (typeof part.text === "string") {
      chunks.push(part.text);
    }

    if (typeof part.input_text === "string") {
      chunks.push(part.input_text);
    }

    if (isLikelyMediaPart(part)) {
      hasMedia = true;
    }
  }

  return {
    text: chunks.join("\n").trim(),
    hasMedia,
  };
}

function cleanMessages(messages: unknown[]): ChatMessage[] {
  const normalized: ChatMessage[] = [];

  for (const raw of messages) {
    if (!raw || typeof raw !== "object") continue;
    const message = raw as RawChatMessage;

    const primary = extractText(message.text);
    const content = extractText(message.content);
    const parts = extractText(message.parts);

    const mergedText = [primary.text, content.text, parts.text].filter(Boolean).join("\n").trim();
    const hasMedia = primary.hasMedia || content.hasMedia || parts.hasMedia;

    if (mergedText) {
      normalized.push({
        role: normalizeRole(message.role),
        text: mergedText.slice(0, 1000),
      });
      continue;
    }

    if (hasMedia) {
      normalized.push({
        role: normalizeRole(message.role),
        text: "Visitor shared media (image/audio) without text.",
      });
    }
  }

  return normalized.slice(-8);
}

function getBackupReply(input: string): string {
  const message = input.toLowerCase();

  if (message.includes("commercial") || message.includes("office") || message.includes("retail")) {
    return "For commercial work, please share the property type, location, timeline, and whether the space must stay open during construction. The form below is the best place to send those details.";
  }

  if (message.includes("area") || message.includes("serve") || message.includes("location")) {
    return `Majestic Pine Renovations serves ${CONTACT.serviceArea}. You can use the form below or call ${CONTACT.phone} to start the conversation.`;
  }

  if (message.includes("cost") || message.includes("budget") || message.includes("price")) {
    return "Budget depends on scope, materials, site conditions, and schedule. Use the budget dropdown below, or choose Other / Custom if you want to enter your own estimate.";
  }

  if (message.includes("deck") || message.includes("outdoor") || message.includes("cabin") || message.includes("lake")) {
    return "For outdoor, cabin, or lake-home work, helpful details include location, size, materials, timeline, and any inspiration photos. You can upload photos or plans in the form below.";
  }

  return "Thanks, that is a good start. The best next step is to send your project details in the form below, including location, timeline, budget range, and any photos or plans.";
}

async function askGemini(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const configuredModel = process.env.GEMINI_MODEL ?? process.env.GOOGLE_MODEL_ID ?? "gemini-2.5-flash-lite";
  const models = Array.from(
    new Set([configuredModel, "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"]),
  );

  const contents = stripLeadingAssistant(messages).map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.text }],
  }));

  let lastError = "AI request failed";

  for (const model of models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 180,
          },
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      lastError = `Gemini ${model} ${response.status}: ${body.slice(0, 200)}`;
      continue;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim();

    if (text) return text;
  }

  throw new Error(lastError);
}

async function askGroq(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.GROQ_KEY;
  if (!apiKey) {
    throw new Error("Groq API key is not configured");
  }

  const configuredModel = process.env.GROQ_MODEL ?? process.env.GROQ_MODEL_ID ?? "llama-3.3-70b-versatile";
  const models = Array.from(
    new Set([configuredModel, "llama-3.3-70b-versatile", "llama-3.1-8b-instant"]),
  );

  const history = stripLeadingAssistant(messages).map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.text,
  }));

  let lastError = "Groq request failed";

  for (const model of models) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
        ],
        temperature: 0.35,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      lastError = `Groq ${model} ${response.status}: ${body.slice(0, 200)}`;
      continue;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (text) return text;
  }

  throw new Error(lastError);
}

async function askOpenAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  const configuredModel = process.env.OPENAI_MODEL ?? process.env.OPENAI_MODEL_ID ?? "gpt-4o-mini";
  const models = Array.from(
    new Set([configuredModel, "gpt-4o-mini", "gpt-4o"]),
  );
  const history = stripLeadingAssistant(messages).map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.text,
  }));

  let lastError = "OpenAI request failed";

  for (const model of models) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
        ],
        temperature: 0.35,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      lastError = `OpenAI ${model} ${response.status}: ${body.slice(0, 200)}`;
      continue;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

    if (text) return text;
  }

  throw new Error(lastError);
}

async function tryProvider(name: string, fn: () => Promise<string>): Promise<string | null> {
  try {
    return await fn();
  } catch (e) {
    console.warn(`[API /contact-chat] ${name} failed:`, e instanceof Error ? e.message : e);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = cleanMessages(Array.isArray(body.messages) ? body.messages : []);

    if (messages.length === 0) {
      return NextResponse.json({ error: "A message is required" }, { status: 400 });
    }

    const lastInput = messages[messages.length - 1].text;
    const reply =
      (await tryProvider("Gemini", () => askGemini(messages))) ??
      (await tryProvider("Groq", () => askGroq(messages))) ??
      (await tryProvider("OpenAI", () => askOpenAI(messages))) ??
      getBackupReply(lastInput);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[API /contact-chat] Fatal error:", error);
    return NextResponse.json({ error: "I am having trouble connecting right now. Please use the form below or call us directly." }, { status: 500 });
  }
}
