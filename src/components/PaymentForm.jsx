import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "../styles/Cart.css"; // Reusing styles

export default function PaymentForm({ orderId, totalCents, customerDetails }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/ordine-successo/${orderId}`,
                payment_method_data: {
                    billing_details: {
                        name: customerDetails?.customer_name,
                        email: customerDetails?.email,
                        phone: customerDetails?.phone,
                        address: {
                            line1: customerDetails?.address_line1,
                            city: customerDetails?.city,
                            postal_code: customerDetails?.postal_code,
                            country: customerDetails?.country || 'IT',
                        }
                    },
                },
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
        defaultValues: {
            billingDetails: {
                name: customerDetails?.customer_name,
                email: customerDetails?.email,
                phone: customerDetails?.phone,
                address: {
                    line1: customerDetails?.address_line1,
                    city: customerDetails?.city,
                    postal_code: customerDetails?.postal_code,
                    country: customerDetails?.country || 'IT',
                }
            }
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="checkout-form">
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                Pagamento Sicuro
            </h3>

            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="confirm-btn"
                style={{ marginTop: '1.5rem', width: '100%' }}
            >
                {isLoading ? (
                    <div className="spinner" id="spinner">Elaborazione...</div>
                ) : (
                    `Paga €${(totalCents / 100).toFixed(2).replace('.', ',')}`
                )}
            </button>

            {message && <div id="payment-message" style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{message}</div>}
        </form>
    );


}
