import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { requireStripe } from "@/lib/stripe";
import { createOrderFromStripeSession } from "@/lib/orders";

export async function POST(request: Request) {
  const headerStore = await Promise.resolve(headers());
  const signature =
    typeof headerStore?.get === "function"
      ? headerStore.get("stripe-signature")
      : null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  try {
    const stripe = requireStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await createOrderFromStripeSession(session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook error" },
      { status: 400 }
    );
  }
}
