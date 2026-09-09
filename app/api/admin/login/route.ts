import { NextResponse } from "next/server";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, email, password } = await req.json().catch(() => ({}));
  // Fall back to defaults when the env var is missing OR empty, and trim
  // stray whitespace/newlines that can sneak in when pasting into a host.
  const okUser = (process.env.ADMIN_USERNAME || "admin").trim();
  const okEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const okPass = (process.env.ADMIN_PASSWORD || "kama2026").trim();

  const inUser = String(username ?? "").trim();
  const inEmail = String(email ?? "").trim().toLowerCase();
  const inPass = String(password ?? "").trim();

  const emailOk = !okEmail || inEmail === okEmail;

  if (inUser === okUser && emailOk && inPass === okPass) {
    const token = await createSession(okUser);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "שם משתמש, אימייל או סיסמה שגויים" }, { status: 401 });
}
