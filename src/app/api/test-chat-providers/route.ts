import { NextResponse } from "next/server";

const systemPrompt = "You are a helpful assistant. Keep answers very short - one sentence.";

async function testGemini(): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) return "NO_KEY";
  const model = process.env.GEMINI_MODEL ?? process.env.GOOGLE_MODEL_ID ?? "gemini-2.0-flash-lite";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: "Say hello in one word" }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: 50 },
    })},
  );
  if (!res.ok) return `HTTP ${res.status}: ${(await res.text().catch(()=>"")).slice(0,150)}`;
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts) ? parts.map((p: { text?: string }) => p.text).filter(Boolean).join("\n").trim() : "";
  return text ? `OK: ${text}` : "EMPTY_RESPONSE";
}

async function testGroq(): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.GROQ_KEY;
  if (!apiKey) return "NO_KEY";
  const model = process.env.GROQ_MODEL ?? process.env.GROQ_MODEL_ID ?? "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: "Say hello in one word" }], temperature: 0.35, max_tokens: 50 }),
  });
  if (!res.ok) return `HTTP ${res.status}: ${(await res.text().catch(()=>"")).slice(0,150)}`;
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  return text ? `OK: ${text}` : "EMPTY_RESPONSE";
}

async function testOpenAI(): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "NO_KEY";
  const model = process.env.OPENAI_MODEL ?? process.env.OPENAI_MODEL_ID ?? "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: "Say hello in one word" }], temperature: 0.35, max_tokens: 50 }),
  });
  if (!res.ok) return `HTTP ${res.status}: ${(await res.text().catch(()=>"")).slice(0,150)}`;
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  return text ? `OK: ${text}` : "EMPTY_RESPONSE";
}

export async function GET() {
  const [gemini, groq, openai] = await Promise.all([testGemini(), testGroq(), testOpenAI()]);
  return NextResponse.json({ gemini, groq, openai });
}
