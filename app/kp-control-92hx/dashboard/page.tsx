"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, Tags, ShoppingBag, LogOut, Plus, Pencil,
  Trash2, X, Loader2, Search, TrendingUp, Clock, Boxes,
} from "lucide-react";
import Logo from "@/components/Logo";
import { formatPrice, ORDER_STATUSES } from "@/lib/format";

type Category = { id: string; name: string; slug: string; icon: string | null; order: number; _count?: { products: number } };
type Product = {
  id: string; name: string; description: string; price: number; compareAt: number | null;
  image: string | null; stock: number; sku: string | null; active: boolean; featured: boolean;
  requiresRx: boolean; categoryId: string; category?: { name: string };
};
type Order = {
  id: number; customerName: string; phone: string; email: string | null; city: string;
  address: string; notes: string | null; items: string; subtotal: number; shipping: number;
  total: number; status: string; createdAt: string;
};

type Tab = "overview" | "products" | "categories" | "orders";

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [p, c, o] = await Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]);
    setProducts(p);
    setCategories(c);
    setOrders(o);
    setLoading(false);
  }
  useEffect(() => { loadAll(); }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/kp-control-92hx");
    router.refresh();
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "סקירה", icon: <LayoutDashboard size={18} /> },
    { key: "products", label: "מוצרים", icon: <Package size={18} /> },
    { key: "categories", label: "קטגוריות", icon: <Tags size={18} /> },
    { key: "orders", label: "הזמנות", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="container-x" style={{ padding: "24px 20px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={36} />
          <span className="badge" style={{ background: "var(--brand-100)", color: "var(--brand-800)" }}>לוח ניהול</span>
        </div>
        <button className="btn btn-ghost" onClick={logout}><LogOut size={16} /> התנתק</button>
      </div>

      {/* tabs */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 22, borderBottom: "1px solid var(--line)", paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: 7, padding: "12px 16px",
              fontWeight: 600, fontSize: 15, cursor: "pointer",
              borderBottom: tab === t.key ? "2px solid var(--brand-600)" : "2px solid transparent",
              color: tab === t.key ? "var(--brand-700)" : "var(--muted)",
              marginBottom: -1,
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center", color: "var(--muted)" }}>
          <Loader2 size={30} className="spin" style={{ margin: "0 auto" }} />
        </div>
      ) : (
        <>
          {tab === "overview" && <Overview products={products} orders={orders} categories={categories} onGo={setTab} />}
          {tab === "products" && <ProductsTab products={products} categories={categories} reload={loadAll} />}
          {tab === "categories" && <CategoriesTab categories={categories} reload={loadAll} />}
          {tab === "orders" && <OrdersTab orders={orders} reload={loadAll} />}
        </>
      )}
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview({ products, orders, categories, onGo }: { products: Product[]; orders: Order[]; categories: Category[]; onGo: (t: Tab) => void }) {
  const revenue = orders.filter((o) => o.status === "paid" || o.status === "processing" || o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stock <= 5);

  const stats = [
    { label: "הכנסות (שולם)", value: formatPrice(revenue), icon: <TrendingUp size={22} />, color: "#059669" },
    { label: "סה״כ הזמנות", value: String(orders.length), icon: <ShoppingBag size={22} />, color: "#2563eb" },
    { label: "מוצרים", value: String(products.length), icon: <Package size={22} />, color: "#7c3aed" },
    { label: "ממתינות לתשלום", value: String(pending), icon: <Clock size={22} />, color: "#b45309" },
  ];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, color: s.color, display: "grid", placeItems: "center", marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="product-grid">
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Boxes size={18} /> מלאי נמוך</h3>
          {lowStock.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>אין מוצרים במלאי נמוך 👍</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span className="clamp-1">{p.name}</span>
                  <span style={{ color: p.stock === 0 ? "var(--danger)" : "var(--warn)", fontWeight: 700 }}>{p.stock} יח׳</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>הזמנות אחרונות</h3>
          {orders.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>אין הזמנות עדיין</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {orders.slice(0, 6).map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, alignItems: "center" }}>
                  <span>#{o.id} · {o.customerName}</span>
                  <StatusPill status={o.status} />
                </div>
              ))}
              <button className="btn btn-ghost" style={{ marginTop: 6 }} onClick={() => onGo("orders")}>לכל ההזמנות</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = ORDER_STATUSES[status] ?? { label: status, color: "#64748b" };
  return <span className="badge" style={{ background: `${s.color}18`, color: s.color }}>{s.label}</span>;
}

/* ---------------- Products ---------------- */
function ProductsTab({ products, categories, reload }: { products: Product[]; categories: Category[]; reload: () => void }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())),
    [products, q]
  );

  async function del(p: Product) {
    if (!confirm(`למחוק את "${p.name}"?`)) return;
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    reload();
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: "absolute", insetInlineStart: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input className="input" placeholder="חיפוש מוצר…" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingInlineStart: 38 }} />
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus size={18} /> מוצר חדש</button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", textAlign: "start" }}>
                <Th>מוצר</Th><Th>קטגוריה</Th><Th>מחיר</Th><Th>מלאי</Th><Th>סטטוס</Th><Th> </Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--surface-2)", display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
                        {p.image ? <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "💊"}
                      </div>
                      <span className="clamp-1" style={{ fontWeight: 600, maxWidth: 260 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{p.category?.name}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700 }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: "10px 14px", color: p.stock <= 5 ? "var(--danger)" : "inherit", fontWeight: 600 }}>{p.stock}</td>
                  <td style={{ padding: "10px 14px" }}>
                    {p.active ? <span className="badge" style={{ background: "#dcfce7", color: "#166534" }}>פעיל</span> : <span className="badge" style={{ background: "#f1f5f9", color: "#64748b" }}>מוסתר</span>}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setEditing(p)} aria-label="ערוך"><Pencil size={15} /></button>
                      <button className="btn btn-ghost" style={{ padding: 8, color: "var(--danger)" }} onClick={() => del(p)} aria-label="מחק"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <ProductModal
          product={editing}
          categories={categories}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); reload(); }}
        />
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: "12px 14px", textAlign: "start", fontWeight: 700, color: "var(--ink-soft)", fontSize: 13 }}>{children}</th>;
}

function ProductModal({ product, categories, onClose, onSaved }: { product: Product | null; categories: Category[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    compareAt: product?.compareAt?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    sku: product?.sku ?? "",
    image: product?.image ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    active: product?.active ?? true,
    featured: product?.featured ?? false,
    requiresRx: product?.requiresRx ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (d.url) set("image", d.url);
    setUploading(false);
  }

  async function save() {
    setError(null);
    if (!form.name || !form.price || !form.categoryId) {
      setError("שם, מחיר וקטגוריה הם שדות חובה");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      stock: Number(form.stock),
    };
    const res = product
      ? await fetch(`/api/admin/products/${product.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) onSaved();
    else setError((await res.json().catch(() => ({}))).error ?? "שגיאה בשמירה");
  }

  return (
    <ModalShell title={product ? "עריכת מוצר" : "מוצר חדש"} onClose={onClose}>
      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <label className="label">שם המוצר *</label>
          <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="label">תיאור</label>
          <textarea className="textarea" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div><label className="label">מחיר (₪) *</label><input className="input" type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
          <div><label className="label">מחיר לפני הנחה</label><input className="input" type="number" step="0.01" value={form.compareAt} onChange={(e) => set("compareAt", e.target.value)} /></div>
          <div><label className="label">מלאי</label><input className="input" type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label className="label">קטגוריה *</label>
            <select className="select" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div><label className="label">מק״ט (SKU)</label><input className="input" value={form.sku} onChange={(e) => set("sku", e.target.value)} /></div>
        </div>
        <div>
          <label className="label">תמונה</label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 10, background: "var(--surface-2)", display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
              {uploading ? <Loader2 size={18} className="spin" /> : form.image ? <img src={form.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "💊"}
            </div>
            <div style={{ flex: 1, display: "grid", gap: 8 }}>
              <input className="input" placeholder="קישור לתמונה (URL) או העלאה למטה" value={form.image} onChange={(e) => set("image", e.target.value)} />
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} style={{ fontSize: 13 }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <Toggle label="פעיל" checked={form.active} onChange={(v) => set("active", v)} />
          <Toggle label="מוצר מובחר" checked={form.featured} onChange={(v) => set("featured", v)} />
          <Toggle label="דורש מרשם" checked={form.requiresRx} onChange={(v) => set("requiresRx", v)} />
        </div>
        {error && <div style={{ background: "#fef2f2", color: "var(--danger)", padding: "9px 12px", borderRadius: 10, fontSize: 14 }}>{error}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={save} disabled={saving}>
          {saving ? <Loader2 size={18} className="spin" /> : "שמור"}
        </button>
        <button className="btn btn-ghost" onClick={onClose}>ביטול</button>
      </div>
    </ModalShell>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--brand-600)" }} />
      {label}
    </label>
  );
}

/* ---------------- Categories ---------------- */
function CategoriesTab({ categories, reload }: { categories: Category[]; reload: () => void }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💊");
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!name.trim()) return;
    setSaving(true);
    await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, icon }) });
    setName(""); setIcon("💊"); setSaving(false); reload();
  }
  async function editCat(c: Category) {
    const nn = prompt("שם הקטגוריה:", c.name);
    if (nn == null) return;
    const ni = prompt("אייקון (אימוג׳י):", c.icon ?? "💊") ?? c.icon;
    await fetch(`/api/admin/categories/${c.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: nn, icon: ni }) });
    reload();
  }
  async function del(c: Category) {
    if (!confirm(`למחוק את הקטגוריה "${c.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (!res.ok) alert((await res.json()).error);
    reload();
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="card" style={{ padding: 18, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ width: 90 }}><label className="label">אייקון</label><input className="input" value={icon} onChange={(e) => setIcon(e.target.value)} style={{ textAlign: "center", fontSize: 20 }} /></div>
        <div style={{ flex: 1, minWidth: 200 }}><label className="label">שם קטגוריה חדשה</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} /></div>
        <button className="btn btn-primary" onClick={add} disabled={saving}><Plus size={18} /> הוסף</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
        {categories.map((c) => (
          <div key={c.id} className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--brand-50)", display: "grid", placeItems: "center", fontSize: 24 }}>{c.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{c._count?.products ?? 0} מוצרים</div>
            </div>
            <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => editCat(c)}><Pencil size={15} /></button>
            <button className="btn btn-ghost" style={{ padding: 8, color: "var(--danger)" }} onClick={() => del(c)}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */
function OrdersTab({ orders, reload }: { orders: Order[]; reload: () => void }) {
  const [open, setOpen] = useState<Order | null>(null);

  async function setStatus(o: Order, status: string) {
    await fetch(`/api/admin/orders/${o.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    reload();
  }

  if (orders.length === 0) {
    return <div className="card" style={{ padding: 48, textAlign: "center", color: "var(--muted)" }}>אין הזמנות עדיין.</div>;
  }

  return (
    <>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 720 }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                <Th>#</Th><Th>לקוח</Th><Th>עיר</Th><Th>סכום</Th><Th>תאריך</Th><Th>סטטוס</Th><Th> </Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700 }}>#{o.id}</td>
                  <td style={{ padding: "10px 14px" }}>{o.customerName}<div style={{ fontSize: 12, color: "var(--muted)" }} dir="ltr">{o.phone}</div></td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{o.city}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700 }}>{formatPrice(o.total)}</td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)", fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString("he-IL")}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <select className="select" value={o.status} onChange={(e) => setStatus(o, e.target.value)} style={{ padding: "6px 10px", fontSize: 13 }}>
                      {Object.entries(ORDER_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <button className="btn btn-ghost" style={{ padding: "6px 12px" }} onClick={() => setOpen(o)}>פרטים</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && <OrderModal order={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  let items: { name: string; price: number; qty: number }[] = [];
  try { items = JSON.parse(order.items); } catch {}
  return (
    <ModalShell title={`הזמנה #${order.id}`} onClose={onClose}>
      <div style={{ display: "grid", gap: 6, fontSize: 14, marginBottom: 16 }}>
        <Row k="לקוח" v={order.customerName} />
        <Row k="טלפון" v={order.phone} />
        {order.email && <Row k="אימייל" v={order.email} />}
        <Row k="כתובת" v={`${order.address}, ${order.city}`} />
        {order.notes && <Row k="הערות" v={order.notes} />}
      </div>
      <div className="card" style={{ padding: 14 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < items.length - 1 ? "1px solid var(--line)" : "none", fontSize: 14 }}>
            <span>{it.name} × {it.qty}</span><span style={{ fontWeight: 600 }}>{formatPrice(it.price * it.qty)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, borderTop: "1px solid var(--line)" }}>
          <span>משלוח</span><span>{order.shipping === 0 ? "חינם" : formatPrice(order.shipping)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, marginTop: 6 }}>
          <span>סה״כ</span><span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </ModalShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>;
}

/* ---------------- Modal shell ---------------- */
function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.5)", zIndex: 70, display: "grid", placeItems: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h3>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
