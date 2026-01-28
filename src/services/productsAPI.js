import { supabase } from "../lib/supabaseClient";

/**
 * Retourne les produits actifs depuis Supabase
 */
export async function fetchActiveProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("id, slug, title, brand, description, price_cents, currency, image_url, active, category")
        .eq("active", true)
        .order("id", { ascending: true });

    if (error) throw error;
    return data ?? [];
}

/**
 * Récupère un produit par id
 */
export async function fetchProductById(id) {
    const { data, error } = await supabase
        .from("products")
        .select("id, slug, title, brand, description, price_cents, currency, image_url, active, category")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;
    return data;
}
