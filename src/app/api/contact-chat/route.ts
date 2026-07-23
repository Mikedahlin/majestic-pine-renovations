import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/constants";

type ChatMessage = {
  role: "assistant" | "visitor";
  text: string;
};

const systemPrompt = `You are the website chat assistant for Majestic Pine Renovations in Buffalo, Minnesota.
Help homeowners and commercial clients understand what details to share before requesting a consultation.
Keep answers warm, practical, and short: 2 to 4 sentences.
Do not invent prices, availability, licenses, or guarantees.
Do not claim to schedule appointments directly.
Always guide serious project inquiries toward the contact form or phone number.
Company phone: ${CONTACT.phone}.
Service area: ${CONTACT.serviceArea}.`;

function cleanMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((message) => typeof message.text === "string" && message.text.trim())
    .slice(-8)
    .map((message) => ({
      role: message.role,
      text: message.text.slice(0, 1000),
    }));
}

function matchesKeywords(message: string, keywords: string[]): boolean {
  const normalized = message.toLowerCase();
  return keywords.some((keyword) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(normalized);
  });
}

function getBackupReply(input: string): string {
  const message = input.toLowerCase();

  if (matchesKeywords(message, ["commercial", "office", "retail", "hospital"])) {
    return "For commercial work, please share the property type, location, timeline, and whether the space must stay open during construction. The form below is the best place to send those details.";
  }

  if (matchesKeywords(message, ["serve", "location", "area", "areas"])) {
    return `Majestic Pine Renovations serves ${CONTACT.serviceArea}. You can use the form below or call ${CONTACT.phone} to start the conversation.`;
  }

  if (matchesKeywords(message, ["cost", "budget", "price", "pricing"])) {
    return "Budget depends on scope, materials, site conditions, and schedule. Use the budget dropdown below, or choose Other / Custom if you want to enter your own estimate.";
  }

  if (matchesKeywords(message, ["deck", "outdoor", "cabin", "lake", "dock", "patio"])) {
    return "For outdoor, cabin, or lake-home work, helpful details include location, size, materials, timeline, and any inspiration photos. You can upload photos or plans in the form below.";
  }

  return "Thanks, that is a good start. The best next step is to send your project details in the form below, including location, timeline, budget range, and any photos or plans.";
}

async function askGemini(messages: ChatMessage[]): Promise<string> {
  // Vercel uses GOOGLE_GEMINI_API_KEY; accept plain GEMINI_API_KEY too so
  // either name works locally and in any future env setup.
  const apiKey =
    process.env.GOOGLE_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  // "gemini-flash-lite-latest" / "gemini-flash-latest" are evergreen aliases that
  // survive Google's model retirements (gemini-2.0-flash-lite was shut down and
  // started returning 404, which silently killed the chat).
  const configuredModel = process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest";
  const models = Array.from(
    new Set([
      configuredModel,
      "gemini-flash-lite-latest",
      "gemini-flash-latest",
      "gemini-2.5-flash",
    ]),
  );

  const contents = messages.map((message) => ({
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
      const detail = await response.text().catch(() => "");
      lastError = `Gemini model ${model} failed with ${response.status}: ${detail.slice(0, 300)}`;
      console.warn(`[API /contact-chat] ${lastError}`);
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

async function askOpenAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  const configuredModel = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const models = Array.from(
    new Set([configuredModel, "gpt-4o-mini", "gpt-4.1-nano"]),
  );
  const input = messages
    .map((message) => `${message.role === "assistant" ? "Assistant" : "Visitor"}: ${message.text}`)
    .join("\n");

  let lastError = "OpenAI request failed";

  for (const model of models) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: systemPrompt,
        input,
        max_output_tokens: 180,
      }),
    });

    if (!response.ok) {
      lastError = `OpenAI request failed with ${response.status}`;
      continue;
    }

    const data = await response.json();
    const text =
      typeof data.output_text === "string"
        ? data.output_text.trim()
        : data.output
            ?.flatMap((item: { content?: { text?: string }[] }) => item.content ?? [])
            ?.map((content: { text?: string }) => content.text)
            ?.filter(Boolean)
            ?.join("\n")
            ?.trim();

    if (text) return text;
  }

  throw new Error(lastError);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = cleanMessages(Array.isArray(body.messages) ? body.messages : []);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "A message is required" },
        { status: 400 },
      );
    }

    let reply: string;
    try {
      reply = await askGemini(messages);
    } catch (geminiError) {
      console.warn("[API /contact-chat] Gemini fallback:", geminiError);
      try {
        reply = await askOpenAI(messages);
      } catch (openAiError) {
        console.warn("[API /contact-chat] OpenAI fallback:", openAiError);
        reply = getBackupReply(messages[messages.length - 1].text);
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[API /contact-chat] Error:", error);
    return NextResponse.json(
      {
        error:
          "I am having trouble connecting right now. Please use the form below or call us directly.",
      },
      { status: 500 },
    );
  }
}
