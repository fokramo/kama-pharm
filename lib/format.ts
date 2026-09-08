// Shared helpers for pricing, shipping and formatting (Hebrew / ILS ₪)

export const SHIPPING_FEE = Number(
  process.env.NEXT_PUBLIC_SHIPPING_FEE ?? "25"
);
export const FREE_SHIPPING_OVER = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_OVER ?? "199"
);

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calcShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
}

export function calcDiscount(price: number, compareAt?: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  pending: { label: "ממתין לתשלום", color: "#b45309" },
  paid: { label: "שולם", color: "#047857" },
  processing: { label: "בהכנה", color: "#2563eb" },
  delivered: { label: "נמסר", color: "#059669" },
  cancelled: { label: "בוטל", color: "#dc2626" },
};
