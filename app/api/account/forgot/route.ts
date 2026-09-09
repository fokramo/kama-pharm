import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/customer";
import { sendPasswordReset } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: "נא להזין אימייל" }, { status: 400 });

  const normalized = String(email).trim().toLowerCase();
  const customer = await prisma.customer.findUnique({ where: { email: normalized } });

  // Always respond the same way — don't reveal whether the email is registered.
  if (customer) {
    const token = await createResetToken(customer.id);
    const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const url = `${base}/account/reset?token=${encodeURIComponent(token)}`;
    await sendPasswordReset(customer.email, customer.name, url);
  }

  return NextResponse.json({ ok: true });
}
