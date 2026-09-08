"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LayoutGrid, Tag, ChevronLeft, ChevronRight } from "lucide-react";

export type CatNavItem = { name: string; slug: string; icon: string | null };

export default function CategoryBar({ categories }: { categories: CatNavItem[] }) {
  const pathname = usePathname();
  const scroller = useRef<HTMLDivElement>(null);
  const [canStart, setCanStart] = useState(false); // more content toward inline-start
  const [canEnd, setCanEnd] = useState(false); // more content toward inline-end

  function update() {
    const el = scroller.current;
    if (!el) return;
    // In RTL, scrollLeft is 0 at the start (right) and negative toward the end (left).
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = Math.abs(el.scrollLeft);
    setCanEnd(left > 4); // scrolled away from start → can go back to start (visually right)
    setCanStart(left < maxScroll - 4); // not yet at the far end (visually left)
  }

  useEffect(() => {
    update();
    const el = scroller.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Direct scrollLeft assignment — reliable in all cases (native `smooth`
  // behaves badly for negative/RTL scrollLeft and rAF pauses on hidden tabs).
  function scrollStep(dir: number) {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft += dir * 300;
  }

  function onWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scroller.current!.scrollLeft += e.deltaY;
    }
  }

  return (
    <nav className="catbar">
      <div className="container-x catbar-wrap">
        {/* arrow toward the far (inline-start / left in RTL) items */}
        {canStart && (
          <button className="catbar-nav catbar-nav-start" onClick={() => scrollStep(-1)} aria-label="עוד קטגוריות">
            <ChevronLeft size={20} />
          </button>
        )}
        {/* arrow back toward the beginning (inline-end / right in RTL) */}
        {canEnd && (
          <button className="catbar-nav catbar-nav-end" onClick={() => scrollStep(1)} aria-label="חזרה">
            <ChevronRight size={20} />
          </button>
        )}

        <div className="catbar-inner no-scrollbar" ref={scroller} onWheel={onWheel}>
          <Link href="/categories" className="catbar-link" data-active={pathname === "/categories"}>
            <LayoutGrid size={17} /> כל הקטגוריות
          </Link>
          <Link href="/products?deals=1" className="catbar-link catbar-deal">
            <Tag size={17} /> מבצעים
          </Link>
          <span style={{ width: 1, height: 22, background: "var(--line)", margin: "0 4px", flexShrink: 0 }} />
          {categories.map((c) => {
            const href = `/category/${c.slug}`;
            return (
              <Link key={c.slug} href={href} className="catbar-link" data-active={pathname === href}>
                <span>{c.icon}</span> {c.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
