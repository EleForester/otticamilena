import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Ottica Milena. Tutti i diritti riservati.</p>
        </footer>
    );
};

export default Footer;
