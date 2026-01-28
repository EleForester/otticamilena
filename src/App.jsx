import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Contact from './pages/Contact';

import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chi-siamo" element={<About />} />
        <Route path="/occhiali" element={<Shop />} />
        <Route path="/occhiali/:id" element={<ProductDetail />} />
        <Route path="/servizi" element={<Services />} />
        <Route path="/contatti" element={<Contact />} />

        {/* E-commerce (sans paiement en ligne) */}
        <Route path="/carrello" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ordine-successo/:id" element={<OrderSuccess />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
