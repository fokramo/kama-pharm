import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const results = await prisma.product.findMany({
    where: {
      active: true,
      OR: [{ name: { contains: q } }, { description: { contains: q } }],
    },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      category: { select: { name: true } },
    },
    take: 6,
    orderBy: { featured: "desc" },
  });

  return NextResponse.json({ results });
}
