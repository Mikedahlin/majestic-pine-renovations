"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONTACT } from "@/lib/constants";

type ChatImage = {
  mimeType: string;
  data: string;
  previewUrl: string;
};

type Message = {
  role: "assistant" | "visitor";
  text: string;
  image?: ChatImage;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: Array<Array<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const quickReplies = [
  "I want a remodel",
  "I need commercial work",
  "What areas do you serve?",
  "How soon can we talk?",
] as const;

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function getAssistantReply(input: string, hasImage: boolean): string {
  if (hasImage) {
    return "Thanks for sharing that photo. Add your location, timeline, and budget in the form below so the team can review everything together.";
  }

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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

function toApiImage(image: ChatImage) {
  return {
    mimeType: image.mimeType,
    data: image.data,
  };
}

function toApiMessages(messages: Message[]) {
  return messages.map((message) => ({
    role: message.role,
    text: message.text,
    image: message.image ? toApiImage(message.image) : undefined,
  }));
}

export function ContactChatbot() {
  const openingMessage = useMemo<Message>(
    () => ({
      role: "assistant",
      text: "Hi, I can help you figure out what details to send before the team reviews your project. You can type, use the mic, or attach a project photo.",
    }),
    [],
  );
  const [messages, setMessages] = useState<Message[]>([openingMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [attachedImage, setAttachedImage] = useState<ChatImage | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading, attachedImage]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis.cancel();
    };
  }, []);

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setErrorMessage("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function getSpeechRecognition() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) return null;
    return new Recognition();
  }

  function toggleListening() {
    setErrorMessage("");

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = getSpeechRecognition();
    if (!recognition) {
      setErrorMessage("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setInput((current) => (current ? `${current} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => {
      setErrorMessage("Could not capture audio. Please check microphone permissions and try again.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  async function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage("");
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setErrorMessage("Images must be 4MB or smaller.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const [, base64 = ""] = dataUrl.split(",", 2);

      setAttachedImage({
        mimeType: file.type,
        data: base64,
        previewUrl: dataUrl,
      });
    } catch {
      setErrorMessage("Could not load that image. Please try another file.");
    }
  }

  function clearAttachedImage() {
    setAttachedImage(null);
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if ((!trimmed && !attachedImage) || loading) return;

    setErrorMessage("");

    const visitorMessage: Message = {
      role: "visitor",
      text: trimmed || "Shared a project photo",
      image: attachedImage ?? undefined,
    };
    const nextMessages = [...messages, visitorMessage];

    setMessages(nextMessages);
    setInput("");
    setAttachedImage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/contact-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toApiMessages(nextMessages) }),
      });

      const data = await response.json();
      const reply =
        response.ok && typeof data.reply === "string"
          ? data.reply
          : getAssistantReply(trimmed, Boolean(visitorMessage.image));

      setMessages((current) => [
        ...current,
        { role: "assistant", text: reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: getAssistantReply(trimmed, Boolean(visitorMessage.image)) },
      ]);
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

  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");

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
            <div
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                message.role === "visitor"
                  ? "bg-pine-green text-warm-white"
                  : "bg-pine-green/5 text-concrete"
              }`}
            >
              {message.image && (
                <img
                  src={message.image.previewUrl}
                  alt="Project photo shared in chat"
                  className="mb-3 max-h-40 w-full rounded-sm object-cover"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
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

        {attachedImage && (
          <div className="mb-4 flex items-center gap-3 border border-pine-green/10 p-3">
            <img
              src={attachedImage.previewUrl}
              alt="Selected project photo"
              className="h-16 w-16 object-cover"
            />
            <div className="min-w-0 flex-1 text-sm text-concrete">
              Photo attached. Add a note or send it as-is.
            </div>
            <button
              type="button"
              onClick={clearAttachedImage}
              className="text-xs uppercase tracking-wider text-bronze hover:text-pine-green"
            >
              Remove
            </button>
          </div>
        )}

        {errorMessage && (
          <p className="mb-4 text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        )}

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
            placeholder="Ask about your project"
            className="min-w-0 flex-1 border border-pine-green/20 bg-warm-white px-4 py-3 text-sm text-charcoal placeholder:text-concrete/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach project photo"
            className="border border-pine-green/20 px-3 py-3 text-pine-green transition-colors hover:border-bronze hover:text-bronze disabled:cursor-not-allowed disabled:opacity-50"
            title="Attach photo"
          >
            Img
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={toggleListening}
            aria-label={listening ? "Stop voice input" : "Start voice input"}
            aria-pressed={listening}
            className={`border px-3 py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              listening
                ? "border-bronze bg-bronze text-warm-white"
                : "border-pine-green/20 text-pine-green hover:border-bronze hover:text-bronze"
            }`}
            title={listening ? "Stop listening" : "Use microphone"}
          >
            Mic
          </button>
          <button
            type="button"
            disabled={loading || !lastAssistantMessage}
            onClick={() =>
              speaking && lastAssistantMessage
                ? stopSpeaking()
                : lastAssistantMessage && speak(lastAssistantMessage.text)
            }
            aria-label={speaking ? "Stop reading reply" : "Read latest reply aloud"}
            className={`border px-3 py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              speaking
                ? "border-bronze bg-bronze text-warm-white"
                : "border-pine-green/20 text-pine-green hover:border-bronze hover:text-bronze"
            }`}
            title={speaking ? "Stop audio" : "Read reply aloud"}
          >
            Audio
          </button>
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
