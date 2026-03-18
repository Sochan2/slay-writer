import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ isPro: false, status: "none" });
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ isPro: false, status: "none" });
  }

  // Verify the stored status against Stripe directly
  const stripeStatus = await checkSubscription(sub.stripe_customer_id);
  const dbIsActive = sub.status === "active" || sub.status === "trialing";
  const stripeIsActive = stripeStatus === "active" || stripeStatus === "trialing";

  // DB says active but Stripe disagrees — fix the stale row
  if (dbIsActive && !stripeIsActive) {
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"]);
  }

  return NextResponse.json({
    isPro: stripeIsActive,
    status: stripeIsActive ? stripeStatus : "none",
  });
}
