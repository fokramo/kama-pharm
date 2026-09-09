import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  verifyResetToken,
  createCustomerSession,
  setCustomerCookie,
} from "@/lib/customer";

export async function POST(req: Request) {
  const { token, password } = await req.json().catch(() => ({}));
  if (!token || !password) {
    return NextResponse.json({ error: "חסרים נתונים" }, { status: 400 });
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: "הסיסמה חייבת להכיל לפחות 6 תווים" }, { status: 400 });
  }

  const payload = await verifyResetToken(String(token));
  if (!payload) {
    return NextResponse.json({ error: "הקישור אינו תקף או שפג תוקפו. בקשו קישור חדש." }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { id: payload.id } });
  if (!customer) {
    return NextResponse.json({ error: "המשתמש לא נמצא" }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  await prisma.customer.update({ where: { id: customer.id }, data: { passwordHash } });

  // Log the user in after a successful reset.
  const session = await createCustomerSession(customer.id, customer.email);
  await setCustomerCookie(session, true);

  return NextResponse.json({ ok: true });
}
