import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { CheckCircle2, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const id = Number(order);
  const found = id ? await prisma.order.findUnique({ where: { id } }) : null;

  return (
    <div className="container-x" style={{ padding: "50px 20px", maxWidth: 620, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--brand-50)", color: "var(--brand-600)", display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
        <CheckCircle2 size={46} />
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>תודה על הזמנתך! 🎉</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 17, marginBottom: 8 }}>
        ההזמנה התקבלה ואנחנו כבר מתחילים להכין אותה.
      </p>
      {found && (
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          מספר הזמנה: <b style={{ color: "var(--ink)" }}>#{found.id}</b>
        </p>
      )}

      {found && (
        <div className="card" style={{ padding: 22, textAlign: "start", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 14 }}>
            <Package size={20} style={{ color: "var(--brand-600)" }} /> פרטי ההזמנה
          </div>
          <div style={{ display: "grid", gap: 8, fontSize: 14, color: "var(--ink-soft)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>שם</span><span>{found.customerName}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>כתובת</span><span>{found.address}, {found.city}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>טלפון</span><span dir="ltr">{found.phone}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 8, marginTop: 4, fontWeight: 800, fontSize: 16, color: "var(--ink)" }}>
              <span>סה״כ שולם</span><span>{formatPrice(found.total)}</span>
            </div>
          </div>
        </div>
      )}

      <Link href="/products" className="btn btn-primary" style={{ fontSize: 16, padding: "13px 28px" }}>
        המשך בקנייה
      </Link>
    </div>
  );
}
