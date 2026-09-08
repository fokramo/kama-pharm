// PayPlus (Israeli gateway) hosted payment-page integration.
// When the sandbox/live keys are not configured, we fall back to a built-in
// mock payment page so the whole checkout flow still works end-to-end.

type PaymentItem = { name: string; quantity: number; price: number };

type CreatePaymentArgs = {
  orderId: number;
  amount: number;
  customer: { name: string; email?: string; phone: string };
  items: PaymentItem[];
};

export function isPayPlusConfigured(): boolean {
  return Boolean(
    process.env.PAYPLUS_API_KEY &&
      process.env.PAYPLUS_SECRET_KEY &&
      process.env.PAYPLUS_PAYMENT_PAGE_UID
  );
}

export async function createPaymentLink(
  args: CreatePaymentArgs
): Promise<{ url: string; ref: string; mock: boolean }> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // No real gateway keys → use our own mock payment screen.
  if (!isPayPlusConfigured()) {
    return {
      url: `${site}/checkout/mock-pay?order=${args.orderId}`,
      ref: `MOCK-${args.orderId}`,
      mock: true,
    };
  }

  const apiUrl = process.env.PAYPLUS_API_URL ?? "https://restapidev.payplus.co.il/api/v1.0";
  const res = await fetch(`${apiUrl}/PaymentPages/generateLink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.stringify({
        api_key: process.env.PAYPLUS_API_KEY,
        secret_key: process.env.PAYPLUS_SECRET_KEY,
      }),
    },
    body: JSON.stringify({
      payment_page_uid: process.env.PAYPLUS_PAYMENT_PAGE_UID,
      charge_method: 1, // regular charge
      amount: Number(args.amount.toFixed(2)),
      currency_code: "ILS",
      sendEmailApproval: true,
      sendEmailFailure: false,
      refURL_success: `${site}/checkout/success?order=${args.orderId}`,
      refURL_failure: `${site}/checkout?failed=1&order=${args.orderId}`,
      refURL_callback: `${site}/api/payment/callback`,
      more_info: String(args.orderId),
      customer: {
        customer_name: args.customer.name,
        email: args.customer.email,
        phone: args.customer.phone,
      },
      items: args.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: Number(i.price.toFixed(2)),
      })),
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const link = json?.data?.payment_page_link;
  const ref = json?.data?.page_request_uid;
  if (!link) {
    throw new Error(
      "PayPlus did not return a payment link: " + JSON.stringify(json?.results ?? json)
    );
  }
  return { url: link, ref: ref ?? `PP-${args.orderId}`, mock: false };
}
