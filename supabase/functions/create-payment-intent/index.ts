import Stripe from "https://esm.sh/stripe@14.17.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Initialize Stripe
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });

        // 2. Initialize Supabase (Service Role to access all data securely)
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 3. Parse Request Body
        const { items, currency = "EUR", customer, order_id } = await req.json();

        if (!items || items.length === 0) {
            throw new Error("Cart is empty");
        }

        // 4. Secure Price Calculation
        const productIds = items.map((item: any) => item.id || item.product_id);

        const { data: dbProducts, error } = await supabase
            .from("products")
            .select("id, price_cents, title")
            .in("id", productIds);

        if (error || !dbProducts) {
            console.error("Database error:", error);
            throw new Error("Failed to validate product prices");
        }

        let totalCents = 0;

        for (const item of items) {
            const itemId = item.id || item.product_id;
            const dbProduct = dbProducts.find((p) => p.id === itemId);
            
            if (!dbProduct) {
                throw new Error(`Product ID ${itemId} not found/active`);
            }

            totalCents += (dbProduct.price_cents * item.qty);
        }

        // 5. Final Validation
        if (totalCents < 50) { 
            throw new Error("Amount too small for payment");
        }

        console.log(`Creating payment intent for Order ${order_id}. Validated Total: ${totalCents} cents.`);

        // 6. Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCents,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            shipping: {
                name: customer?.name,
                phone: customer?.phone,
                address: {
                    line1: customer?.address?.line1,
                    city: customer?.address?.city,
                    postal_code: customer?.address?.postal_code,
                    country: customer?.address?.country || 'IT',
                },
            },
            metadata: {
                customer_name: customer?.name,
                customer_email: customer?.email,
                integration_check: "accept_a_payment",
                order_id: order_id, 
            },
            receipt_email: customer?.email,
        });

        // 7. Return Client Secret
        return new Response(
            JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                amount: totalCents
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );

    } catch (error) {
        console.error("Payment error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
