import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/ordersApi";
import "../styles/Cart.css";

function formatEUR(cents) {
    const value = (Number(cents) || 0) / 100;
    return value.toFixed(2).replace(".", ",");
}

export default function Checkout() {
    const navigate = useNavigate();
    const { items, totals, clearCart } = useCart();

    const [form, setForm] = useState({
        customer_name: "",
        email: "",
        phone: "",
        fulfillment_type: "pickup", // pickup | delivery
        address: "",
        note: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const currency = useMemo(() => items[0]?.currency || "EUR", [items]);

    const canSubmit = useMemo(() => {
        if (items.length === 0) return false;
        if (!form.customer_name.trim()) return false;
        if (!form.email.trim()) return false;
        if (form.fulfillment_type === "delivery" && !form.address.trim()) return false;
        return true;
    }, [items.length, form]);

    if (items.length === 0) {
        return (
            <div className="page-container">
                <h1>Checkout</h1>
                <p>Il carrello è vuoto.</p>
                <Link to="/occhiali">← Torna al catalogo</Link>
            </div>
        );
    }

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        try {
            setSubmitting(true);
            setErrorMsg("");

            const orderId = await createOrder({
                customer: form,
                cartItems: items,
                total_cents: totals.total_cents,
                currency,
            });

            clearCart();
            navigate(`/ordine-successo/${orderId}`);
        } catch (err) {
            console.error("Order submission error:", err);
            setErrorMsg(`Errore: ${err.message || JSON.stringify(err) || "impossibile inviare ordine"}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="cart-page-container">
            <h1 className="cart-title">Checkout</h1>

            <div className="cart-summary" style={{ marginTop: 0, marginBottom: '2rem', textAlign: 'center' }}>
                <div className="cart-total">
                    Totale: €{formatEUR(totals.total_cents)}
                </div>
            </div>

            {errorMsg && (
                <div style={{ marginBottom: 12, color: 'red', textAlign: 'center' }}>
                    <p>{errorMsg}</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="checkout-form">
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Dati Spedizione</h3>

                <div className="form-group">
                    <input
                        className="form-input"
                        name="customer_name"
                        placeholder="Nome e cognome"
                        value={form.customer_name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-input"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={onChange}
                        type="email"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-input"
                        name="phone"
                        placeholder="Telefono (opzionale)"
                        value={form.phone}
                        onChange={onChange}
                    />
                </div>

                <div className="radio-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="fulfillment_type"
                            value="pickup"
                            checked={form.fulfillment_type === "pickup"}
                            onChange={onChange}
                        />
                        Ritiro in negozio
                    </label>

                    <label className="radio-label">
                        <input
                            type="radio"
                            name="fulfillment_type"
                            value="delivery"
                            checked={form.fulfillment_type === "delivery"}
                            onChange={onChange}
                        />
                        Consegna a domicilio
                    </label>
                </div>

                {form.fulfillment_type === "delivery" && (
                    <div className="form-group">
                        <textarea
                            className="form-textarea"
                            name="address"
                            placeholder="Indirizzo completo (Via, Città, CAP...)"
                            value={form.address}
                            onChange={onChange}
                            rows={3}
                            required
                        />
                    </div>
                )}

                <div className="form-group">
                    <textarea
                        className="form-textarea"
                        name="note"
                        placeholder="Note aggiuntive (opzionale)"
                        value={form.note}
                        onChange={onChange}
                        rows={2}
                    />
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                        type="submit"
                        className="confirm-btn"
                        disabled={!canSubmit || submitting}
                    >
                        {submitting ? "Invio in corso..." : "Conferma ordine"}
                    </button>
                    <br />
                    <Link to="/carrello" className="back-link">← Torna al carrello</Link>
                </div>
            </form>
        </div>
    );
}
