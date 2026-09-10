import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const banners = [
  { title: "משלוח חינם עד הבית", subtitle: "בכל קנייה מעל ₪199 — ישירות עד הדלת תוך 1–3 ימי עסקים", cta: "התחל בקנייה", href: "/products", emoji: "🚚", color1: "#047857", color2: "#10b981", order: 0 },
  { title: "מבצעי החורף חוגגים!", subtitle: "עד 30% הנחה על מגוון ויטמינים, טיפוח ומוצרי בריאות", cta: "לכל המבצעים", href: "/products?deals=1", emoji: "🏷️", color1: "#b91c1c", color2: "#f97316", order: 1 },
  { title: "ייעוץ חכם עם בינה מלאכותית", subtitle: "לא בטוחים מה מתאים לכם? היועץ החכם ימליץ בחינם ובאופן מיידי", cta: "התחל ייעוץ AI", href: "/consult", emoji: "🤖", color1: "#4338ca", color2: "#0ea5e9", order: 2 },
  { title: "חיזוק מערכת החיסון", subtitle: "ויטמין D, אומגה 3 ומולטי-ויטמין — לכל המשפחה", cta: "לקטגוריית הויטמינים", href: "/category/vitamins", emoji: "🟠", color1: "#0f766e", color2: "#22c55e", order: 3 },
];

async function main() {
  const count = await prisma.banner.count();
  if (count > 0) {
    console.log(`ℹ️ Banners already exist (${count}). Skipping.`);
    return;
  }
  for (const b of banners) await prisma.banner.create({ data: b });
  console.log(`✅ Seeded ${banners.length} banners.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
