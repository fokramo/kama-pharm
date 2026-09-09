"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/account/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => { router.push("/account"); router.refresh(); }, 1600);
    } else {
      setError(data.error ?? "אירעה שגיאה");
    }
  }

  return (
    <div className="container-x" style={{ padding: "50px 20px", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ padding: 30, width: "100%", maxWidth: 400 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>בחירת סיסמה חדשה</h1>
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--brand-700)" }}>
            <CheckCircle2 size={44} style={{ margin: "0 auto 10px" }} />
            <p style={{ fontWeight: 700 }}>הסיסמה עודכנה בהצלחה!</p>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>מעבירים אותך לחשבון…</p>
          </div>
        ) : !token ? (
          <p style={{ textAlign: "center", color: "var(--danger)", padding: "16px 0" }}>קישור לא תקין.</p>
        ) : (
          <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 14 }}>
            <div>
              <label className="label">סיסמה חדשה (6 תווים לפחות)</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", insetInlineStart: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required style={{ paddingInlineStart: 40 }} />
              </div>
            </div>
            {error && <div style={{ background: "#fef2f2", color: "var(--danger)", padding: "9px 12px", borderRadius: 10, fontSize: 14 }}>{error}</div>}
            <button className="btn btn-primary" style={{ width: "100%", padding: 13 }} disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : "עדכן סיסמה"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={<div className="container-x" style={{ padding: 60, textAlign: "center" }}>טוען…</div>}>
      <ResetInner />
    </Suspense>
  );
}
