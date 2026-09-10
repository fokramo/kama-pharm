"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  emoji: string;
  gradient: string;
};

const DEFAULT_SLIDES: Slide[] = [
  {
    title: "משלוח חינם עד הבית",
    subtitle: "בכל קנייה מעל ₪199 — ישירות עד הדלת תוך 1–3 ימי עסקים",
    cta: "התחל בקנייה",
    href: "/products",
    emoji: "🚚",
    gradient: "linear-gradient(120deg,#047857,#10b981)",
  },
];

export default function HeroCarousel({ slides }: { slides?: Slide[] }) {
  const SLIDES = slides && slides.length ? slides : DEFAULT_SLIDES;
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = SLIDES.length;

  function start() {
    stop();
    timer.current = setInterval(() => setI((v) => (v + 1) % n), 5000);
  }
  function stop() {
    if (timer.current) clearInterval(timer.current);
  }
  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (next: number) => setI((next + n) % n);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className="hero-slide"
          style={{ background: s.gradient, opacity: idx === i ? 1 : 0, pointerEvents: idx === i ? "auto" : "none" }}
          aria-hidden={idx !== i}
        >
          <div style={{ position: "relative", zIndex: 1, maxWidth: 560 }}>
            <h2 style={{ fontSize: "clamp(24px,3.6vw,38px)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.92)", marginBottom: 20 }}>{s.subtitle}</p>
            <Link href={s.href} className="btn" style={{ background: "#fff", color: "#0f172a", padding: "12px 24px" }}>
              {s.cta} <ArrowLeft size={17} />
            </Link>
          </div>
          <div className="hero-slide-emoji">{s.emoji}</div>
        </div>
      ))}

      {/* arrows */}
      <button className="hero-arrow" style={{ insetInlineStart: 14 }} onClick={() => go(i - 1)} aria-label="הקודם">
        <ChevronRight size={22} />
      </button>
      <button className="hero-arrow" style={{ insetInlineEnd: 14 }} onClick={() => go(i + 1)} aria-label="הבא">
        <ChevronLeft size={22} />
      </button>

      {/* dots */}
      <div className="hero-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => go(idx)}
            aria-label={`מעבר לשקופית ${idx + 1}`}
            style={{
              width: idx === i ? 26 : 9,
              height: 9,
              borderRadius: 999,
              background: idx === i ? "#fff" : "rgba(255,255,255,0.55)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
