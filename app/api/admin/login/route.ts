import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, email, password } = await req.json().catch(() => ({}));
  const okUser = process.env.ADMIN_USERNAME ?? "admin";
  const okEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const okPass = process.env.ADMIN_PASSWORD ?? "kama2026";

  const emailOk = !okEmail || String(email ?? "").trim().toLowerCase() === okEmail;

  if (username === okUser && emailOk && password === okPass) {
    const token = await createSession(username);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "שם משתמש, אימייל או סיסמה שגויים" }, { status: 401 });
}
