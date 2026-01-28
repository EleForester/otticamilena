import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <section id="about" className="about">
            <div className="about-container">
                <div className="about-text">
                    <h2>Chi Siamo</h2>
                    <p>
                        Ottica Milena nasce dalla passione per l'ottica e il design. Situati nel cuore dell'Italia,
                        offriamo una selezione curata di montature che uniscono stile, comfort e qualità.
                    </p>
                    <p>
                        La nostra missione è aiutarti a trovare l'occhiale perfetto che esprima la tua personalità
                        e migliori la tua visione.
                    </p>
                </div>
                <div className="about-image">
                    {/* Placeholder for shop interior or owner */}
                    <div className="image-placeholder">Immagine Negozio</div>
                </div>
            </div>
        </section>
    );
};

export default About;
