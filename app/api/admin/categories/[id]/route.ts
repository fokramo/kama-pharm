import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(b.name != null && { name: String(b.name) }),
        ...(b.icon != null && { icon: String(b.icon) }),
        ...(b.order != null && { order: Number(b.order) }),
      },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "הקטגוריה לא נמצאה" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `לא ניתן למחוק — יש ${count} מוצרים בקטגוריה. העבירו או מחקו אותם קודם.` },
      { status: 400 }
    );
  }
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "הקטגוריה לא נמצאה" }, { status: 404 });
  }
}
