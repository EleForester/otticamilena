import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
    return (
        <section id="contact" className="contact">
            <div className="contact-container">
                <div className="contact-info">
                    <h2>Contatti</h2>
                    <p>Vieni a trovarci o scrivici per maggiori informazioni.</p>
                    <ul>
                        <li><strong>Indirizzo:</strong> Via Roma 123, Milano, Italia</li>
                        <li><strong>Telefono:</strong> +39 02 12345678</li>
                        <li><strong>Email:</strong> info@otticamilena.it</li>
                    </ul>
                </div>
                <div className="contact-form">
                    <form>
                        <input type="text" placeholder="Nome" required />
                        <input type="email" placeholder="Email" required />
                        <textarea placeholder="Messaggio" rows="5" required></textarea>
                        <button type="submit">Invia Messaggio</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
