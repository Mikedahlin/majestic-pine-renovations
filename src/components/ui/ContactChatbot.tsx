"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/constants";

type Message = {
  role: "assistant" | "visitor";
  text: string;
};

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

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { role: "visitor", text: trimmed },
      { role: "assistant", text: getAssistantReply(trimmed) },
    ]);
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="border border-pine-green/15 bg-warm-white">
      <div className="border-b border-pine-green/10 p-5">
        <p className="text-sm uppercase tracking-widest text-bronze">
          Project Chat
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold uppercase tracking-wide text-pine-green">
          Start Here
        </h2>
      </div>

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
      </div>

      <div className="border-t border-pine-green/10 p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => sendMessage(reply)}
              className="border border-pine-green/20 px-3 py-2 text-xs uppercase tracking-wider text-pine-green transition-colors hover:border-bronze hover:text-bronze"
            >
              {reply}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="contact-chat-message" className="sr-only">
            Message
          </label>
          <input
            id="contact-chat-message"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your project"
            className="min-w-0 flex-1 border border-pine-green/20 bg-warm-white px-4 py-3 text-sm text-charcoal placeholder:text-concrete/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
          />
          <button
            type="submit"
            className="bg-charcoal px-4 py-3 text-sm font-semibold uppercase tracking-wider text-warm-white transition-colors hover:bg-bronze"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
