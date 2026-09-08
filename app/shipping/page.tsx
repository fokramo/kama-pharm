export default function ShippingPage() {
  return (
    <div className="container-x" style={{ padding: "36px 20px 40px", maxWidth: 820 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>משלוחים והחזרות</h1>
      <div style={{ display: "grid", gap: 22, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.8 }}>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>זמני משלוח</h2>
          <p>משלוח עד הבית מתבצע תוך 1–3 ימי עסקים. משלוח חינם בקנייה מעל ₪199, אחרת דמי משלוח בסך ₪25.</p>
        </section>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>מדיניות החזרות</h2>
          <p>ניתן להחזיר מוצרים תקינים ובאריזתם המקורית עד 14 יום מיום קבלת ההזמנה, בכפוף לתקנון ולחוק הגנת הצרכן. מוצרים מסוימים (כגון תרופות ומוצרי היגיינה שנפתחו) אינם ניתנים להחזרה מטעמי בטיחות.</p>
        </section>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>מוצרים במרשם</h2>
          <p>מוצרים המסומנים כ״דורש מרשם״ יסופקו רק לאחר אימות מרשם תקף. נציג שירות ייצור עמכם קשר.</p>
        </section>
      </div>
    </div>
  );
}
