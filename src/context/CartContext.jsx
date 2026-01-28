import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "ottica_cart_v1";

function safeParse(json, fallback) {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? safeParse(raw, []) : [];
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (product, qty = 1) => {
        if (!product?.id) return;

        setItems((prev) => {
            const existing = prev.find((i) => i.product_id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.product_id === product.id ? { ...i, qty: i.qty + qty } : i
                );
            }

            // snapshot minimal pour éviter les surprises si le produit change plus tard
            return [
                ...prev,
                {
                    product_id: product.id,
                    title: product.title,
                    brand: product.brand ?? "",
                    price_cents: product.price_cents,
                    currency: product.currency ?? "EUR",
                    image_url: product.image_url ?? "",
                    qty,
                },
            ];
        });
    };

    const removeFromCart = (productId) => {
        setItems((prev) => prev.filter((i) => i.product_id !== productId));
    };

    const updateQty = (productId, qty) => {
        const q = Number(qty);
        if (!Number.isFinite(q) || q <= 0) return;
        setItems((prev) =>
            prev.map((i) => (i.product_id === productId ? { ...i, qty: q } : i))
        );
    };

    const clearCart = () => setItems([]);

    const totals = useMemo(() => {
        const total_cents = items.reduce((sum, i) => sum + i.price_cents * i.qty, 0);
        const count = items.reduce((sum, i) => sum + i.qty, 0);
        return { total_cents, count };
    }, [items]);

    const value = useMemo(
        () => ({
            items,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart,
            totals,
        }),
        [items, totals]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
