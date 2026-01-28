import React from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/Cart.css";

export default function OrderSuccess() {
    const { id } = useParams();
    return (
        <div className="page-container success-container">
            <div className="success-icon">✅</div>
            <h1 className="cart-title">Ordine ricevuto!</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Grazie! Il tuo ordine è stato inviato correttamente.</p>

            <div className="order-id-box">
                ID Ordine: #{id}
            </div>

            <p style={{ color: '#666', marginTop: '1rem' }}>
                La boutique ti contatterà a breve tramite email o telefono <br />per confermare il pagamento e la modalità di ritiro/consegna.
            </p>

            <div style={{ marginTop: '2rem' }}>
                <Link to="/occhiali" className="checkout-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    Continua lo shopping
                </Link>
            </div>
        </div>
    );
}
