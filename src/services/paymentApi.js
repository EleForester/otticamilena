import { supabase } from "../lib/supabaseClient";

/**
 * Calls the Supabase Edge Function to create a PaymentIntent.
 * @param {Object} params
 * @param {Array} params.items - Cart items
 * @param {Object} params.customer - Customer details
 * @param {string} params.currency - Currency code (default EUR)
 * @returns {Promise<{clientSecret: string, amount: number}>}
 */
export async function createPaymentIntent({ items, customer, currency, orderId }) {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { items, customer, currency, order_id: orderId },
    });

    if (error) {
        console.error("Error creating payment intent:", error);
        throw new Error(error.message || "Failed to initialize payment");
    }

    return data;
}
