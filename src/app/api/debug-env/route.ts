import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST() {
  const vars = {
    GEMINI_API_KEY: typeof process.env.GEMINI_API_KEY === "string",
    GOOGLE_API_KEY: typeof process.env.GOOGLE_API_KEY === "string",
    GEMINI_MODEL: process.env.GEMINI_MODEL ?? null,
    GOOGLE_MODEL_ID: process.env.GOOGLE_MODEL_ID ?? null,
    GROQ_API_KEY: typeof process.env.GROQ_API_KEY === "string",
    GROQ_KEY: typeof process.env.GROQ_KEY === "string",
    OPENAI_API_KEY: typeof process.env.OPENAI_API_KEY === "string",
    OPENAI_MODEL: process.env.OPENAI_MODEL ?? null,
    OPENAI_MODEL_ID: process.env.OPENAI_MODEL_ID ?? null,
  };
  return NextResponse.json(vars);
}
