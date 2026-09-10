import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const b = await req.json();
  try {
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(b.title != null && { title: String(b.title) }),
        ...(b.subtitle != null && { subtitle: String(b.subtitle) }),
        ...(b.cta != null && { cta: String(b.cta) }),
        ...(b.href != null && { href: String(b.href) }),
        ...(b.emoji != null && { emoji: String(b.emoji) }),
        ...(b.color1 != null && { color1: String(b.color1) }),
        ...(b.color2 != null && { color2: String(b.color2) }),
        ...(b.active != null && { active: Boolean(b.active) }),
        ...(b.order != null && { order: Number(b.order) }),
      },
    });
    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "הבאנר לא נמצא" }, { status: 404 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "הבאנר לא נמצא" }, { status: 404 });
  }
}
