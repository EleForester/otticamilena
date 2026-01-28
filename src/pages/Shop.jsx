import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Products.css';
import { fetchActiveProducts } from '../services/productsAPI';

const Shop = () => {
    const [filter, setFilter] = useState('Tutti');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErrorMsg('');
                const data = await fetchActiveProducts();
                setProducts(data);
            } catch (e) {
                console.error(e);
                setErrorMsg(e.message || JSON.stringify(e) || 'Errore sconosciuto');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredProducts = useMemo(() => {
        if (filter === 'Tutti') return products;

        // On suppose que tu ajoutes une colonne "category" dans Supabase ("Vista" / "Sole")
        // Si tu ne l'as pas encore, le filtre affichera simplement tout (car category sera undefined)
        return products.filter((p) => p.category === filter);
    }, [products, filter]);

    const formatPriceEUR = (price_cents) => {
        const value = (Number(price_cents) || 0) / 100;
        return value.toFixed(2).replace('.', ',');
    };

    if (loading) {
        return (
            <div className="page-container shop-page">
                <header className="shop-header">
                    <div className="header-left">
                        <h1>Occhiali</h1>
                        <p className="collection-subtitle">Collezione 2024</p>
                    </div>
                </header>
                <div className="no-products">
                    <p>Caricamento...</p>
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="page-container shop-page">
                <header className="shop-header">
                    <div className="header-left">
                        <h1>Occhiali</h1>
                        <p className="collection-subtitle">Collezione 2024</p>
                    </div>
                </header>
                <div className="no-products">
                    <div className="no-products">
                        <p>{errorMsg}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container shop-page">
            <header className="shop-header">
                <div className="header-left">
                    <h1>Occhiali</h1>
                    <p className="collection-subtitle">Collezione 2024</p>
                </div>

                <nav className="filter-nav">
                    <button
                        onClick={() => setFilter('Tutti')}
                        className={`filter-btn ${filter === 'Tutti' ? 'active' : ''}`}
                    >
                        Tutti
                    </button>
                    <button
                        onClick={() => setFilter('Vista')}
                        className={`filter-btn ${filter === 'Vista' ? 'active' : ''}`}
                    >
                        Vista
                    </button>
                    <button
                        onClick={() => setFilter('Sole')}
                        className={`filter-btn ${filter === 'Sole' ? 'active' : ''}`}
                    >
                        Sole
                    </button>
                </nav>
            </header>

            <div className="products-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="card-image-wrapper">
                            <div
                                className="product-image"
                                style={{ backgroundImage: `url(${product.image_url || ''})` }}
                            ></div>
                            <div className="card-overlay">
                                <Link to={`/occhiali/${product.id}`} className="btn-view">
                                    Guarda
                                </Link>
                            </div>
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.title}</h3>
                            <div className="product-meta">
                                <span className="product-brand">{product.brand}</span>
                                <span className="product-price">
                                    €{formatPriceEUR(product.price_cents)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-products">
                    <p>Nessun prodotto trovato in questa categoria.</p>
                </div>
            )}
        </div>
    );
};

export default Shop;
