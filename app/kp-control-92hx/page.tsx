"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (res.ok) {
      router.push("/kp-control-92hx/dashboard");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "שגיאה בהתחברות");
      setLoading(false);
    }
  }

  return (
    <div className="container-x" style={{ padding: "60px 20px", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "inline-block", marginBottom: 8 }}><Logo /></div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 10 }}>כניסת מנהל</h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>ניהול מוצרים, מחירים והזמנות</p>
        </div>
        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <div>
            <label className="label">שם משתמש</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
          </div>
          <div>
            <label className="label">אימייל</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">סיסמה</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && (
            <div style={{ background: "#fef2f2", color: "var(--danger)", padding: "9px 12px", borderRadius: 10, fontSize: 14 }}>{error}</div>
          )}
          <button className="btn btn-primary" style={{ width: "100%", padding: 13 }} disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : <><Lock size={16} /> התחבר</>}
          </button>
        </form>
      </div>
    </div>
  );
}
