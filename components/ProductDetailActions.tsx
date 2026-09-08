"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingCart, Check, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";

type Props = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  stock: number;
};

export default function ProductDetailActions({ id, name, price, image, stock }: Props) {
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const out = stock <= 0;

  function handleAdd(openDrawer: boolean) {
    add({ id, name, price, image }, qty);
    setAdded(true);
    if (openDrawer) setOpen(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {!out && (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontWeight: 600, color: "var(--ink-soft)" }}>כמות:</span>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)", borderRadius: 999 }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ padding: 10, cursor: "pointer" }} aria-label="הפחת"><Minus size={16} /></button>
            <span style={{ minWidth: 40, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(stock, q + 1))} style={{ padding: 10, cursor: "pointer" }} aria-label="הוסף"><Plus size={16} /></button>
          </div>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{stock} במלאי</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" style={{ flex: 1, minWidth: 180, fontSize: 16, padding: "14px 22px" }} disabled={out} onClick={() => handleAdd(true)}>
          {added ? <><Check size={18} /> נוסף לעגלה</> : <><ShoppingCart size={18} /> הוסף לעגלה</>}
        </button>
        <button
          className="btn btn-outline"
          style={{ fontSize: 16, padding: "14px 22px" }}
          disabled={out}
          onClick={() => { handleAdd(false); router.push("/checkout"); }}
        >
          קנה עכשיו
        </button>
      </div>

      <button
        onClick={() => router.push(`/consult?product=${encodeURIComponent(id)}`)}
        className="btn btn-ghost"
        style={{ justifyContent: "flex-start", gap: 8 }}
      >
        <Sparkles size={18} style={{ color: "var(--brand-600)" }} /> שאל את היועץ החכם על המוצר
      </button>
    </div>
  );
}
