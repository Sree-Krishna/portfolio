import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JobChatWidgetProps {
  onSubmit?: (text: string) => Promise<{ message?: string; error?: string } | void>;
}

const chatCharacter = (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 96 96"
    className="w-12 h-12 drop-shadow-[0_0_14px_rgba(16,185,129,0.65)]"
  >
    <defs>
      <linearGradient id="botBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5ef2c5" />
        <stop offset="100%" stopColor="#0fb981" />
      </linearGradient>
    </defs>
    <rect x="14" y="16" width="68" height="46" rx="14" fill="url(#botBody)" opacity="0.9" />
    <rect x="20" y="22" width="56" height="32" rx="10" fill="#032019" opacity="0.22" />
    <circle cx="36" cy="34" r="7" fill="#03150f" />
    <circle cx="60" cy="34" r="7" fill="#03150f" />
    <rect x="36" y="48" width="24" height="7" rx="3.5" fill="#03150f" />
    <path d="M32 62 L22 78 L40 62" fill="#0fb981" stroke="#5ef2c5" strokeWidth="2" />
    <path d="M64 62 L74 78 L56 62" fill="#0fb981" stroke="#5ef2c5" strokeWidth="2" />
    <rect x="40" y="8" width="16" height="10" rx="4" fill="#0fb981" stroke="#5ef2c5" strokeWidth="2" />
    <rect x="44" y="4" width="8" height="6" rx="3" fill="#5ef2c5" />
  </svg>
);

const JobChatWidget: React.FC<JobChatWidgetProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "system"; text: string }[]>([
    {
      role: "system",
      text: "Let me know what you would like to explore in this portfolio. I'll surface the most relevant bits for each section.",
    },
  ]);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [allowPeriodic, setAllowPeriodic] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initial bubble that vanishes
  useEffect(() => {
    hideTimeoutRef.current = window.setTimeout(() => setBubbleVisible(false), 4200);
    return () => {
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Periodic bubble every 30s until user interacts
  useEffect(() => {
    if (!allowPeriodic) return;
    intervalRef.current = window.setInterval(() => {
      setBubbleVisible(true);
      const t = window.setTimeout(() => setBubbleVisible(false), 5000);
      // Cleanup each cycle hide timeout when effect is re-run/unmounted
      hideTimeoutRef.current = t;
    }, 30000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, [allowPeriodic]);

  const disabled = useMemo(() => input.trim().length === 0, [input]);

  async function handleSubmit() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    if (!onSubmit) return;

    setIsSending(true);
    try {
      const res = await onSubmit(text);
      if (res?.message) {
        setMessages((prev) => [...prev, { role: "system", text: res.message! }]);
      }
      if (res?.error) {
        setMessages((prev) => [...prev, { role: "system", text: `Error: ${res.error}` }]);
      }
    } catch (e: any) {
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
              className="font-mono mb-3 w-80 sm:w-96 rounded-2xl border border-emerald-500/40 bg-[#0a120a]/95 text-emerald-100 shadow-2xl shadow-emerald-500/10 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-500/30 bg-[#0e1b0e]">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-300">
                  {/* {chatCharacter} */}
                  <span>Chat With Neo</span>
                </div>
                <div className="flex items-center gap-3">
                  {isSending && (
                    <div className="flex items-center gap-2 text-emerald-300 text-[11px]">
                      <span className="h-3 w-3 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" aria-label="Thinking" />
                      <span>Thinking...</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="text-[11px] text-emerald-200/80 hover:text-emerald-100 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-3 px-4 py-3 bg-[#0c150c] matrix-scroll">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`text-sm leading-relaxed rounded-xl px-3 py-2 ${
                      m.role === "user"
                        ? "border border-emerald-400/50 bg-emerald-500/10"
                        : "border border-emerald-500/20 bg-black/20"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="border-t border-emerald-500/30 bg-[#0e1b0e] px-4 py-3 space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-emerald-300">Job description or role focus</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={3}
                  placeholder="Ask me about Sree Krishna ..."
                  className="w-full resize-none rounded-lg bg-[#081008] border border-emerald-500/30 px-3 py-2 text-sm text-emerald-100 placeholder:text-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={disabled || isSending}
                  className="w-full rounded-lg bg-emerald-500 text-black text-sm font-semibold py-2 hover:bg-emerald-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition shadow shadow-emerald-500/30"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
                <p className="text-[11px] text-emerald-200/70 leading-snug">
                  Neo here! I surface the most relevant skills and projects based on your request.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex flex-col items-end">
          <AnimatePresence>
            {bubbleVisible && (
              <motion.div
                key="knock"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: -6, scale: 1 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mb-2 relative rounded-xl font-mono text-emerald-100 text-xs px-3 py-2 shadow-[0_0_12px_rgba(16,185,129,0.45)] bg-[#0c150c]/95 border border-emerald-500/40 ring-1 ring-emerald-400/20"
              >
                Knock knock!
                <div className="absolute right-4 -bottom-2 w-3 h-3 bg-[#0c150c] rotate-45 border-r border-b border-emerald-500/40 shadow-[2px_2px_8px_rgba(16,185,129,0.35)]" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            className="flex items-center justify-center rounded-full p-3 bg-transparent focus:outline-none"
            onClick={() => {
              setIsOpen((v) => !v);
              setBubbleVisible(false);
              setAllowPeriodic(false);
            }}
            aria-expanded={isOpen}
            aria-label="Open job description chat"
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.94 }}
            animate={{ x: isOpen ? -22 : 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
          >
            <motion.div
              animate={{
                rotate: isOpen ? 6 : -6,
                y: [0, -6, 0],
              }}
              transition={{
                rotate: { repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut" },
                y: { repeat: Infinity, repeatType: "loop", duration: 2.4, ease: "easeInOut" },
              }}
            >
              {chatCharacter}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default JobChatWidget;
