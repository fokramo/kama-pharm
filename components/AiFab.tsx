"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Send, Loader2, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "מה מומלץ להצטננות?",
  "ויטמינים לחורף",
  "משהו לעור יבש",
];

function RobotFace({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden className="robot-svg">
      {/* antenna */}
      <line x1="32" y1="6" x2="32" y2="14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle className="robot-antenna" cx="32" cy="5" r="3.4" fill="#fbbf24" />
      {/* head */}
      <rect x="12" y="14" width="40" height="34" rx="12" fill="#fff" />
      <rect x="12" y="14" width="40" height="34" rx="12" fill="url(#rg)" fillOpacity="0.12" />
      {/* eyes */}
      <g className="robot-eyes" fill="#047857">
        <circle cx="24" cy="30" r="4.6" />
        <circle cx="40" cy="30" r="4.6" />
      </g>
      {/* smile */}
      <path d="M24 39c2.5 2.6 13.5 2.6 16 0" stroke="#047857" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {/* ears */}
      <rect x="7" y="26" width="4" height="10" rx="2" fill="#fff" />
      <rect x="53" y="26" width="4" height="10" rx="2" fill="#fff" />
      <defs>
        <linearGradient id="rg" x1="12" y1="14" x2="52" y2="48">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AiFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [greet, setGreet] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setGreet(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Hide the assistant inside the admin area.
  if (pathname?.startsWith("/kp-control")) return null;

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let acc = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setMessages((m) => {
            const c = [...m];
            c[c.length - 1] = { role: "assistant", content: acc };
            return c;
          });
        }
      }
    } catch {
      setMessages((m) => {
        const c = [...m];
        c[c.length - 1] = { role: "assistant", content: "אירעה שגיאה. נסו שוב." };
        return c;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="ai-panel">
          <div className="ai-panel-head">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "grid", placeItems: "center" }}>
                <RobotFace size={30} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>היועץ החכם</div>
                <div style={{ fontSize: 12, opacity: 0.85, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: "#4ade80", display: "inline-block" }} /> מקוון עכשיו
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="סגור" style={{ color: "#fff", cursor: "pointer", padding: 4 }}>
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="ai-panel-body">
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "18px 8px" }}>
                <div style={{ margin: "0 auto 8px", width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,var(--brand-500),var(--brand-700))", display: "grid", placeItems: "center" }}>
                  <RobotFace size={40} />
                </div>
                <p style={{ fontWeight: 700, color: "var(--ink)" }}>שלום! 👋 אני היועץ החכם</p>
                <p style={{ fontSize: 13.5, marginTop: 4 }}>ספרו לי מה אתם מחפשים ואמליץ על המוצרים המתאימים.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 14 }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="chip" style={{ fontSize: 12.5, padding: "6px 12px" }} onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
                  <div style={{
                    maxWidth: "85%", padding: "9px 13px", borderRadius: 14, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
                    background: m.role === "user" ? "var(--brand-600)" : "var(--surface-2)",
                    color: m.role === "user" ? "#fff" : "var(--ink)",
                    border: m.role === "user" ? "none" : "1px solid var(--line)",
                  }}>
                    {m.content || "…"}
                  </div>
                </div>
              ))
            )}
            {loading && messages[messages.length - 1]?.content === "" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13 }}>
                <Loader2 size={14} className="spin" /> חושב…
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="ai-panel-foot">
            <input className="input" placeholder="כתבו הודעה…" value={input} onChange={(e) => setInput(e.target.value)} style={{ height: 42 }} />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()} style={{ padding: "0 16px", height: 42 }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Greeting bubble */}
      {!open && greet && (
        <div className="ai-greet" onClick={() => { setOpen(true); setGreet(false); }}>
          <b>צריכים עזרה?</b> שאלו אותי 💬
          <button onClick={(e) => { e.stopPropagation(); setGreet(false); }} aria-label="סגור" style={{ marginInlineStart: 6, color: "var(--muted)", cursor: "pointer" }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Floating robot button */}
      <button
        className="ai-fab"
        onClick={() => { setOpen((v) => !v); setGreet(false); }}
        aria-label="פתח את היועץ החכם"
      >
        {open ? <X size={26} color="#fff" /> : <RobotFace size={40} />}
        {!open && <span className="ai-fab-badge"><Sparkles size={11} /></span>}
      </button>
    </>
  );
}
