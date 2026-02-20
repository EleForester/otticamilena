import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useCart } from "../context/CartContext";
import { createOrder } from "../services/ordersApi";
import { createPaymentIntent } from "../services/paymentApi";
import PaymentForm from "../components/PaymentForm";
import "../styles/Cart.css";

// Initialize Stripe outside of component to avoid recreating it on every render
// Make sure to add VITE_STRIPE_PUBLIC_KEY to your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

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
        address_line1: "",
        city: "",
        postal_code: "",
        country: "IT", // Default Italy
        note: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [pendingOrderId, setPendingOrderId] = useState(null);

    const currency = useMemo(() => items[0]?.currency || "EUR", [items]);

    const canSubmit = useMemo(() => {
        if (items.length === 0) return false;
        if (!form.customer_name.trim()) return false;
        if (!form.email.trim()) return false;
        if (!form.phone.trim()) return false;

        // Address is now mandatory for billing/Klarna even for pickup
        if (!form.address_line1.trim()) return false;
        if (!form.city.trim()) return false;
        if (!form.postal_code.trim()) return false;

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

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        try {
            setIsProcessing(true);
            setErrorMsg("");

            // 1. Create Pending Order in Database
            // Combine address fields for database storage
            const fullAddress = form.fulfillment_type === 'delivery'
                ? `${form.address_line1}, ${form.postal_code} ${form.city}, ${form.country}`
                : '';

            const orderId = await createOrder({
                customer: { ...form, address: fullAddress, status: 'pending' }, // Status Pending
                cartItems: items,
                total_cents: totals.total_cents,
                currency,
            });

            setPendingOrderId(orderId);

            // 2. Create Stripe Payment Intent (Server Side) 
            const paymentItems = items.map(i => ({...i, id: i.product_id}));
            const { clientSecret } = await createPaymentIntent({
                items: paymentItems,
                customer: {
                    name: form.customer_name,
                    email: form.email,
                    phone: form.phone,
                    address: {
                        line1: form.address_line1,
                        city: form.city,
                        postal_code: form.postal_code,
                        country: form.country,
                    }
                },
                currency,
                orderId: orderId, // Pass the newly created order ID
            });

            setClientSecret(clientSecret);

            // alert("Il sistema di pagamento (Stripe) è temporaneamente disabilitato poiché in attesa di configurazione. L'ordine è stato creato come 'pending'.");
            // navigate("/"); // Or redirect to a generic success page if available, for now home.

            // Note: We don't clear cart yet. We clear it only after success 
            // (handled by redirect or webhook, but for client-side flow typically after confirmation)

        } catch (err) {
            console.error("Payment init error:", err);
            setErrorMsg(`Errore: ${err.message || "Impossibile iniziare il pagamento"}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#d4af37', // Gold-ish, matching Ottica Milena vibe?
        },
    };

    const options = {
        clientSecret,
        appearance,
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

            {!clientSecret ? (
                /* Step 1: Shipping Info */
                <form onSubmit={handleProceedToPayment} className="checkout-form">
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
                            placeholder="Telefono (Obbligatorio per Klarna)"
                            value={form.phone}
                            onChange={onChange}
                            required
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

                    {/* Address Fields - Always visible for Billing/Klarna */}
                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#555' }}>
                            Indirizzo di Fatturazione {form.fulfillment_type === 'delivery' && "/ Spedizione"}
                        </h4>

                        <div className="form-group">
                            <input
                                className="form-input"
                                name="address_line1"
                                placeholder="Indirizzo (Via/Piazza e Civico)"
                                value={form.address_line1}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <input
                                    className="form-input"
                                    name="postal_code"
                                    placeholder="CAP"
                                    value={form.postal_code}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ flex: 2 }}>
                                <input
                                    className="form-input"
                                    name="city"
                                    placeholder="Città"
                                    value={form.city}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <select
                                className="form-input"
                                name="country"
                                value={form.country}
                                onChange={onChange}
                                disabled
                            >
                                <option value="IT">Italia</option>
                            </select>
                        </div>
                    </div>

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
                            disabled={!canSubmit || isProcessing}
                        >
                            {isProcessing ? "Elaborazione..." : "Procedi al Pagamento"}
                        </button>
                        <br />
                        <Link to="/carrello" className="back-link">← Torna al carrello</Link>
                    </div>
                </form>
            ) : (
                /* Step 2: Stripe Payment */
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {stripePromise && clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <PaymentForm
                                orderId={pendingOrderId}
                                totalCents={totals.total_cents}
                                customerDetails={form}
                            />
                        </Elements>
                    )}
                </div>
            )}
        </div>
    );
}
