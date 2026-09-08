export default function TermsPage() {
  return (
    <div className="container-x" style={{ padding: "36px 20px 40px", maxWidth: 820 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>תקנון האתר</h1>
      <div style={{ display: "grid", gap: 16, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.8 }}>
        <p>השימוש באתר קמא פארם ורכישת מוצרים כפופים לתנאים המפורטים להלן.</p>
        <ol style={{ display: "grid", gap: 10, paddingInlineStart: 22 }}>
          <li>המחירים באתר כוללים מע״מ ונקובים בשקלים חדשים (₪).</li>
          <li>אספקת מוצרים במרשם כפופה להצגת מרשם תקף ולאישור.</li>
          <li>המידע באתר, לרבות ייעוץ הבינה המלאכותית, הוא כללי בלבד ואינו תחליף לייעוץ רפואי.</li>
          <li>החברה רשאית לעדכן מחירים, מבצעים ומלאי בכל עת.</li>
          <li>ביטול עסקה והחזרת מוצרים בהתאם לחוק הגנת הצרכן, התשמ״א-1981.</li>
        </ol>
        <p>המשך השימוש באתר מהווה הסכמה לתנאים אלו.</p>
      </div>
    </div>
  );
}
