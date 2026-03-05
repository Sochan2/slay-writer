import { NextRequest, NextResponse } from "next/server";
import { getStripe, SUBSCRIPTION_COOKIE, SUB_CACHE_COOKIE } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

/** Called after Stripe Checkout success. Saves subscription to Supabase, sets cookies, redirects to /generate. */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const baseUrl = new URL("/", request.url).origin;

  if (!sessionId) {
    return NextResponse.redirect(`${baseUrl}/pricing`);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (!session.customer || !session.client_reference_id) {
      return NextResponse.redirect(`${baseUrl}/pricing`);
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer.id;

    const userId = session.client_reference_id;

    // Save subscription to Supabase immediately so /api/generate sees it right away
    if (session.subscription) {
      const sub = session.subscription as Stripe.Subscription;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subData = sub as any;
      const admin = createAdminClient();
      await admin.from("subscriptions").upsert(
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
    }

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.redirect(`${baseUrl}/generate`);

    response.cookies.set(SUBSCRIPTION_COOKIE, customerId, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    response.cookies.set(SUB_CACHE_COOKIE, "active", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[/api/subscription/confirm] Error:", error);
    return NextResponse.redirect(`${baseUrl}/pricing`);
  }
}
