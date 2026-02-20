import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { totals } = useCart();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/">Ottica Milena</Link>
                </div>
                <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                        <li><Link to="/chi-siamo" onClick={toggleMenu}>Chi Siamo</Link></li>
                        <li><Link to="/occhiali" onClick={toggleMenu}>Occhiali</Link></li>
                        <li><Link to="/servizi" onClick={toggleMenu}>Servizi</Link></li>
                        <li><Link to="/contatti" onClick={toggleMenu}>Contatti</Link></li>
                        <li>
                            <Link to="/carrello" onClick={toggleMenu} className="cart-link">
                                Carrello ({totals.count})
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={`navbar-toggle ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
