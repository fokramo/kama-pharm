import Link from "next/link";

export type CategoryLite = {
  name: string;
  slug: string;
  icon?: string | null;
  _count?: { products: number };
};

// Soft pastel blob backgrounds cycled per category (Be-Online style).
const TINTS = [
  "#e0f2fe", "#dcfce7", "#fef3c7", "#fce7f3",
  "#ede9fe", "#ffedd5", "#e0e7ff", "#d1fae5",
];

function tintFor(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TINTS[h % TINTS.length];
}

export default function CategoryCard({ category }: { category: CategoryLite }) {
  return (
    <Link href={`/category/${category.slug}`} className="cat-item">
      <div className="cat-blob" style={{ background: tintFor(category.slug) }}>
        <span style={{ fontSize: 44, lineHeight: 1 }}>{category.icon ?? "💊"}</span>
      </div>
      <span className="cat-label">{category.name}</span>
      {category._count && (
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          {category._count.products} מוצרים
        </span>
      )}
    </Link>
  );
}
