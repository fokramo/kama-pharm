import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { calcShipping } from "@/lib/format";
import { createPaymentLink } from "@/lib/payplus";
import { getCustomerSession, createCustomerSession, setCustomerCookie } from "@/lib/customer";

const schema = z.object({
  customerName: z.string().min(2, "נא להזין שם מלא"),
  phone: z.string().min(7, "נא להזין מספר טלפון תקין"),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().min(2, "נא להזין עיר"),
  address: z.string().min(2, "נא להזין כתובת"),
  notes: z.string().optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
  marketingConsent: z.boolean().optional(),
  items: z
    .array(z.object({ id: z.string(), qty: z.number().int().positive() }))
    .min(1, "העגלה ריקה"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "נתונים לא תקינים" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Look up real products — never trust prices from the client.
  const ids = data.items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, active: true },
  });

  const lineItems = data.items
    .map((i) => {
      const p = products.find((pr) => pr.id === i.id);
      if (!p) return null;
      const qty = Math.min(i.qty, Math.max(p.stock, 0));
      if (qty <= 0) return null;
      return { id: p.id, name: p.name, price: p.price, qty };
    })
    .filter((x): x is { id: string; name: string; price: number; qty: number } => !!x);

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "אין פריטים זמינים במלאי בעגלה" },
      { status: 400 }
    );
  }

  const subtotal = lineItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  // Link the order to the logged-in customer, if any.
  const session = await getCustomerSession();
  const email = data.email || session?.email || null;
  let customerId = session?.id ?? null;

  // Optional: create an account during guest checkout.
  if (!session && data.createAccount && data.password && data.password.length >= 6 && email) {
    const normalized = email.trim().toLowerCase();
    const existing = await prisma.customer.findUnique({ where: { email: normalized } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          email: normalized,
          phone: data.phone,
          city: data.city,
          address: data.address,
          passwordHash,
          marketingConsent: !!data.marketingConsent,
        },
      });
      customerId = customer.id;
      const token = await createCustomerSession(customer.id, customer.email);
      await setCustomerCookie(token);
    }
  }

  const order = await prisma.order.create({
    data: {
      customerId,
      customerName: data.customerName,
      phone: data.phone,
      email,
      city: data.city,
      address: data.address,
      notes: data.notes || null,
      items: JSON.stringify(lineItems),
      subtotal,
      shipping,
      total,
      status: "pending",
    },
  });

  try {
    const payment = await createPaymentLink({
      orderId: order.id,
      amount: total,
      customer: { name: data.customerName, email: data.email || undefined, phone: data.phone },
      items: [
        ...lineItems.map((i) => ({ name: i.name, quantity: i.qty, price: i.price })),
        ...(shipping > 0 ? [{ name: "משלוח", quantity: 1, price: shipping }] : []),
      ],
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: payment.ref },
    });
    return NextResponse.json({ orderId: order.id, paymentUrl: payment.url, mock: payment.mock });
  } catch (e) {
    return NextResponse.json(
      { error: "שגיאה ביצירת קישור התשלום. נסו שוב או צרו קשר.", detail: String(e) },
      { status: 502 }
    );
  }
}
