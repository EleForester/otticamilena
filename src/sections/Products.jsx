import React from 'react';
import '../styles/Products.css';

const products = [
    { id: 1, name: 'Modello Roma', price: '€120', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Modello Milano', price: '€145', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Modello Venezia', price: '€130', image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Modello Firenze', price: '€160', image: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
];

const Products = () => {
    return (
        <section id="products" className="products">
            <h2>I Nostri Occhiali</h2>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}></div>
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Products;
