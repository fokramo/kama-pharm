import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b?.name || !b?.categoryId || b?.price == null) {
    return NextResponse.json({ error: "שם, קטגוריה ומחיר הם שדות חובה" }, { status: 400 });
  }
  const product = await prisma.product.create({
    data: {
      name: String(b.name),
      description: String(b.description ?? ""),
      price: Number(b.price),
      compareAt: b.compareAt ? Number(b.compareAt) : null,
      image: b.image ? String(b.image) : null,
      stock: Number(b.stock ?? 0),
      sku: b.sku ? String(b.sku) : null,
      active: b.active ?? true,
      featured: b.featured ?? false,
      requiresRx: b.requiresRx ?? false,
      categoryId: String(b.categoryId),
    },
  });
  return NextResponse.json(product, { status: 201 });
}
