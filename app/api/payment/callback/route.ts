import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PayPlus server-to-server callback. Marks the order paid on success.
// Note: in production, verify the request signature/hash from PayPlus headers.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const transaction = body?.transaction ?? body;
    const orderId = Number(transaction?.more_info ?? body?.more_info);
    const status = transaction?.status_code ?? transaction?.status;

    if (!orderId) return NextResponse.json({ ok: false }, { status: 400 });

    const paid = status === "000" || status === "approved" || status === "success";
    await prisma.order.update({
      where: { id: orderId },
      data: { status: paid ? "paid" : "cancelled" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
