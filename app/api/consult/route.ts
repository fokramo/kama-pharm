import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const { messages, productId } = (await req.json()) as {
    messages: ChatMsg[];
    productId?: string;
  };

  // Build catalog context so the advisor recommends real products.
  const products = await prisma.product.findMany({
    where: { active: true },
    select: {
      id: true, name: true, price: true, description: true, requiresRx: true,
      category: { select: { name: true } },
    },
    take: 200,
  });

  const catalog = products
    .map(
      (p) =>
        `- ${p.name} | קטגוריה: ${p.category.name} | מחיר: ₪${p.price}${p.requiresRx ? " | דורש מרשם" : ""} | מזהה: ${p.id}`
    )
    .join("\n");

  let focus = "";
  if (productId) {
    const p = products.find((x) => x.id === productId);
    if (p) focus = `\n\nהמשתמש מתעניין כרגע במוצר: "${p.name}" (${p.description}).`;
  }

  const system = `אתה "היועץ החכם" של בית המרקחת המקוון "קמא פארם". אתה עונה בעברית בלבד, בצורה חמה, ברורה ומקצועית.

תפקידך: לעזור ללקוחות לבחור מוצרים מתאימים מתוך הקטלוג של בית המרקחת, ולתת מידע כללי על בריאות וטיפוח.

כללים חשובים:
- אתה נותן מידע כללי בלבד ואינך מהווה תחליף לייעוץ רפואי. במקרים של תסמינים חמורים, כאב מתמשך, היריון/הנקה, או תרופות מרשם — המלץ תמיד להתייעץ עם רופא או רוקח.
- אל תאבחן מחלות ואל תמליץ על מינונים של תרופות מרשם.
- המלץ רק על מוצרים שקיימים בקטלוג שלמטה. כשאתה ממליץ על מוצר, ציין את שמו המדויק ואת המחיר.
- שאל שאלה מבהירה אחת אם חסר לך מידע כדי להמליץ טוב יותר.
- שמור על תשובות תמציתיות וידידותיות. השתמש ברשימות כשזה עוזר.

קטלוג המוצרים הזמינים:
${catalog}${focus}`;

  if (!apiKey) {
    // Graceful fallback when no API key is configured yet.
    const text =
      "היועץ החכם עדיין לא חובר למפתח ה-API של Claude. 🔑\n\nכדי להפעיל אותו, יש להוסיף מפתח בקובץ ‎.env‎ בשדה ‎ANTHROPIC_API_KEY‎ ולהפעיל מחדש את השרת.\n\nבינתיים אשמח לעזור דרך צוות שירות הלקוחות בטלפון 6600*.";
    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-5",
          max_tokens: 1024,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });
        anthropicStream.on("text", (t) => controller.enqueue(encoder.encode(t)));
        await anthropicStream.finalMessage();
        controller.close();
      } catch (e) {
        controller.enqueue(
          encoder.encode("אירעה שגיאה בחיבור ליועץ החכם. נסו שוב מאוחר יותר. (" + String(e) + ")")
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
