import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="container-x" style={{ padding: "28px 20px 40px" }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>קטגוריות</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        עיינו במגוון הרחב של מוצרי הבריאות והטיפוח שלנו
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16 }}>
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
