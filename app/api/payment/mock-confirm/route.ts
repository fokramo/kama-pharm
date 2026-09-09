import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPayPlusConfigured } from "@/lib/payplus";
import { sendOrderEmails } from "@/lib/email";

// Confirms a payment for the built-in MOCK gateway only.
// Disabled automatically once a real PayPlus gateway is configured.
export async function POST(req: Request) {
  if (isPayPlusConfigured()) {
    return NextResponse.json({ error: "not available" }, { status: 403 });
  }
  const { orderId } = await req.json().catch(() => ({ orderId: null }));
  const id = Number(orderId);
  if (!id) return NextResponse.json({ error: "missing order" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "order not found" }, { status: 404 });

  await prisma.order.update({ where: { id }, data: { status: "paid" } });
  await sendOrderEmails(order);
  return NextResponse.json({ ok: true });
}
