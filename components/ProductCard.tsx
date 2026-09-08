"use client";

import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, calcDiscount } from "@/lib/format";

export type ProductLite = {
  id: string;
  name: string;
  price: number;
  compareAt?: number | null;
  image?: string | null;
  stock: number;
  requiresRx?: boolean;
  category?: { name: string; slug: string } | null;
};

export default function ProductCard({ product }: { product: ProductLite }) {
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);
  const discount = calcDiscount(product.price, product.compareAt);
  const out = product.stock <= 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (out) return;
    add({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="card"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", transition: "transform .15s ease, box-shadow .2s ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
    >
      <div style={{ position: "absolute", top: 10, insetInlineStart: 10, zIndex: 2, display: "flex", flexDirection: "column", gap: 6 }}>
        {discount > 0 && (
          <span className="badge" style={{ background: "var(--danger)", color: "#fff" }}>-{discount}%</span>
        )}
        {product.requiresRx && (
          <span className="badge" style={{ background: "#fff7ed", color: "var(--warn)", border: "1px solid #fed7aa" }}>מרשם</span>
        )}
      </div>

      <div style={{ aspectRatio: "1/1", background: "var(--surface-2)", display: "grid", placeItems: "center", overflow: "hidden" }}>
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 60 }}>💊</span>
        )}
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {product.category && (
          <span style={{ fontSize: 12, color: "var(--brand-600)", fontWeight: 600 }}>{product.category.name}</span>
        )}
        <h3 className="clamp-2" style={{ fontSize: 15, fontWeight: 600, minHeight: 40 }}>{product.name}</h3>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "var(--brand-700)" }}>{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span style={{ fontSize: 13, color: "var(--muted)", textDecoration: "line-through", marginInlineStart: 6 }}>
                {formatPrice(product.compareAt!)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={out}
            className="btn btn-primary"
            style={{ padding: 9, borderRadius: 12, minWidth: 40 }}
            aria-label="הוסף לעגלה"
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        </div>
        {out && <span style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>אזל מהמלאי</span>}
      </div>
    </Link>
  );
}
