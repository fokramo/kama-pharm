import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ProductDetailActions from "@/components/ProductDetailActions";
import { formatPrice, calcDiscount } from "@/lib/format";
import { ShieldCheck, Truck, RotateCcw, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product || !product.active) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
    take: 5,
    include: { category: { select: { name: true, slug: true } } },
  });

  const discount = calcDiscount(product.price, product.compareAt);

  return (
    <div className="container-x" style={{ padding: "28px 20px 40px" }}>
      <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        <Link href="/">בית</Link> /{" "}
        <Link href={`/category/${product.category.slug}`}>{product.category.name}</Link> /{" "}
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 40 }} className="product-grid">
        {/* image */}
        <div className="card" style={{ aspectRatio: "1/1", display: "grid", placeItems: "center", overflow: "hidden", position: "relative" }}>
          {discount > 0 && (
            <span className="badge" style={{ position: "absolute", top: 14, insetInlineStart: 14, background: "var(--danger)", color: "#fff", fontSize: 14 }}>
              -{discount}%
            </span>
          )}
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 140 }}>💊</span>
          )}
        </div>

        {/* info */}
        <div>
          <Link href={`/category/${product.category.slug}`} style={{ color: "var(--brand-600)", fontWeight: 600, fontSize: 14 }}>
            {product.category.icon} {product.category.name}
          </Link>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "8px 0 14px" }}>{product.name}</h1>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: "var(--brand-700)" }}>{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span style={{ fontSize: 20, color: "var(--muted)", textDecoration: "line-through" }}>{formatPrice(product.compareAt!)}</span>
            )}
          </div>

          {product.requiresRx && (
            <div style={{ display: "flex", gap: 8, background: "#fff7ed", border: "1px solid #fed7aa", color: "var(--warn)", padding: "10px 14px", borderRadius: 12, marginBottom: 16, fontSize: 14 }}>
              <AlertTriangle size={18} /> מוצר זה מצריך מרשם רופא. נציג ייצור עמכם קשר לאימות לפני המשלוח.
            </div>
          )}

          <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.75, marginBottom: 24 }}>{product.description}</p>

          <ProductDetailActions id={product.id} name={product.name} price={product.price} image={product.image} stock={product.stock} />

          <div style={{ display: "grid", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
            {[
              { icon: <Truck size={18} />, t: "משלוח עד הבית תוך 1–3 ימי עסקים" },
              { icon: <ShieldCheck size={18} />, t: "תשלום מאובטח בכרטיס אשראי" },
              { icon: <RotateCcw size={18} />, t: "החזרה עד 14 יום (בכפוף לתקנון)" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--ink-soft)", fontSize: 14 }}>
                <span style={{ color: "var(--brand-600)" }}>{r.icon}</span> {r.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>מוצרים דומים</h2>
          <div className="grid-products">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
