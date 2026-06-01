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
    .filter((message) => message.text.trim())
    .slice(-8)
    .map((message) => ({
      role: message.role,
      text: message.text.slice(0, 1000),
    }));
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const configuredModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
  const models = Array.from(
    new Set([configuredModel, "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"]),
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
      lastError = `Gemini request failed with ${response.status}`;
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
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Groq API key is not configured");
  }

  const configuredModel = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const models = Array.from(
    new Set([configuredModel, "llama-3.3-70b-versatile", "llama-3.1-8b-instant"]),
  );

  const history = messages.map((message) => ({
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
      lastError = `Groq request failed with ${response.status}`;
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

  const configuredModel = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const models = Array.from(
    new Set([configuredModel, "gpt-4o-mini", "gpt-4o"]),
  );
  const history = messages.map((message) => ({
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
      lastError = `OpenAI request failed with ${response.status}`;
      continue;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();

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
        reply = await askGroq(messages);
      } catch (groqError) {
        console.warn("[API /contact-chat] Groq fallback:", groqError);
        try {
          reply = await askOpenAI(messages);
        } catch (openAiError) {
          console.warn("[API /contact-chat] OpenAI fallback:", openAiError);
          reply = getBackupReply(messages[messages.length - 1].text);
        }
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
