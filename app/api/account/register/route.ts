import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, setCustomerCookie } from "@/lib/customer";

const schema = z.object({
  name: z.string().min(2, "נא להזין שם מלא"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
  marketingConsent: z.boolean().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const { name, email, password, marketingConsent } = parsed.data;
  const normalized = email.trim().toLowerCase();

  // Check the email isn't already registered.
  const existing = await prisma.customer.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json(
      { error: "כתובת אימייל זו כבר רשומה. אנא התחברו." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { name, email: normalized, passwordHash, marketingConsent: !!marketingConsent },
  });

  // Link any previous guest orders made with the same email.
  await prisma.order.updateMany({
    where: { email: normalized, customerId: null },
    data: { customerId: customer.id },
  });

  const token = await createCustomerSession(customer.id, customer.email);
  await setCustomerCookie(token);
  return NextResponse.json({ ok: true, name: customer.name });
}
