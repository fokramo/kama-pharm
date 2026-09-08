export default function PrivacyPage() {
  return (
    <div className="container-x" style={{ padding: "36px 20px 40px", maxWidth: 820 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>מדיניות פרטיות</h1>
      <div style={{ display: "grid", gap: 18, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.8 }}>
        <p>אנו בקמא פארם מכבדים את פרטיותכם. מדיניות זו מתארת כיצד אנו אוספים ומשתמשים במידע שלכם.</p>
        <p><b style={{ color: "var(--ink)" }}>איזה מידע נאסף:</b> פרטים שאתם מוסרים בעת ביצוע הזמנה (שם, טלפון, כתובת, אימייל) לצורך אספקת ההזמנה ושירות לקוחות.</p>
        <p><b style={{ color: "var(--ink)" }}>תשלומים:</b> פרטי כרטיס האשראי מעובדים באופן מאובטח דרך ספק סליקה חיצוני ומוצפן, ואינם נשמרים בשרתי האתר.</p>
        <p><b style={{ color: "var(--ink)" }}>שמירת מידע:</b> איננו מוכרים את המידע שלכם לצדדים שלישיים. המידע נשמר לצרכים תפעוליים ומשפטיים בלבד.</p>
        <p>בכל שאלה בנוגע לפרטיות ניתן לפנות אלינו בכתובת info@kamapharm.co.il.</p>
      </div>
    </div>
  );
}
