"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Send, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "מה מומלץ להצטננות וכאב גרון?",
  "אילו ויטמינים כדאי לקחת בחורף?",
  "משהו לעור יבש בפנים?",
  "מוצרים מומלצים לתינוק בן חצי שנה",
];

function ConsultInner() {
  const params = useSearchParams();
  const productId = params.get("product") ?? undefined;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // placeholder assistant message we stream into
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, productId }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "אירעה שגיאה. נסו שוב." };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="container-x" style={{ padding: "24px 20px 40px", maxWidth: 820 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,var(--brand-500),var(--brand-700))", display: "grid", placeItems: "center", color: "#fff" }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>היועץ החכם של קמא פארם</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>ייעוץ מוצרים מותאם אישית · מבוסס בינה מלאכותית</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="card"
        style={{ height: "min(56vh, 520px)", overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}
      >
        {empty ? (
          <div style={{ margin: "auto", textAlign: "center", color: "var(--muted)", maxWidth: 460 }}>
            <div style={{ fontSize: 46, marginBottom: 10 }}>👋</div>
            <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>שלום! איך אפשר לעזור לך היום?</p>
            <p style={{ fontSize: 14 }}>ספר/י לי מה חשוב לך ואמליץ על המוצרים המתאימים ביותר מהחנות.</p>
          </div>
        ) : (
          messages.map((m, i) => <Bubble key={i} msg={m} />)
        )}
        {loading && messages[messages.length - 1]?.content === "" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 14 }}>
            <Loader2 size={16} className="spin" /> חושב…
          </div>
        )}
      </div>

      {empty && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        style={{ display: "flex", gap: 10, marginTop: 14 }}
      >
        <input className="input" placeholder="כתוב/י את שאלתך…" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()} style={{ padding: "0 20px" }}>
          <Send size={18} />
        </button>
      </form>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10, textAlign: "center" }}>
        המידע הוא כללי בלבד ואינו מהווה תחליף לייעוץ רפואי מקצועי.
      </p>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-start" : "flex-end" }}>
      <div
        style={{
          maxWidth: "82%",
          padding: "11px 15px",
          borderRadius: 16,
          fontSize: 15,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          background: isUser ? "var(--brand-600)" : "var(--surface-2)",
          color: isUser ? "#fff" : "var(--ink)",
          border: isUser ? "none" : "1px solid var(--line)",
          borderStartStartRadius: isUser ? 4 : 16,
          borderStartEndRadius: isUser ? 16 : 4,
        }}
      >
        {msg.content || "…"}
      </div>
    </div>
  );
}

export default function ConsultPage() {
  return (
    <Suspense fallback={<div className="container-x" style={{ padding: 60, textAlign: "center" }}>טוען…</div>}>
      <ConsultInner />
    </Suspense>
  );
}
