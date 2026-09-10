import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import HeroCarousel from "@/components/HeroCarousel";
import { Sparkles, Truck, ShieldCheck, Clock, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured, banners] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: { select: { name: true, slug: true } } },
      take: 12,
      orderBy: { createdAt: "desc" },
    }),
    prisma.banner.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
  ]);

  const slides = banners.map((b) => ({
    title: b.title,
    subtitle: b.subtitle,
    cta: b.cta,
    href: b.href,
    emoji: b.emoji,
    gradient: `linear-gradient(120deg, ${b.color1}, ${b.color2})`,
  }));

  return (
    <div>
      {/* AUTO-ROTATING PROMO CAROUSEL */}
      <section className="container-x" style={{ paddingTop: 20 }}>
        <HeroCarousel slides={slides} />
      </section>

      {/* CATEGORIES GRID (lead section) */}
      <section className="container-x" style={{ padding: "34px 20px 10px" }}>
        <SectionHeader title="קטגוריות" href="/categories" linkText="לכל הקטגוריות" />
        <div className="cat-grid" style={{ marginTop: 16 }}>
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="container-x" style={{ padding: "22px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
          {[
            { icon: <Truck size={22} />, t: "משלוח מהיר", s: "עד הבית תוך 1–3 ימי עסקים" },
            { icon: <ShieldCheck size={22} />, t: "תשלום מאובטח", s: "הצפנה מלאה בכרטיס אשראי" },
            { icon: <Sparkles size={22} />, t: "ייעוץ חכם", s: "המלצות מותאמות אישית" },
            { icon: <Clock size={22} />, t: "שירות זמין", s: "צוות מקצועי א׳–ה׳ 08:00–20:00" },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--brand-50)", color: "var(--brand-700)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{f.t}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS THAT INTEREST YOU */}
      <section className="container-x" style={{ padding: "20px 20px 8px" }}>
        <SectionHeader title="מוצרים שיעניינו אותך" href="/products" linkText="לכל המוצרים" />
        <div className="grid-products" style={{ marginTop: 16 }}>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* AI BANNER */}
      <section className="container-x" style={{ padding: "40px 20px" }}>
        <div style={{ background: "linear-gradient(135deg,var(--brand-700),var(--brand-600))", borderRadius: 24, padding: "40px 32px", color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", insetInlineEnd: -30, top: -30, fontSize: 200, opacity: 0.12 }}>🤖</div>
          <div style={{ position: "relative", maxWidth: 620 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>לא בטוחים איזה מוצר מתאים לכם?</h2>
            <p style={{ fontSize: 16, opacity: 0.92, marginBottom: 20 }}>
              היועץ החכם של קמא פארם ישאל אתכם כמה שאלות וימליץ על המוצרים המתאימים ביותר — בחינם ובאופן מיידי.
            </p>
            <Link href="/consult" className="btn" style={{ background: "#fff", color: "var(--brand-700)", padding: "13px 24px" }}>
              <Sparkles size={18} /> התחל ייעוץ חכם
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800 }}>{title}</h2>
      <Link href={href} style={{ color: "var(--brand-700)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, fontSize: 14 }}>
        {linkText} <ArrowLeft size={16} />
      </Link>
    </div>
  );
}
