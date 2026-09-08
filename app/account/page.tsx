import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customer";
import AuthForm from "@/components/AuthForm";
import LogoutButton from "@/components/LogoutButton";
import { formatPrice, ORDER_STATUSES } from "@/lib/format";
import { User, Package, Mail, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session) return <AuthForm />;

  const customer = await prisma.customer.findUnique({ where: { id: session.id } });
  if (!customer) return <AuthForm />;

  // Orders linked to this customer OR made as guest with the same email.
  const orders = await prisma.order.findMany({
    where: { OR: [{ customerId: customer.id }, { email: customer.email }] },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-x" style={{ padding: "32px 20px 40px", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,var(--brand-500),var(--brand-700))", color: "#fff", display: "grid", placeItems: "center" }}>
            <User size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>שלום, {customer.name} 👋</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 14 }}>
              <Mail size={14} /> {customer.email}
            </div>
          </div>
        </div>
        <LogoutButton />
      </div>

      {customer.marketingConsent && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--brand-50)", border: "1px solid var(--brand-200)", color: "var(--brand-800)", padding: "10px 14px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>
          <CheckCircle2 size={17} /> נרשמת לקבלת מבצעים והטבות בדוא״ל.
        </div>
      )}

      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <Package size={20} style={{ color: "var(--brand-600)" }} /> ההזמנות שלי
      </h2>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>📦</div>
          עדיין אין לך הזמנות.
          <div style={{ marginTop: 14 }}>
            <Link href="/products" className="btn btn-primary">התחל בקנייה</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((o) => {
            let items: { name: string; qty: number; price: number }[] = [];
            try { items = JSON.parse(o.items); } catch {}
            const st = ORDER_STATUSES[o.status] ?? { label: o.status, color: "#64748b" };
            return (
              <div key={o.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 800 }}>הזמנה #{o.id}</span>
                    <span className="badge" style={{ background: `${st.color}18`, color: st.color }}>{st.label}</span>
                  </div>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString("he-IL")}</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                  {items.map((it, i) => (
                    <span key={i}>{it.name} × {it.qty}{i < items.length - 1 ? " · " : ""}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 10 }}>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>{o.city}, {o.address}</span>
                  <span style={{ fontWeight: 800 }}>{formatPrice(o.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
