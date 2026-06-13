import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/constants";

type ChatImage = {
  mimeType: string;
  data: string;
};

type ChatMessage = {
  role: "assistant" | "visitor";
  text: string;
  image?: ChatImage;
};

function stripLeadingAssistant(contents: ChatMessage[]) {
  const firstUser = contents.findIndex((m) => m.role === "visitor");
  return firstUser < 0 ? contents : contents.slice(firstUser);
}

const systemPrompt = `You are the website chat assistant for Majestic Pine Renovations in Buffalo, Minnesota.
Help homeowners and commercial clients understand what details to share before requesting a consultation.
Keep answers warm, practical, and short: 2 to 4 sentences.
Do not invent prices, availability, licenses, or guarantees.
Do not claim to schedule appointments directly.
Always guide serious project inquiries toward the contact form or phone number.
When the visitor shares a project photo, describe what you notice and suggest helpful next details to include in the form.
Company phone: ${CONTACT.phone}.
Service area: ${CONTACT.serviceArea}.`;

function cleanMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((message) => message.text.trim() || message.image)
    .slice(-8)
    .map((message) => ({
      role: message.role,
      text: message.text.slice(0, 1000),
      image:
        message.image &&
        message.image.data.length <= 5_000_000 &&
        message.image.mimeType.startsWith("image/")
          ? {
              mimeType: message.image.mimeType,
              data: message.image.data,
            }
          : undefined,
    }));
}

function getBackupReply(input: string, hasImage: boolean): string {
  if (hasImage) {
    return "Thanks for sharing that photo. The best next step is to include it with your project details in the form below, along with your location, timeline, and budget range.";
  }

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

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

function toGeminiParts(message: ChatMessage): GeminiPart[] {
  const parts: GeminiPart[] = [];

  if (message.image) {
    parts.push({
      inline_data: {
        mime_type: message.image.mimeType,
        data: message.image.data,
      },
    });
  }

  if (message.text.trim()) {
    parts.push({ text: message.text });
  } else if (message.image) {
    parts.push({ text: "Please review this project photo and tell me what details would help the team." });
  }

  return parts;
}

async function askGemini(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const configuredModel = process.env.GEMINI_MODEL ?? process.env.GOOGLE_MODEL_ID ?? "gemini-2.5-flash-lite";
  const models = Array.from(
    new Set([configuredModel, "gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-2.0-flash"]),
  );

  const contents = stripLeadingAssistant(messages).map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: toGeminiParts(message),
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
            maxOutputTokens: 220,
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
  if (messages.some((message) => message.image)) {
    throw new Error("Groq does not support image messages");
  }

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

  const history = stripLeadingAssistant(messages).map((message) => {
    if (!message.image) {
      return {
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.text,
      };
    }

    return {
      role: message.role === "assistant" ? "assistant" : "user",
      content: [
        ...(message.image
          ? [
              {
                type: "image_url",
                image_url: {
                  url: `data:${message.image.mimeType};base64,${message.image.data}`,
                },
              },
            ]
          : []),
        {
          type: "text",
          text:
            message.text.trim() ||
            "Please review this project photo and tell me what details would help the team.",
        },
      ],
    };
  });

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
        max_tokens: 220,
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

    const lastMessage = messages[messages.length - 1];
    const lastInput = lastMessage.text;
    const hasImage = Boolean(lastMessage.image);

    let reply =
      (await tryProvider("Gemini", () => askGemini(messages))) ??
      (await tryProvider("OpenAI", () => askOpenAI(messages))) ??
      (hasImage ? null : await tryProvider("Groq", () => askGroq(messages))) ??
      getBackupReply(lastInput, hasImage);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[API /contact-chat] Fatal error:", error);
    return NextResponse.json({ error: "I am having trouble connecting right now. Please use the form below or call us directly." }, { status: 500 });
  }
}
