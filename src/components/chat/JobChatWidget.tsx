import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JobChatWidgetProps {
  onSubmit?: (text: string) => Promise<{ message?: string; error?: string } | void>;
}

const bubbleIcon = (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      fill="currentColor"
      d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4.586L11 20.414 6.586 17H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 2v9h3.414L11 17.586 14.586 15H20V6H4Zm3 2h10v2H7V8Zm0 4h6v2H7v-2Z"
    />
  </svg>
);

const JobChatWidget: React.FC<JobChatWidgetProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "system"; text: string }[]>([
    {
      role: "system",
      text: "Paste a job description or role focus. I'll surface the most relevant bits of this portfolio in each section.",
    },
  ]);

  const disabled = useMemo(() => input.trim().length === 0, [input]);

  async function handleSubmit() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    if (!onSubmit) return;

    setIsSending(true);
    setMessages((prev) => [...prev, { role: "system", text: "Processing... (may retry if rate limited)" }]);
    try {
      const res = await onSubmit(text);
      // Remove the "processing" message
      setMessages((prev) => prev.slice(0, -1));
      if (res?.message) {
        setMessages((prev) => [...prev, { role: "system", text: res.message! }]);
      }
      if (res?.error) {
        setMessages((prev) => [...prev, { role: "system", text: `Error: ${res.error}` }]);
      }
    } catch (e: any) {
      setMessages((prev) => prev.slice(0, -1));
      setMessages((prev) => [...prev, { role: "system", text: "Something went wrong while processing the JD." }]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 text-foreground">
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mb-3 w-80 sm:w-96 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-primary">
                  {bubbleIcon}
                  <span>Role Relevance</span>
                </div>
                <button
                  type="button"
                  className="text-xs text-white/70 hover:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3 px-4 py-3">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`text-sm leading-relaxed rounded-xl px-3 py-2 bg-white/5 ${
                      m.role === "user" ? "border border-primary/30" : "border border-white/10"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 bg-white/5 px-4 py-3 space-y-2">
                <label className="text-xs uppercase tracking-wide text-white/60">Job description or role focus</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                  placeholder="Paste the JD here. We'll tune the sections to match."
                  className="w-full resize-none rounded-lg bg-black/60 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={disabled || isSending}
                  className="w-full rounded-lg bg-primary/90 text-background text-sm font-semibold py-2 hover:bg-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
                <p className="text-[11px] text-white/50 leading-snug">
                  Framework only: hook this up to your relevance logic and update sections when a JD is sent.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-primary text-background shadow-lg shadow-primary/40 px-4 py-3 hover:shadow-primary/60 transition focus:outline-none"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label="Open job description chat"
        >
          {bubbleIcon}
          <span className="text-sm font-semibold hidden sm:inline">Role Chat</span>
        </button>
      </div>
    </div>
  );
};

export default JobChatWidget;
