import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(b.name != null && { name: String(b.name) }),
        ...(b.description != null && { description: String(b.description) }),
        ...(b.price != null && { price: Number(b.price) }),
        ...("compareAt" in b && { compareAt: b.compareAt ? Number(b.compareAt) : null }),
        ...("image" in b && { image: b.image ? String(b.image) : null }),
        ...(b.stock != null && { stock: Number(b.stock) }),
        ...("sku" in b && { sku: b.sku ? String(b.sku) : null }),
        ...(b.active != null && { active: Boolean(b.active) }),
        ...(b.featured != null && { featured: Boolean(b.featured) }),
        ...(b.requiresRx != null && { requiresRx: Boolean(b.requiresRx) }),
        ...(b.categoryId != null && { categoryId: String(b.categoryId) }),
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "המוצר לא נמצא" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "המוצר לא נמצא" }, { status: 404 });
  }
}
