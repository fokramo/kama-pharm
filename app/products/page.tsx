import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type SP = { [k: string]: string | string[] | undefined };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const cat = typeof sp.cat === "string" ? sp.cat : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : "new";
  const deals = sp.deals === "1";

  const where: Prisma.ProductWhereInput = { active: true };
  if (cat) where.category = { slug: cat };
  if (q) where.name = { contains: q };
  if (deals) where.compareAt = { not: null };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: { select: { name: true, slug: true } } },
    }),
  ]);

  const activeCat = categories.find((c) => c.slug === cat);

  return (
    <div className="container-x" style={{ padding: "28px 20px 40px" }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
        {activeCat ? activeCat.name : deals ? "מבצעים 🏷️" : q ? `תוצאות עבור "${q}"` : "כל המוצרים"}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>{products.length} מוצרים</p>

      {/* category chips */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 18 }}>
        <Link href="/products" className="chip" data-active={!cat}>הכול</Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/products?cat=${c.slug}`} className="chip" data-active={cat === c.slug}>
            {c.icon} {c.name}
          </Link>
        ))}
      </div>

      {/* sort */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <SortSelect value={sort} />
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔍</div>
          לא נמצאו מוצרים. נסו קטגוריה או חיפוש אחר.
        </div>
      ) : (
        <div className="grid-products">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
