/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import Routine from './components/Routine';
import Features from './components/Features';
import Story from './components/Story';
import Reviews from './components/Reviews';
import Faq from './components/Faq';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

// Import de ton futur Dashboard (à adapter selon l'endroit où tu l'as créé)
import AdminDashboard from './components/AdminDashboard'; 

// 1. On regroupe tout ton site public dans un seul composant
function PublicStore() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <ProductCatalog />
        <Routine />
        <Story />
        <Reviews />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

// 2. L'application principale qui gère les routes (les liens)
export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* La route principale pour tes clients */}
          <Route path="/" element={<PublicStore />} />
          
          {/* La route secrète pour toi. 
            Modifie "gestion-oalya-2026" par ce que tu veux pour brouiller les pistes ! 
          */}
          <Route path="/gestion-oalya-2026" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}