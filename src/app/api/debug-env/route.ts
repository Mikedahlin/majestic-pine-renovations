import { NextResponse } from "next/server";

export async function GET() {
  const vars = {
    GEMINI_API_KEY: typeof process.env.GEMINI_API_KEY === "string" ? `set (${process.env.GEMINI_API_KEY.length} chars)` : "not set",
    GOOGLE_API_KEY: typeof process.env.GOOGLE_API_KEY === "string" ? `set (${process.env.GOOGLE_API_KEY.length} chars)` : "not set",
    GEMINI_MODEL: process.env.GEMINI_MODEL ?? "not set",
    GOOGLE_MODEL_ID: process.env.GOOGLE_MODEL_ID ?? "not set",
    GROQ_API_KEY: typeof process.env.GROQ_API_KEY === "string" ? `set (${process.env.GROQ_API_KEY.length} chars)` : "not set",
    GROQ_KEY: typeof process.env.GROQ_KEY === "string" ? `set (${process.env.GROQ_KEY.length} chars)` : "not set",
    OPENAI_API_KEY: typeof process.env.OPENAI_API_KEY === "string" ? `set (${process.env.OPENAI_API_KEY.length} chars)` : "not set",
    OPENAI_MODEL: process.env.OPENAI_MODEL ?? "not set",
    OPENAI_MODEL_ID: process.env.OPENAI_MODEL_ID ?? "not set",
    NODE_ENV: process.env.NODE_ENV ?? "not set",
  };

  return NextResponse.json(vars);
}
