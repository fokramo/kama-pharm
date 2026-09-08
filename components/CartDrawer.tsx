"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, calcShipping, FREE_SHIPPING_OVER } from "@/lib/format";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, subtotal, count } = useCart();
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const shipping = calcShipping(subtotal);
  const remaining = Math.max(0, FREE_SHIPPING_OVER - subtotal);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, background: "rgba(2,6,23,0.45)",
          opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s", zIndex: 60,
        }}
      />
      <aside
        style={{
          position: "fixed", top: 0, bottom: 0, insetInlineStart: 0,
          width: "min(420px, 92vw)", background: "var(--surface)", zIndex: 61,
          transform: isOpen ? "translateX(0)" : "translateX(105%)",
          transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          display: "flex", flexDirection: "column", boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShoppingBag size={20} style={{ color: "var(--brand-600)" }} /> עגלת הקניות ({count})
          </h3>
          <button onClick={() => setOpen(false)} className="btn btn-ghost" style={{ padding: 8, borderRadius: 10 }} aria-label="סגור">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 30, color: "var(--muted)" }}>
            <div>
              <ShoppingBag size={54} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
              <p>העגלה שלך ריקה</p>
              <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => setOpen(false)}>
                המשך בקנייה
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((it) => (
                <div key={it.id} style={{ display: "flex", gap: 12, padding: 10, border: "1px solid var(--line)", borderRadius: 14 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 10, background: "var(--surface-2)", overflow: "hidden", flexShrink: 0, display: "grid", placeItems: "center" }}>
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 26 }}>💊</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="clamp-2" style={{ fontWeight: 600, fontSize: 14 }}>{it.name}</div>
                    <div style={{ color: "var(--brand-700)", fontWeight: 700, marginTop: 2 }}>{formatPrice(it.price)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999 }}>
                        <button onClick={() => setQty(it.id, it.qty - 1)} style={{ padding: 6, cursor: "pointer" }} aria-label="הפחת"><Minus size={14} /></button>
                        <span style={{ minWidth: 28, textAlign: "center", fontWeight: 600 }}>{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} style={{ padding: 6, cursor: "pointer" }} aria-label="הוסף"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => remove(it.id)} style={{ color: "var(--danger)", cursor: "pointer", padding: 6 }} aria-label="הסר"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--line)", padding: 18 }}>
              {remaining > 0 ? (
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
                  הוסף עוד <b style={{ color: "var(--brand-700)" }}>{formatPrice(remaining)}</b> למשלוח חינם! 🚚
                </p>
              ) : (
                <p style={{ fontSize: 13, color: "var(--brand-700)", marginBottom: 10, fontWeight: 600 }}>זכית במשלוח חינם! 🎉</p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span>סכום ביניים</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 10 }}>
                <span>משלוח</span><span>{shipping === 0 ? "חינם" : formatPrice(shipping)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17, marginBottom: 14 }}>
                <span>סה״כ</span><span>{formatPrice(subtotal + shipping)}</span>
              </div>
              <Link href="/checkout" className="btn btn-primary" style={{ width: "100%" }} onClick={() => setOpen(false)}>
                למעבר לתשלום
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
