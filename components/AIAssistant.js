"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Minimize2, Sparkles } from "lucide-react";

export default function AIAssistant({ task, lessonTitle }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Bună! Sunt asistentul tău AI ✨\n\nTe ajut cu indicii și explicații — fără să îți dau răspunsul direct. Gânditul singur e cel mai bun antrenament!\n\nCe nelămuriri ai?`,
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          taskQuestion: task?.question || "",
          taskOptions: task?.options || [],
          lessonTitle: lessonTitle || "",
        }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Eroare de conexiune. Încearcă din nou." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-[22rem] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ height: "420px" }}>
          <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm">Asistent AI</p>
              <p className="text-xs text-purple-200 truncate">
                {task ? (task.question.length > 45 ? task.question.slice(0, 45) + "…" : task.question) : (lessonTitle || "Gata să te ajut")}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors ml-1 flex-shrink-0">
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mr-1.5 mt-0.5">
                    <Bot className="w-3 h-3 text-purple-600" />
                  </div>
                )}
                <div className={`max-w-[84%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap
                  ${msg.role === "user"
                    ? "bg-indigo-500 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mr-1.5">
                  <Bot className="w-3 h-3 text-purple-600" />
                </div>
                <div className="bg-slate-100 px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-slate-100 flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Întreabă ceva…"
                className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-purple-300 text-slate-800 placeholder:text-slate-400"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-indigo-500 text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-50 flex-shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        title={open ? "Închide asistentul" : "Deschide asistentul AI"}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95
          ${open
            ? "bg-slate-700 text-white"
            : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"}`}>
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
