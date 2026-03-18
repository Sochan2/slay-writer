import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in.", redirect: "/login" },
      { status: 401 }
    );
  }

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .single();

  if (error || !subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No active subscription found." },
      { status: 404 }
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: "https://slay-writer.vercel.app/login",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[/api/portal] Error:", err);

    // Stripe says the customer doesn't exist — DB data is stale, clean it up
    if (
      err instanceof Stripe.errors.StripeInvalidRequestError &&
      err.code === "resource_missing"
    ) {
      const admin = createAdminClient();
      await admin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"]);

      return NextResponse.json(
        { error: "No active subscription found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create portal session." },
      { status: 500 }
    );
  }
}
