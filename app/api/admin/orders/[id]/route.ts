import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED = ["pending", "paid", "processing", "delivered", "cancelled"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  if (!ALLOWED.includes(b?.status)) {
    return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
  }
  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: b.status },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "ההזמנה לא נמצאה" }, { status: 404 });
  }
}
