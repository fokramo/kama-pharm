"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, Loader2, Lock } from "lucide-react";

function MockPayInner() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("order");
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    await fetch("/api/payment/mock-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    router.push(`/checkout/success?order=${orderId}`);
  }

  return (
    <div className="container-x" style={{ padding: "40px 20px", maxWidth: 480 }}>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--brand-50)", color: "var(--brand-700)", display: "grid", placeItems: "center", margin: "0 auto 12px" }}>
            <Lock size={26} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>עמוד סליקה מאובטח</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>הזמנה מס׳ #{orderId}</p>
        </div>

        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 20 }}>
          🧪 מצב הדגמה — זהו עמוד סליקה לדוגמה. לאחר חיבור בואבת PayPlus/Tranzila, יופיע כאן עמוד הסליקה האמיתי לתשלום בכרטיס אשראי.
        </div>

        <div style={{ display: "grid", gap: 14, opacity: 0.75, pointerEvents: "none" }}>
          <div>
            <label className="label">מספר כרטיס</label>
            <div className="input" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>4580 •••• •••• 0000</span>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label className="label">תוקף</label><div className="input">12 / 28</div></div>
            <div><label className="label">CVV</label><div className="input">•••</div></div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: "100%", marginTop: 22, fontSize: 16, padding: 14 }} onClick={pay} disabled={loading}>
          {loading ? <><Loader2 size={18} className="spin" /> מבצע תשלום…</> : "שלם עכשיו (הדגמה)"}
        </button>
      </div>
    </div>
  );
}

export default function MockPayPage() {
  return (
    <Suspense fallback={<div className="container-x" style={{ padding: 60, textAlign: "center" }}>טוען…</div>}>
      <MockPayInner />
    </Suspense>
  );
}
