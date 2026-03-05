import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!_stripe) {
    _stripe = new Stripe(secretKey);
  }
  return _stripe;
}

export const SUBSCRIPTION_COOKIE = "slay_customer_id";
export const SUB_CACHE_COOKIE = "slay_sub_cache";

/** Returns "active", "trialing", or "none" for a given Stripe customer. */
export async function checkSubscription(
  customerId: string
): Promise<"active" | "trialing" | "none"> {
  try {
    const stripe = getStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 1,
    });
    const sub = subscriptions.data[0];
    if (!sub) return "none";
    if (sub.status === "active" || sub.status === "trialing") return sub.status;
    return "none";
  } catch {
    return "none";
  }
}
