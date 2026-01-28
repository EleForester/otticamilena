import React from 'react';
import '../styles/About.css';
import christmasImage from '../assets/christmas_store.jpg';
import aboutArt from '../assets/about_art.png';

const About = () => {
    return (
        <div className="about-page">
            <div className="page-container">
                <div className="minimal-header">
                    <h1>Chi Siamo</h1>
                    <p className="subtitle">L'arte di vedere il mondo.</p>
                </div>

                <div className="content-wrapper">
                    {/* Story Section */}
                    <section className="about-section story-section">
                        <div className="text-block">
                            <h2>La Nostra Storia</h2>
                            <div className="divider"></div>
                            <p>
                                <strong>Dal 2003</strong>, con passione e professionalità, ci dedichiamo ai nostri clienti affinché la scelta dell'occhiale,
                                che sia da sole o da vista, diventi l'occasione per regalarsi un momento magico!
                            </p>
                            <p>
                                Quello che è nato come un piccolo laboratorio è oggi una realtà consolidata, dove la tradizione incontra l'innovazione
                                per offrirti sempre il meglio del design e della tecnologia ottica. Ogni montatura racconta una storia, la tua.
                            </p>
                        </div>
                        <div className="image-block story-image">
                            <img src={christmasImage} alt="Il team di Ottica Milena" />
                        </div>
                    </section>

                    {/* Values Section */}
                    <section className="about-section values-section">
                        <div className="image-block values-image">
                            <img src={aboutArt} alt="Visione Artistica" />
                        </div>
                        <div className="text-block">
                            <h2>I Nostri Valori</h2>
                            <div className="divider"></div>
                            <p>
                                Crediamo nella bellezza funzionale. Non vendiamo semplici oggetti, ma strumenti di espressione.
                            </p>
                            <p>
                                La nostra filosofia è semplice: <em>"Il dettaglio fa il design"</em>.
                                Dalla consulenza d'immagine alla scelta delle lenti più avanzate, curiamo ogni aspetto del tuo benessere visivo.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default About;
