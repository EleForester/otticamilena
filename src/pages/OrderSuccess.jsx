import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import "../styles/Cart.css";

export default function OrderSuccess() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [statusMessage, setStatusMessage] = useState("Verifica dello stato del pagamento...");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const redirectStatus = searchParams.get("redirect_status");

        switch (redirectStatus) {
            case "succeeded":
                setStatusMessage("Pagamento confermato! Grazie per il tuo acquisto.");
                setIsError(false);
                break;
            case "processing":
                setStatusMessage("Il pagamento è in fase di elaborazione. Ti aggiorneremo appena completato.");
                setIsError(false);
                break;
            case "requires_payment_method":
            case "canceled":
            case "failed":
                setStatusMessage("Il pagamento è stato annullato o non è andato a buon fine.");
                setIsError(true);
                break;
            default:
                // If no status is present, it might be a direct navigation or unexpected state
                // For safety, we treat it as pending/uncertain or error depending on requirements.
                // Assuming if we land here without success, it's not confirmed.
                setStatusMessage("Stato del pagamento sconosciuto o annullato.");
                setIsError(true);
                break;
        }
        setIsLoading(false);
    }, [searchParams]);

    return (
        <div className="page-container success-container">
            <div className="success-icon">
                {isLoading ? "⏳" : (isError ? "⚠️" : "✅")}
            </div>
            <h1 className="cart-title">
                {isLoading ? "Verifica in corso..." : (isError ? "Attenzione" : "Ordine ricevuto!")}
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{statusMessage}</p>

            <div className="order-id-box">
                ID Ordine: #{id}
            </div>

            <p style={{ color: '#666', marginTop: '1rem' }}>
                {!isError && "La boutique ti contatterà a breve tramite email o telefono per confermare il pagamento e la modalità di ritiro/consegna."}
            </p>

            <div style={{ marginTop: '2rem' }}>
                <Link to={isError ? "/checkout" : "/occhiali"} className="checkout-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    {isError ? "Riprova il pagamento" : "Continua lo shopping"}
                </Link>
            </div>
        </div>
    );
}
