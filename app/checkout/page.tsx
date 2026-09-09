"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice, calcShipping, FREE_SHIPPING_OVER } from "@/lib/format";
import { ShieldCheck, CreditCard, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  function upd(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "אירעה שגיאה");
        setLoading(false);
        return;
      }
      clear();
      window.location.href = data.paymentUrl;
    } catch {
      setError("שגיאת רשת. נסו שוב.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x" style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>🛒</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>העגלה שלך ריקה</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>הוסיפו מוצרים כדי להמשיך לתשלום.</p>
        <Link href="/products" className="btn btn-primary">למעבר לחנות</Link>
      </div>
    );
  }

  return (
    <div className="container-x" style={{ padding: "28px 20px 40px" }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 24 }}>סיום הזמנה</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28 }} className="product-grid">
        {/* form */}
        <form onSubmit={submit} className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>פרטי משלוח</h2>
          <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="label">שם מלא *</label>
              <input className="input" value={form.customerName} onChange={upd("customerName")} required />
            </div>
            <div>
              <label className="label">טלפון *</label>
              <input className="input" type="tel" value={form.phone} onChange={upd("phone")} required />
            </div>
            <div>
              <label className="label">אימייל</label>
              <input className="input" type="email" value={form.email} onChange={upd("email")} />
            </div>
            <div>
              <label className="label">עיר *</label>
              <input className="input" value={form.city} onChange={upd("city")} required />
            </div>
            <div>
              <label className="label">כתובת (רחוב ומספר) *</label>
              <input className="input" value={form.address} onChange={upd("address")} required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="label">הערות להזמנה</label>
              <textarea className="textarea" rows={3} value={form.notes} onChange={upd("notes")} />
            </div>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", color: "var(--danger)", padding: "10px 14px", borderRadius: 10, marginTop: 16, fontSize: 14 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 20, fontSize: 16, padding: "14px" }} disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> מעבד…</> : <><CreditCard size={18} /> המשך לתשלום מאובטח</>}
          </button>
          <p style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 12, fontSize: 13, color: "var(--muted)" }}>
            <ShieldCheck size={15} /> התשלום מתבצע בעמוד סליקה מאובטח ומוצפן
          </p>
        </form>

        {/* summary */}
        <div>
          <div className="card" style={{ padding: 20, position: "sticky", top: 96 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>סיכום הזמנה</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 14 }}>
              {items.map((it) => (
                <div key={it.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 10, background: "var(--surface-2)", display: "grid", placeItems: "center", flexShrink: 0, overflow: "hidden" }}>
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : "💊"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="clamp-1" style={{ fontSize: 13.5, fontWeight: 600 }}>{it.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{it.qty} × {formatPrice(it.price)}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(it.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, display: "grid", gap: 8, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>סכום ביניים</span><span>{formatPrice(subtotal)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>משלוח</span>
                <span>{shipping === 0 ? <b style={{ color: "var(--brand-700)" }}>חינם</b> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  משלוח חינם בקנייה מעל {formatPrice(FREE_SHIPPING_OVER)}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 4 }}>
                <span>סה״כ לתשלום</span><span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
