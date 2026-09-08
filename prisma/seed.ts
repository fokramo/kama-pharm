import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Seed = {
  cat: { name: string; slug: string; icon: string };
  products: {
    name: string;
    description: string;
    price: number;
    compareAt?: number;
    stock?: number;
    featured?: boolean;
    requiresRx?: boolean;
  }[];
};

const data: Seed[] = [
  {
    cat: { name: "תרופות ללא מרשם", slug: "otc", icon: "💊" },
    products: [
      { name: "אקמול 500 מ״ג — 20 טבליות", description: "להקלה על כאבים והורדת חום. פרצטמול 500 מ״ג.", price: 18.9, compareAt: 24.9, stock: 120, featured: true },
      { name: "נורופן 400 מ״ג — 24 טבליות", description: "איבופרופן להקלה על כאב ודלקת.", price: 32.5, stock: 80, featured: true },
      { name: "אופטלגין טבליות — 20 יח׳", description: "דיפירון להקלה על כאבים חזקים וחום.", price: 27.0, stock: 60 },
      { name: "אקמולי לילדים סירופ", description: "פרצטמול בטעם תות לילדים מגיל שנתיים.", price: 21.9, compareAt: 26.0, stock: 45 },
      { name: "סטרפסילס — כדורי מציצה לגרון", description: "להקלה על כאב גרון ואי נוחות בליעה.", price: 24.9, stock: 90 },
    ],
  },
  {
    cat: { name: "ויטמינים ותוספים", slug: "vitamins", icon: "🟠" },
    products: [
      { name: "ויטמין D3 1000 יב״ל — 90 כמוסות", description: "לתמיכה בבריאות העצם ומערכת החיסון.", price: 39.9, compareAt: 49.9, stock: 200, featured: true },
      { name: "אומגה 3 — 60 כמוסות", description: "שמן דגים איכותי EPA/DHA לבריאות הלב.", price: 69.0, compareAt: 89.0, stock: 110, featured: true },
      { name: "מגנזיום ציטראט — 120 טבליות", description: "לתמיכה בשרירים ובמערכת העצבים.", price: 55.0, stock: 75 },
      { name: "ויטמין C 1000 בשחרור מושהה", description: "נוגד חמצון לחיזוק מערכת החיסון.", price: 34.9, stock: 130 },
      { name: "מולטי ויטמין יומי — 60 טבליות", description: "תוסף יומי מאוזן לכל המשפחה.", price: 62.0, stock: 95 },
      { name: "ברזל + חומצה פולית", description: "לתמיכה בייצור תאי דם ולנשים בהיריון.", price: 44.5, stock: 50 },
    ],
  },
  {
    cat: { name: "טיפוח ויופי", slug: "beauty", icon: "🧴" },
    products: [
      { name: "קרם לחות פנים SPF30", description: "לחות יומית עם הגנה מהשמש לכל סוגי העור.", price: 79.0, compareAt: 99.0, stock: 60, featured: true },
      { name: "סרום היאלורוני 30 מ״ל", description: "לחות עמוקה ומילוי קמטוטים.", price: 119.0, stock: 40 },
      { name: "תחליב ניקוי עדין 200 מ״ל", description: "מנקה את העור מבלי לייבש.", price: 42.0, stock: 85 },
      { name: "קרם ידיים מזין", description: "לעור ידיים רך וחלק לאורך היום.", price: 24.9, stock: 150 },
    ],
  },
  {
    cat: { name: "אם ותינוק", slug: "baby", icon: "🍼" },
    products: [
      { name: "חיתולים Premium מידה 4 — 44 יח׳", description: "ספיגה מרבית ונשימה מלאה לעור התינוק.", price: 49.9, compareAt: 59.9, stock: 100, featured: true },
      { name: "מגבונים לחים — מארז 3×72", description: "מגבונים עדינים ללא בישום לעור רגיש.", price: 29.9, stock: 140 },
      { name: "קרם החתלה מגן", description: "מונע ומרגיע תפרחת חיתולים.", price: 27.5, stock: 70 },
      { name: "תרסיס מי ים לתינוקות", description: "לניקוי עדין של האף וגודש.", price: 22.0, stock: 65 },
    ],
  },
  {
    cat: { name: "היגיינה אישית", slug: "hygiene", icon: "🧼" },
    products: [
      { name: "אלכוג׳ל 500 מ״ל", description: "חיטוי ידיים 70% אלכוהול עם לחות.", price: 16.9, stock: 220, featured: true },
      { name: "מברשת שיניים חשמלית", description: "ניקוי יסודי עם טיימר וראש מתחלף.", price: 149.0, compareAt: 199.0, stock: 35 },
      { name: "משחת שיניים הלבנה", description: "להלבנה עדינה ונשימה רעננה.", price: 18.5, stock: 180 },
      { name: "מי פה אנטיבקטריאלי", description: "הגנה מפני חיידקים לאורך היום.", price: 23.0, stock: 90 },
    ],
  },
  {
    cat: { name: "עזרה ראשונה", slug: "first-aid", icon: "🩹" },
    products: [
      { name: "פלסטרים מארז 40 יח׳", description: "במגוון גדלים לפצעים קטנים.", price: 14.9, stock: 200, featured: true },
      { name: "תחבושת אלסטית 8 ס״מ", description: "לתמיכה ולחבישת נקעים.", price: 19.9, stock: 120 },
      { name: "חיטוי פצעים — תרסיס", description: "חיטוי עדין ללא צריבה.", price: 21.0, stock: 80 },
      { name: "מדחום דיגיטלי", description: "מדידה מהירה ומדויקת תוך שניות.", price: 34.9, compareAt: 44.9, stock: 55 },
    ],
  },
  {
    cat: { name: "בריאות ותמיכה", slug: "health-support", icon: "🩺" },
    products: [
      { name: "מד לחץ דם דיגיטלי לזרוע", description: "מדידה ביתית מדויקת עם זיכרון.", price: 189.0, compareAt: 239.0, stock: 30, featured: true },
      { name: "מדבקות חום להורדת חום", description: "הקלה מיידית לילדים ומבוגרים.", price: 17.9, stock: 95 },
      { name: "בקבוק מים חם/קר", description: "להקלה על כאבי שרירים והצטננות.", price: 39.0, stock: 60 },
    ],
  },
  {
    cat: { name: "עור ואלרגיה", slug: "skin-allergy", icon: "☀️" },
    products: [
      { name: "קרם הגנה SPF50 — 100 מ״ל", description: "הגנה גבוהה מפני קרינת UVA/UVB.", price: 64.9, compareAt: 79.9, stock: 70, featured: true },
      { name: "כדורי אלרגיה 10 מ״ג — 30 יח׳", description: "להקלה על תסמיני אלרגיה עונתית.", price: 29.9, stock: 110 },
      { name: "קרם קורטיזון 1% (ללא מרשם)", description: "להקלה על גירודים ודלקות עור קלות.", price: 26.5, stock: 40 },
      { name: "משחה אנטיביוטית לפצעים", description: "מרשם נדרש — למניעת זיהומים.", price: 33.0, stock: 25, requiresRx: true },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding Kama Pharm…");
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  let order = 0;
  for (const block of data) {
    const category = await prisma.category.create({
      data: { ...block.cat, order: order++ },
    });
    for (const p of block.products) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          compareAt: p.compareAt ?? null,
          stock: p.stock ?? 50,
          featured: p.featured ?? false,
          requiresRx: p.requiresRx ?? false,
          categoryId: category.id,
        },
      });
    }
  }
  const [c, p] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
  ]);
  console.log(`✅ Done: ${c} categories, ${p} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
