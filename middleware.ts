import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-insecure-secret"
);

async function isValid(token?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// Secret admin base path. Keep in sync with the app/<ADMIN_PATH> folder name.
const ADMIN_PATH = "/kp-control-92hx";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard the admin dashboard + admin APIs (not the login page/route).
  const isLoginPage = pathname === ADMIN_PATH;
  const isLoginApi = pathname === "/api/admin/login";
  const needsAuth =
    (pathname.startsWith(ADMIN_PATH) && !isLoginPage) ||
    (pathname.startsWith("/api/admin") && !isLoginApi);

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("kama_admin")?.value;
  if (await isValid(token)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = ADMIN_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/kp-control-92hx/:path*", "/api/admin/:path*"],
};
