import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

function formatEUR(cents) {
    const value = (Number(cents) || 0) / 100;
    return value.toFixed(2).replace(".", ",");
}

export default function Cart() {
    const navigate = useNavigate();
    const { items, totals, removeFromCart, updateQty } = useCart();

    if (items.length === 0) {
        return (
            <div className="page-container">
                <h1>Carrello</h1>
                <p>Il tuo carrello è vuoto.</p>
                <Link to="/occhiali">← Torna al catalogo</Link>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <h1 className="cart-title">Carrello</h1>

            <div className="cart-items-grid">
                {items.map((i) => (
                    <div key={i.product_id} className="cart-item-card">
                        <div
                            className="cart-item-image"
                            style={{ backgroundImage: `url(${i.image_url || ""})` }}
                        />
                        <div className="cart-item-details">
                            <h3>{i.title}</h3>
                            <div className="cart-item-brand">{i.brand}</div>
                            <div className="cart-item-price-row">
                                €{formatEUR(i.price_cents)} x{" "}
                                <input
                                    type="number"
                                    min="1"
                                    value={i.qty}
                                    onChange={(e) => updateQty(i.product_id, e.target.value)}
                                    className="qty-input"
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div className="cart-item-subtotal">
                                €{formatEUR(i.price_cents * i.qty)}
                            </div>
                            <button
                                onClick={() => removeFromCart(i.product_id)}
                                className="remove-btn"
                            >
                                Rimuovi
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky summary footer or just bottom block */}
            <div className="cart-summary">
                <div className="cart-total">
                    Totale: €{formatEUR(totals.total_cents)}
                </div>
                <button
                    className="checkout-btn"
                    onClick={() => navigate("/checkout")}
                >
                    Procedi con l’ordine
                </button>
            </div>
        </div>
    );
}
