import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
    return (
        <div className="page-container">
            <h1>Contattaci</h1>
            <div className="contact-container">
                <div className="contact-info">
                    <h2>Ottica Milena</h2>
                    <p>Siamo a tua disposizione per qualsiasi informazione.</p>
                    <ul>
                        <li><strong>Indirizzo:</strong> Via S. Angelo, 58, 73038 Spongano LE, Italia</li>
                        <li><strong>Telefono:</strong> +39 375 504 0124</li>
                        <li><strong>Email:</strong> ottica.milena@gmail.com</li>
                        <li><strong>Orari:</strong> Lun-Sab 9:00 - 19:30</li>
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

            <div className="map-container">
                <iframe
                    title="Map"
                    src="https://maps.google.com/maps?q=Via%20S.%20Angelo%2C%2058%2C%2073038%20Spongano%20LE%2C%20Italia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy">
                </iframe>
            </div>
        </div>
    );
};

export default Contact;
