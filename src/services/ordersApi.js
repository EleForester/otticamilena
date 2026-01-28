import { supabase } from "../lib/supabaseClient";

/**
 * Crée une commande + ses items.
 * cartItems: [{product_id,title,price_cents,qty,currency,...}]
 */
export async function createOrder({ customer, cartItems, total_cents, currency }) {
    // 1) insert order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            status: "new",
            customer_name: customer.customer_name,
            email: customer.email,
            phone: customer.phone || null,
            fulfillment_type: customer.fulfillment_type, // pickup | delivery
            address: customer.fulfillment_type === "delivery" ? (customer.address || null) : null,
            note: customer.note || null,
            total_cents,
            currency: currency || "EUR",
        })
        .select("id")
        .single();

    if (orderError) throw orderError;

    // 2) insert order items
    const itemsPayload = cartItems.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        name_snapshot: i.title,
        price_cents_snapshot: i.price_cents,
        qty: i.qty,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

    if (itemsError) throw itemsError;

    return order.id;
}
