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
                <div className="contact-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <h3>Preferisci chattare?</h3>
                    <p style={{ marginBottom: '1.5rem' }}>Contattaci direttamente su WhatsApp per una risposta rapida.</p>
                    
                    <a 
                        href="https://wa.me/393755040124" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="whatsapp-button"
                        style={{
                            backgroundColor: '#25D366',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382C17.112 14.382 16.968 14.332 16.036 13.844C15.104 13.356 14.744 13.332 14.744 13.932C14.744 14.532 14.96 14.94 15.08 15.132C15.2 15.324 15.104 15.54 15.104 15.54C15.104 15.54 14.96 15.684 14.888 15.708C14.48 15.828 12.92 16.356 11.216 14.652C9.512 12.948 10.04 11.388 10.136 10.98C10.16 10.908 10.304 10.764 10.304 10.764C10.304 10.764 10.52 10.668 10.712 10.788C10.904 10.908 11.312 11.124 11.912 11.124C12.512 11.124 12.512 10.764 12.008 9.828C11.504 8.892 11.456 8.748 11.456 8.388C11.456 8.028 11.792 7.764 12.056 7.524C12.152 7.428 12.128 7.356 12.104 7.236C12.08 7.116 11.912 6.66 11.552 5.796C11.192 4.932 10.856 4.932 10.568 4.932H9.896C9.608 4.932 9.128 5.052 8.744 5.46C8.36 5.868 7.28 6.876 7.28 8.94C7.28 11.004 8.768 13.02 9.008 13.308C9.248 13.596 11.84 17.844 15.968 19.332C18.848 20.364 19.496 20.004 20.12 19.956C20.744 19.908 22.112 19.164 22.424 18.276C22.736 17.388 22.736 16.62 22.64 16.452C22.544 16.284 22.304 16.188 22.064 16.068C21.824 15.948 20.576 15.324 20.024 15.06C19.472 14.796 19.232 14.724 18.992 15.06C18.752 15.396 18.008 16.284 17.816 16.524C17.624 16.764 17.36 16.716 17.024 16.572C16.832 16.428 16.64 16.236 16.448 15.972L17.472 14.382ZM12.024 2.184C17.448 2.184 21.84 6.576 21.84 12C21.84 13.848 21.36 15.576 20.52 17.088L21.6 21.024L17.808 20.016C16.152 20.976 14.184 21.552 12.024 21.552C6.6 21.552 2.208 17.16 2.208 11.736C2.208 6.312 6.6 1.92 12.024 1.92V2.184Z" />
                        </svg>
                        Scrivici su WhatsApp
                    </a>
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
