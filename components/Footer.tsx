import Link from "next/link";
import Logo from "./Logo";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#0b1220", color: "#cbd5e1", marginTop: 64 }}>
      <div className="container-x" style={{ padding: "48px 20px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 32,
          }}
        >
          <div>
            <div style={{ filter: "brightness(1.6)" }}>
              <Logo />
            </div>
            <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.7, color: "#94a3b8" }}>
              בית המרקחת המקוון שלך — מוצרי בריאות, טיפוח וויטמינים באיכות גבוהה,
              עם ייעוץ חכם ומשלוח מהיר עד הבית.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#fff", marginBottom: 14 }}>ניווט מהיר</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li><Link href="/products">כל המוצרים</Link></li>
              <li><Link href="/categories">קטגוריות</Link></li>
              <li><Link href="/consult">ייעוץ AI</Link></li>
              <li><Link href="/about">אודות</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#fff", marginBottom: 14 }}>שירות לקוחות</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li><Link href="/shipping">משלוחים והחזרות</Link></li>
              <li><Link href="/privacy">מדיניות פרטיות</Link></li>
              <li><Link href="/terms">תקנון</Link></li>
              <li><Link href="/account">החשבון שלי</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#fff", marginBottom: 14 }}>צור קשר</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12, fontSize: 14 }}>
              <li style={{ display: "flex", gap: 8 }}><MapPin size={16} /> רח' הרצל 10, תל אביב</li>
              <li style={{ display: "flex", gap: 8 }}><Phone size={16} /> 6600*</li>
              <li style={{ display: "flex", gap: 8 }}><Mail size={16} /> info@kamapharm.co.il</li>
              <li style={{ display: "flex", gap: 8 }}><Clock size={16} /> א׳–ה׳ 08:00–20:00</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1e293b", marginTop: 32, paddingTop: 20, fontSize: 13, color: "#64748b", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
          <span>© {new Date().getFullYear()} קמא פארם. כל הזכויות שמורות.</span>
          <span>המידע באתר אינו מהווה תחליף לייעוץ רפואי מקצועי.</span>
        </div>
      </div>
    </footer>
  );
}
