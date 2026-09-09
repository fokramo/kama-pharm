import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, setCustomerCookie } from "@/lib/customer";

export async function POST(req: Request) {
  const { email, password, remember } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "נא להזין אימייל וסיסמה" }, { status: 400 });
  }
  const normalized = String(email).trim().toLowerCase();
  const customer = await prisma.customer.findUnique({ where: { email: normalized } });
  if (!customer || !(await bcrypt.compare(String(password), customer.passwordHash))) {
    return NextResponse.json({ error: "אימייל או סיסמה שגויים" }, { status: 401 });
  }
  const token = await createCustomerSession(customer.id, customer.email);
  await setCustomerCookie(token, remember !== false);
  return NextResponse.json({ ok: true, name: customer.name });
}
