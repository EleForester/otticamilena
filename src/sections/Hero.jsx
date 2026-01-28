import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';
import landingArt from '../assets/landing_art.png';
// import christmasImage from '../assets/christmas_store.jpg';

const Hero = () => {
    // Toggle these variables to switch designs
    const currentHeroImage = landingArt;
    // const currentHeroImage = christmasImage; // Previous design (Holiday Zoom)

    return (
        <section
            id="hero"
            className="hero"
            style={{
                '--hero-bg': `url(${currentHeroImage})`,
                // If using the artistic image, we might want different styling properties if needed,
                // but the CSS handles the 'cover' which should work for both.
            }}
        >
            <div className="hero-content">
                <h1>Benvenuti da Ottica Milena</h1>
                <p>Il tuo sguardo, la nostra passione. Scopri la nostra collezione di occhiali unici.</p>
                <Link to="/occhiali" className="cta-button">Scopri la Collezione</Link>
            </div>
        </section>
    );
};

export default Hero;
