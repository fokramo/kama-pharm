"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Search, Phone, User, Sparkles, Package, LogOut, ChevronDown, LogIn } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

type Sug = { id: string; name: string; price: number; image: string | null; category: { name: string } };

export default function Header() {
  const { count, setOpen } = useCart();
  const [q, setQ] = useState("");
  const [me, setMe] = useState<{ name: string } | null>(null);
  const [results, setResults] = useState<Sug[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => r.json())
      .then((d) => setMe(d.customer ? { name: d.customer.name } : null))
      .catch(() => setMe(null));
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(false);
    router.push(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
  }

  function onSearchChange(v: string) {
    setQ(v);
    if (debounce.current) clearTimeout(debounce.current);
    if (v.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(v.trim())}`);
        const d = await r.json();
        setResults(d.results ?? []);
        setShowResults(true);
      } catch {
        setResults([]);
      }
    }, 220);
  }

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    setMe(null);
    setUserOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "#fff", borderBottom: "1px solid var(--line)" }}>
      {/* top promo bar */}
      <div style={{ background: "linear-gradient(90deg,var(--brand-700),var(--brand-600))", color: "#fff", fontSize: 13 }}>
        <div className="container-x" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 34 }}>
          <span>🚚 משלוח חינם בקנייה מעל ₪199</span>
          <a href="tel:*6600" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Phone size={14} /> שירות לקוחות: 6600*
          </a>
        </div>
      </div>

      {/* main row */}
      <div className="container-x" style={{ display: "flex", alignItems: "center", gap: 18, height: 72 }}>
        <Link href="/" aria-label="קמא פארם" style={{ flexShrink: 0 }}>
          <Logo />
        </Link>

        {/* search with live dropdown */}
        <form onSubmit={submitSearch} style={{ flex: 1, maxWidth: 640, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", insetInlineStart: 16, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            className="input"
            placeholder="חיפוש מוצר, ברקוד, מבצע…"
            value={q}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => results.length && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            style={{ paddingInlineStart: 46, paddingInlineEnd: 112, borderRadius: 999, background: "var(--surface-2)", height: 46 }}
          />
          <button type="submit" className="btn btn-primary" style={{ position: "absolute", insetInlineEnd: 5, top: 5, height: 36, padding: "0 18px", borderRadius: 999 }}>
            <Search size={16} /> חיפוש
          </button>

          {showResults && (
            <div className="search-dd" onMouseDown={(e) => e.preventDefault()}>
              {results.length === 0 ? (
                <div style={{ padding: 16, color: "var(--muted)", fontSize: 14, textAlign: "center" }}>לא נמצאו מוצרים תואמים</div>
              ) : (
                <>
                  {results.map((r) => (
                    <Link key={r.id} href={`/product/${r.id}`} className="search-item" onClick={() => setShowResults(false)}>
                      <div style={{ width: 42, height: 42, borderRadius: 9, background: "var(--surface-2)", display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
                        {r.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : "💊"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="clamp-1" style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.category.name}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: "var(--brand-700)", fontSize: 14 }}>{formatPrice(r.price)}</div>
                    </Link>
                  ))}
                  <button className="search-all" onClick={submitSearch}>
                    <Search size={15} /> הצג את כל התוצאות עבור "{q.trim()}"
                  </button>
                </>
              )}
            </div>
          )}
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginInlineStart: "auto" }}>
          <Link href="/consult" className="btn btn-ghost hidden md:inline-flex" style={{ gap: 6 }}>
            <Sparkles size={16} style={{ color: "var(--brand-600)" }} /> ייעוץ AI
          </Link>

          {/* user menu */}
          <div
            className="user-menu hidden sm:block"
            style={{ position: "relative" }}
            onMouseEnter={() => setUserOpen(true)}
            onMouseLeave={() => setUserOpen(false)}
          >
            <button className="btn btn-ghost" style={{ gap: 6 }} onClick={() => (me ? setUserOpen((v) => !v) : router.push("/account"))}>
              <User size={18} />
              <span className="hidden lg:inline">{me ? me.name : "התחברות"}</span>
              {me && <ChevronDown size={14} />}
            </button>

            {userOpen && (
              <div className="user-dd">
                {me ? (
                  <>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--line)" }}>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>מחובר/ת כ־</div>
                      <div style={{ fontWeight: 700 }}>{me.name}</div>
                    </div>
                    <Link href="/account" className="user-dd-item" onClick={() => setUserOpen(false)}>
                      <Package size={16} /> ההזמנות שלי
                    </Link>
                    <button className="user-dd-item" onClick={logout} style={{ color: "var(--danger)", width: "100%" }}>
                      <LogOut size={16} /> התנתקות
                    </button>
                  </>
                ) : (
                  <Link href="/account" className="user-dd-item" onClick={() => setUserOpen(false)}>
                    <LogIn size={16} /> התחברות / הרשמה
                  </Link>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setOpen(true)} aria-label="עגלת קניות" className="btn btn-ghost" style={{ position: "relative", padding: 10, borderRadius: 12 }}>
            <ShoppingCart size={20} />
            {count > 0 && (
              <span style={{ position: "absolute", top: -6, insetInlineStart: -6, background: "var(--brand-600)", color: "#fff", borderRadius: 999, minWidth: 20, height: 20, fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center", padding: "0 5px" }}>
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
