import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

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
    return NextResponse.json(
      { error: "Failed to create portal session." },
      { status: 500 }
    );
  }
}
