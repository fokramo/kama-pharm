import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "kama_customer";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me-kama-pharm"
);

export async function createCustomerSession(id: string, email: string) {
  return new SignJWT({ id, email, role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function getCustomerSession(): Promise<{ id: string; email: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "customer") return null;
    return { id: String(payload.id), email: String(payload.email) };
  } catch {
    return null;
  }
}

export async function setCustomerCookie(token: string, remember = true) {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // "remember me": persist 30 days; otherwise a session cookie (cleared on browser close)
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });
}

// Short-lived token for password reset links.
export async function createResetToken(id: string) {
  return new SignJWT({ id, type: "reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secret);
}

export async function verifyResetToken(token: string): Promise<{ id: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.type !== "reset") return null;
    return { id: String(payload.id) };
  } catch {
    return null;
  }
}

export async function clearCustomerCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}
