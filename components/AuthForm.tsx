"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock } from "lucide-react";

export default function AuthForm() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", marketingConsent: true });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function upd(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const url = tab === "login" ? "/api/account/login" : "/api/account/register";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      router.push("/account");
      router.refresh();
    } else {
      setError(data.error ?? "אירעה שגיאה");
    }
  }

  return (
    <div className="container-x" style={{ padding: "40px 20px", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ padding: 30, width: "100%", maxWidth: 430 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 4 }}>
          {tab === "login" ? "התחברות לחשבון" : "יצירת חשבון חדש"}
        </h1>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
          {tab === "login" ? "התחברו כדי לצפות בהזמנות שלכם" : "הצטרפו לקמא פארם ותהנו ממעקב הזמנות ומבצעים"}
        </p>

        {/* tabs */}
        <div style={{ display: "flex", background: "var(--surface-2)", borderRadius: 12, padding: 4, marginBottom: 22 }}>
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 9, fontWeight: 700, fontSize: 14, cursor: "pointer",
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? "var(--brand-700)" : "var(--muted)",
                boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              }}
            >
              {t === "login" ? "התחברות" : "הרשמה"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          {tab === "register" && (
            <Field icon={<User size={16} />} label="שם מלא">
              <input className="input" value={form.name} onChange={upd("name")} required style={{ paddingInlineStart: 40 }} />
            </Field>
          )}
          <Field icon={<Mail size={16} />} label="אימייל">
            <input className="input" type="email" value={form.email} onChange={upd("email")} required style={{ paddingInlineStart: 40 }} />
          </Field>
          <Field icon={<Lock size={16} />} label="סיסמה">
            <input className="input" type="password" value={form.password} onChange={upd("password")} required minLength={6} style={{ paddingInlineStart: 40 }} />
          </Field>

          {tab === "register" && (
            <label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, color: "var(--ink-soft)", cursor: "pointer" }}>
              <input type="checkbox" checked={form.marketingConsent} onChange={upd("marketingConsent")} style={{ width: 18, height: 18, accentColor: "var(--brand-600)", marginTop: 1 }} />
              <span>אני מאשר/ת קבלת דיוור פרסומי, מבצעים והטבות מקמא פארם בדוא״ל.</span>
            </label>
          )}

          {error && (
            <div style={{ background: "#fef2f2", color: "var(--danger)", padding: "9px 12px", borderRadius: 10, fontSize: 14 }}>{error}</div>
          )}

          <button className="btn btn-primary" style={{ width: "100%", padding: 13 }} disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : tab === "login" ? "התחבר" : "הרשמה וכניסה"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--muted)", marginTop: 16 }}>
          {tab === "login" ? "אין לך חשבון? " : "יש לך כבר חשבון? "}
          <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(null); }} style={{ color: "var(--brand-700)", fontWeight: 700, cursor: "pointer" }}>
            {tab === "login" ? "הירשמו כאן" : "התחברו כאן"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", insetInlineStart: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>{icon}</span>
        {children}
      </div>
    </div>
  );
}
