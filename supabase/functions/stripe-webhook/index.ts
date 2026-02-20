//import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import Stripe from "https://esm.sh/stripe@14.17.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();


Deno.serve(async (req) => {
    const signature = req.headers.get("Stripe-Signature");
    const body = await req.text();

    let event;

    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature!,
            Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET") ?? "",
            undefined,
            cryptoProvider
        );
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log("PaymentIntent succeeded:", paymentIntent.id);

            const orderId = paymentIntent.metadata.order_id;

            if (orderId) {
                // Initialize Supabase Client
                const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
                const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
                const supabase = createClient(supabaseUrl, supabaseKey);

                // Update Order Status
                const { error } = await supabase
                    .from("orders")
                    .update({ status: "paid" })
                    .eq("id", orderId);

                if (error) {
                    console.error("Error updating order:", error);
                    return new Response("Error updating order", { status: 500 });
                }
                console.log(`Order ${orderId} marked as paid.`);
            }
            break;

        case "payment_intent.payment_failed":
            // Optionally handle failed payments
            const paymentIntentFailed = event.data.object;
            const failedOrderId = paymentIntentFailed.metadata.order_id;
            console.log(`Payment failed for order ${failedOrderId}`);
            // You could update status to 'failed' here
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
});
