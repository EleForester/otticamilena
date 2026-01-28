import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductDetail.css';
import { fetchProductById } from '../services/productsAPI';
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart } = useCart();


    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErrorMsg('');
                const data = await fetchProductById(Number(id));
                if (!data) {
                    setErrorMsg('Prodotto non trovato.');
                } else {
                    setProduct(data);
                }
            } catch (e) {
                console.error(e);
                setErrorMsg('Errore nel caricamento del prodotto.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const formatPriceEUR = (price_cents) => {
        const value = (Number(price_cents) || 0) / 100;
        return value.toFixed(2).replace('.', ',');
    };

    if (loading) {
        return (
            <div className="page-container product-detail-container">
                <p>Caricamento...</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="page-container">
                {errorMsg}{' '}
                <Link to="/occhiali">Torna al catalogo</Link>
            </div>
        );
    }

    return (
        <div className="page-container product-detail-container">
            <div
                className="detail-image"
                style={{ backgroundImage: `url(${product.image_url || ''})` }}
            ></div>

            <div className="detail-info">
                <h1>{product.title}</h1>

                {product.brand && (
                    <h3 className="brand">{product.brand}</h3>
                )}

                <p className="price">
                    €{formatPriceEUR(product.price_cents)}
                </p>

                {product.description && (
                    <p className="description">{product.description}</p>
                )}

                {product.category && (
                    <p className="category">Categoria: {product.category}</p>
                )}

                <div className="actions">
                    {/* Étape suivante : brancher le panier */}
                    <button
                        className="cta-button"
                        onClick={() => {
                            addToCart(product, 1);
                            setIsAdded(true);
                            setTimeout(() => setIsAdded(false), 2000);
                        }}
                        style={{ backgroundColor: isAdded ? '#4CAF50' : '' }}
                    >
                        {isAdded ? "Aggiunto! ✓" : "Aggiungi al Carrello"}
                    </button>

                    <Link to="/contatti" className="secondary-button">
                        Richiedi Info
                    </Link>
                </div>

                <Link to="/occhiali" className="back-link">
                    ← Torna agli occhiali
                </Link>
            </div>
        </div>
    );
};

export default ProductDetail;
