import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export default function Hero() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;

        const formattedProducts: Product[] = (data || []).map((item) => ({
          id: item.id.toString(),
          name: item.name,
          englishName: item.english_name,
          price: Number(item.price),
          currency: item.currency || 'DZD',
          ingredients: item.ingredients,
          benefits: item.benefits,
          imageUrl: item.image_url,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Erreur chargement produits:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const serum = products.find(p => p.name.includes('Sérum'));
  const creme = products.find(p => p.name.includes('Crème'));

  return (
    <section className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Changement ici : flex-col-reverse pour mobile, lg:flex-row pour desktop */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content - Left Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left z-10 pt-10 lg:pt-0"
          >
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-anthracite leading-tight mb-6">
              Élevez <br className="hidden lg:block" />
              <span className="italic font-light">votre rituel</span>
            </h1>
            <p className="text-base sm:text-lg text-anthracite/70 font-light max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
              Découvrez la puissance de la nature. Minimaliste. Puissant. Propre. 
              Des soins botaniques d'exception formulés pour révéler l'éclat naturel de votre peau.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => serum && addToCart(serum)}
                className="w-full sm:w-auto px-8 py-4 bg-sage hover:bg-sage-dark text-white text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300"
              >
                Acheter le Sérum Éclat
              </button>
              <button 
                onClick={() => creme && addToCart(creme)}
                className="w-full sm:w-auto px-8 py-4 border border-anthracite text-anthracite hover:bg-anthracite hover:text-white text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300"
              >
                Acheter la Crème
              </button>
            </div>
          </motion.div>

          {/* Image - Right Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex-1 relative w-full max-w-md lg:max-w-none mx-auto"
          >
            <div className="aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-tl-full rounded-tr-full bg-white relative shadow-2xl shadow-sage/10">
              <img 
                src="/images/touslesproduits.png" 
                alt="Produit de beauté Oalya Botanics sur socle en bois" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream/20 to-transparent mix-blend-overlay"></div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-sage/10 rounded-full blur-3xl"></div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}