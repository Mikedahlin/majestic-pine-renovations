"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONTACT } from "@/lib/constants";

type Message = {
  role: "assistant" | "visitor";
  text: string;
};

// Narrow the Web Speech API types that aren't in every TS config
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

const quickReplies = [
  "I want a remodel",
  "I need commercial work",
  "What areas do you serve?",
  "How soon can we talk?",
] as const;

function getAssistantReply(input: string): string {
  const message = input.toLowerCase();

  if (message.includes("commercial") || message.includes("office") || message.includes("retail")) {
    return "For commercial work, the best next step is to share the property type, location, timeline, and whether the space must stay open during construction.";
  }

  if (message.includes("area") || message.includes("serve") || message.includes("location")) {
    return `Majestic Pine Renovations serves ${CONTACT.serviceArea}. The headquarters are in ${CONTACT.headquarters}.`;
  }

  if (message.includes("soon") || message.includes("talk") || message.includes("call") || message.includes("schedule")) {
    return `You can call ${CONTACT.phone}, or send the form below and the team will review your project details within one business day.`;
  }

  if (message.includes("budget") || message.includes("cost") || message.includes("price")) {
    return "Budget depends on scope, materials, site conditions, and schedule. The form below has budget ranges so the team can guide you without guessing.";
  }

  if (message.includes("deck") || message.includes("outdoor")) {
    return "For decks and outdoor living, useful details include size, material preference, stairs or railings, covered areas, and whether you want lighting or an outdoor kitchen.";
  }

  if (message.includes("bath") || message.includes("kitchen") || message.includes("basement") || message.includes("remodel")) {
    return "For a remodel, useful details include the room, what you want changed, your timeline, budget range, and whether you have photos or plans to upload.";
  }

  return "That helps. The fastest way to move forward is to add your project details in the form below, including location, timeline, budget range, and any photos or plans.";
}

export function ContactChatbot() {
  const openingMessage = useMemo<Message>(
    () => ({
      role: "assistant",
      text: "Hi, I can help you figure out what details to send before the team reviews your project.",
    }),
    [],
  );
  const [messages, setMessages] = useState<Message[]>([openingMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasSpeechRecognition] = useState(() =>
    typeof window !== "undefined"
      ? getSpeechRecognition() !== null
      : false,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  // Stop speech synthesis when the component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function startListening() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (ev: SpeechRecognitionEvent) => {
      const transcript = ev.results[0]?.[0]?.transcript ?? "";
      setInput(transcript);
    };

    rec.onerror = () => {
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function toggleListening() {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    if (listening) stopListening();

    const visitorMessage: Message = { role: "visitor", text: trimmed };
    const nextMessages = [...messages, visitorMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/contact-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();
      const reply =
        response.ok && typeof data.reply === "string"
          ? data.reply
          : getAssistantReply(trimmed);

      setMessages((current) => [
        ...current,
        { role: "assistant", text: reply },
      ]);

      if (ttsEnabled) speak(reply);
    } catch {
      const fallback = getAssistantReply(trimmed);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: fallback },
      ]);
      if (ttsEnabled) speak(fallback);
    } finally {
      setLoading(false);
    }
  }

  function handleEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="border border-pine-green/15 bg-warm-white">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-pine-green/10 p-5">
        <div>
          <p className="text-sm uppercase tracking-widest text-bronze">
            Project Chat
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-wide text-pine-green">
            Start Here
          </h2>
        </div>

        {/* TTS toggle */}
        <button
          type="button"
          title={ttsEnabled ? "Mute assistant voice" : "Enable assistant voice"}
          onClick={() => {
            if (ttsEnabled) window.speechSynthesis?.cancel();
            setTtsEnabled((v) => !v);
          }}
          className={`mt-1 flex items-center gap-1.5 border px-3 py-2 text-xs uppercase tracking-wider transition-colors ${
            ttsEnabled
              ? "border-bronze bg-bronze/10 text-bronze"
              : "border-pine-green/20 text-concrete hover:border-bronze hover:text-bronze"
          }`}
          aria-pressed={ttsEnabled}
        >
          {/* Speaker icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            {ttsEnabled ? (
              <>
                <path d="M10 3.75a.75.75 0 0 0-1.264-.546L4.703 7H3.167a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 2 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0 0 10 16.25V3.75Z" />
                <path d="M15.95 5.05a.75.75 0 1 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z" />
                <path d="M13.829 7.172a.75.75 0 1 0-1.061 1.06 2.5 2.5 0 0 1 0 3.536.75.75 0 0 0 1.06 1.06 4 4 0 0 0 0-5.656Z" />
              </>
            ) : (
              <path d="M10 3.75a.75.75 0 0 0-1.264-.546L4.703 7H3.167a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 2 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0 0 10 16.25V3.75ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L17.94 11.5l-1.22 1.22a.75.75 0 1 0 1.06 1.06L19 12.56l1.22 1.22a.75.75 0 1 0 1.06-1.06L20.06 11.5l1.22-1.22a.75.75 0 0 0-1.06-1.06L19 10.44l-1.22-1.22Z" />
            )}
          </svg>
          {ttsEnabled ? "Voice on" : "Voice off"}
        </button>
      </div>

      {/* Messages */}
      <div className="max-h-[360px] space-y-4 overflow-y-auto p-5">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === "visitor" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                message.role === "visitor"
                  ? "bg-pine-green text-warm-white"
                  : "bg-pine-green/5 text-concrete"
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <p className="max-w-[85%] bg-pine-green/5 px-4 py-3 text-sm leading-relaxed text-concrete">
              Thinking...
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-pine-green/10 p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(reply)}
              className="border border-pine-green/20 px-3 py-2 text-xs uppercase tracking-wider text-pine-green transition-colors hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reply}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <label htmlFor="contact-chat-message" className="sr-only">
            Message
          </label>
          <input
            id="contact-chat-message"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleEnter}
            placeholder={listening ? "Listening…" : "Ask about your project"}
            className="min-w-0 flex-1 border border-pine-green/20 bg-warm-white px-4 py-3 text-sm text-charcoal placeholder:text-concrete/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
          />

          {/* Microphone button — only rendered when the API is available */}
          {hasSpeechRecognition && (
            <button
              type="button"
              title={listening ? "Stop listening" : "Speak your message"}
              onClick={toggleListening}
              disabled={loading}
              aria-label={listening ? "Stop recording" : "Start voice input"}
              className={`px-4 py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                listening
                  ? "bg-bronze text-warm-white"
                  : "border border-pine-green/20 text-pine-green hover:border-bronze hover:text-bronze"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
                <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
              </svg>
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => sendMessage(input)}
            className="bg-charcoal px-4 py-3 text-sm font-semibold uppercase tracking-wider text-warm-white transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Wait" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
