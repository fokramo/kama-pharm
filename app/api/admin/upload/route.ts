import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "הקובץ גדול מדי (מקסימום 5MB)" }, { status: 400 });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch {
    // Serverless hosts (e.g. Vercel) have a read-only filesystem.
    return NextResponse.json(
      { error: "העלאת קבצים אינה זמינה בשרת זה. אנא הדביקו קישור (URL) לתמונה." },
      { status: 501 }
    );
  }
}
