import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data/services';
import '../styles/Services.css';

const Services = () => {
    return (
        <div className="services-page page-container">
            <header className="services-header">
                <h1>I Nostri Servizi</h1>
                <p className="intro-text">
                    Tecnologia e professionalità al servizio della tua vista.
                    <br />Scopri come ci prendiamo cura dei tuoi occhi.
                </p>
                <div className="header-decoration"></div>
            </header>

            <div className="services-grid">
                {services.map((service, index) => (
                    <div key={service.id} className="service-card">
                        <div className="card-image">
                            <img src={service.image} alt={service.title} />
                        </div>
                        <div className="service-content">
                            <div className="service-icon">{service.icon}</div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Prenota un Controllo</h2>
                    <p>La prevenzione è il primo passo per una vista perfetta.</p>
                    <Link to="/contatti" className="btn-cta">Contatta lo Studio</Link>
                </div>
            </section>
        </div>
    );
};

export default Services;
