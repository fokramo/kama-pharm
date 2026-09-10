import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(banners);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b?.title) return NextResponse.json({ error: "כותרת חובה" }, { status: 400 });
  const count = await prisma.banner.count();
  const banner = await prisma.banner.create({
    data: {
      title: String(b.title),
      subtitle: String(b.subtitle ?? ""),
      cta: String(b.cta ?? ""),
      href: String(b.href ?? "/products"),
      emoji: String(b.emoji ?? "🏷️"),
      color1: String(b.color1 ?? "#047857"),
      color2: String(b.color2 ?? "#10b981"),
      active: b.active ?? true,
      order: b.order != null ? Number(b.order) : count,
    },
  });
  return NextResponse.json(banner, { status: 201 });
}
