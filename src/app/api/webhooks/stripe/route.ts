import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      if (!userId || !customerId || !session.subscription) {
        console.warn("[webhook] checkout.session.completed missing required fields");
        break;
      }

      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subData = sub as any;
      const { error } = await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          status: sub.status,
          trial_end: subData.trial_end
            ? new Date(subData.trial_end * 1000).toISOString()
            : null,
          current_period_end: subData.current_period_end
            ? new Date(subData.current_period_end * 1000).toISOString()
            : null,
        },
        { onConflict: "stripe_subscription_id" }
      );

      if (error) {
        console.error("[webhook] Failed to save subscription:", error);
      } else {
        console.log("[webhook] Subscription saved for user:", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subData = sub as any;

      const { error } = await admin
        .from("subscriptions")
        .update({
          status: sub.status,
          trial_end: subData.trial_end
            ? new Date(subData.trial_end * 1000).toISOString()
            : null,
          current_period_end: subData.current_period_end
            ? new Date(subData.current_period_end * 1000).toISOString()
            : null,
        })
        .eq("stripe_subscription_id", sub.id);

      if (error) {
        console.error("[webhook] Failed to update subscription:", error);
      } else {
        console.log("[webhook] Subscription updated:", sub.id, "status:", sub.status);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;

      const { error } = await admin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);

      if (error) {
        console.error("[webhook] Failed to cancel subscription:", error);
      } else {
        console.log("[webhook] Subscription canceled:", sub.id);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
