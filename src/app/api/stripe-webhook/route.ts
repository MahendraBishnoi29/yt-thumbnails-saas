import type Stripe from "stripe";
import { env } from "~/env";
import stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err);
    return new Response(
      JSON.stringify({ error: "Webhook signature verification failed" }),
      {
        status: 400,
      },
    );
  }
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
  });
}
