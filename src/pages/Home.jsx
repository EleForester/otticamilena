import React from 'react';
import Hero from '../sections/Hero';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import '../styles/Products.css'; // Reusing efficient grid styles
// We define local styles or assume reliance on global/Products.css. 
// Adding inline style object for section-specific tweaks if needed, but standard classes are better.

const Home = () => {
    // Get latest 3 products
    const newArrivals = products.slice(0, 3);

    return (
        <div className="home-page">
            <Hero />

            {/* Main Content Area - Using page-container to ensure spacing and footer push */}
            <div className="page-container">

                <section className="featured-section" style={{ padding: '4rem 0' }}>
                    <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem' }}>Nuovi Arrivi</h2>
                        <div style={{ width: '50px', height: '3px', background: 'var(--accent-color)', margin: '1rem auto' }}></div>
                        <p style={{ color: '#666' }}>Scopri le ultime tendenze della nostra collezione.</p>
                    </div>

                    <div className="products-grid">
                        {newArrivals.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="card-image-wrapper">
                                    <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}></div>
                                    <div className="card-overlay">
                                        <Link to={`/occhiali/${product.id}`} className="btn-view">Guarda</Link>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-meta">
                                        <span className="product-brand">{product.brand}</span>
                                        <span className="product-price">€{product.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-footer" style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <Link to="/occhiali" className="btn-cta-secondary" style={{
                            textDecoration: 'none',
                            color: 'var(--primary-color)',
                            border: '1px solid var(--primary-color)',
                            padding: '12px 30px',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'all 0.3s'
                        }}>
                            Vedi Tutta la Collezione
                        </Link>
                    </div>
                </section>

                {/* Optional: Additional teaser can go here (e.g., Services teaser) */}
            </div>
        </div>
    );
};

export default Home;
