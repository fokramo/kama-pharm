import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(s: string) {
  return (
    s
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "cat-" + Date.now()
  );
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b?.name) return NextResponse.json({ error: "שם קטגוריה חובה" }, { status: 400 });
  let slug = b.slug ? slugify(String(b.slug)) : slugify(String(b.name));
  // ensure unique
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const count = await prisma.category.count();
  const category = await prisma.category.create({
    data: {
      name: String(b.name),
      slug,
      icon: b.icon ? String(b.icon) : "💊",
      order: count,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
