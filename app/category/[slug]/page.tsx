import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        orderBy: { createdAt: "desc" },
        include: { category: { select: { name: true, slug: true } } },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="container-x" style={{ padding: "28px 20px 40px" }}>
      <nav style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
        <Link href="/">בית</Link> / <Link href="/categories">קטגוריות</Link> /{" "}
        <span style={{ color: "var(--ink)" }}>{category.name}</span>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--brand-50)", display: "grid", placeItems: "center", fontSize: 32 }}>
          {category.icon ?? "💊"}
        </div>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800 }}>{category.name}</h1>
          <p style={{ color: "var(--muted)" }}>{category.products.length} מוצרים</p>
        </div>
      </div>

      {category.products.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
          אין מוצרים בקטגוריה זו כרגע.
        </div>
      ) : (
        <div className="grid-products">
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
