// Order confirmation emails via Resend (https://resend.com).
// No-ops safely when RESEND_API_KEY is not configured.

import { formatPrice } from "./format";

type OrderLite = {
  id: number;
  customerName: string;
  email: string | null;
  phone: string;
  city: string;
  address: string;
  items: string; // JSON
  subtotal: number;
  shipping: number;
  total: number;
};

function buildHtml(order: OrderLite): string {
  let items: { name: string; qty: number; price: number }[] = [];
  try {
    items = JSON.parse(order.items);
  } catch {
    /* ignore */
  }
  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.name} × ${i.qty}</td><td style="padding:6px 0;text-align:left">${formatPrice(
          i.price * i.qty
        )}</td></tr>`
    )
    .join("");

  return `
  <div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#0f172a">
    <div style="background:linear-gradient(135deg,#10b981,#047857);color:#fff;padding:24px;border-radius:14px 14px 0 0">
      <h1 style="margin:0;font-size:22px">קמא פארם</h1>
      <p style="margin:6px 0 0;opacity:.9">תודה על הזמנתך! 🎉</p>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 14px 14px">
      <p>שלום ${order.customerName},</p>
      <p>הזמנתך <b>#${order.id}</b> התקבלה ואנחנו מכינים אותה למשלוח.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;border-top:1px solid #e2e8f0">
        ${rows}
        <tr><td style="padding:8px 0;border-top:1px solid #e2e8f0">משלוח</td><td style="padding:8px 0;border-top:1px solid #e2e8f0;text-align:left">${
          order.shipping === 0 ? "חינם" : formatPrice(order.shipping)
        }</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;font-size:16px">סה״כ</td><td style="padding:8px 0;font-weight:700;font-size:16px;text-align:left">${formatPrice(
          order.total
        )}</td></tr>
      </table>
      <p style="font-size:14px;color:#475569">כתובת למשלוח: ${order.address}, ${order.city} · טלפון: ${order.phone}</p>
      <p style="font-size:12px;color:#94a3b8;margin-top:20px">המידע באתר אינו מהווה תחליף לייעוץ רפואי מקצועי.</p>
    </div>
  </div>`;
}

export async function sendOrderEmails(order: OrderLite): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // email not configured yet — skip silently
  const from = process.env.EMAIL_FROM || "Kama Pharm <onboarding@resend.dev>";
  const html = buildHtml(order);

  const messages: { to: string[]; subject: string }[] = [];
  if (order.email) messages.push({ to: [order.email], subject: `אישור הזמנה #${order.id} — קמא פארם` });
  if (process.env.ADMIN_EMAIL) messages.push({ to: [process.env.ADMIN_EMAIL], subject: `🛒 הזמנה חדשה #${order.id}` });

  await Promise.all(
    messages.map((m) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: m.to, subject: m.subject, html }),
      }).catch(() => {})
    )
  );
}
