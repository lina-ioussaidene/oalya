import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types'; // On importe l'interface Product
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]); // Typage fort
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // On récupère les données
        const { data, error } = await supabase.from('products').select('*');
        
        if (error) throw error;

        // Transformation pour faire correspondre la base de données (snake_case)
        // avec ton interface Product (camelCase)
        const formattedProducts: Product[] = (data || []).map((item) => ({
          id: item.id.toString(), // Supabase renvoie souvent des ID type int, on le met en string
          name: item.name,
          englishName: item.english_name,
          price: Number(item.price), // Force le format nombre
          currency: item.currency || 'DZD',
          ingredients: item.ingredients,
          benefits: item.benefits,
          imageUrl: item.image_url,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Erreur Supabase:', error);
        alert('Impossible de charger les produits. Vérifie ta console.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // ... (Garde tes fonctions handleQuantityChange et handleAddToCart intactes)
  
  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const newQuantity = Math.max(1, current + delta);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="animate-spin text-sage w-10 h-10" />
      </div>
    );
  }

  return (
    <section id="shop" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-anthracite mb-4">Notre Collection</h2>
          <div className="w-16 h-px bg-sage mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              className="flex flex-col h-full bg-white border border-gray-100 p-4"
            >
              <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-cream">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-grow text-center px-4">
                <h3 className="font-serif text-2xl text-anthracite mb-1">{product.name}</h3>
                <p className="text-xs text-sage font-medium tracking-[0.15em] uppercase mb-4">
                  {product.englishName}
                </p>
                <div className="text-lg text-anthracite mb-6">{product.price} {product.currency}</div>
                
                <div className="space-y-4 text-sm font-light text-anthracite/70 text-left bg-cream/50 p-6 mb-6">
                  <div>
                    <strong className="text-anthracite font-medium text-xs tracking-widest uppercase block mb-1">Composants clés</strong>
                    <span>{product.ingredients}</span>
                  </div>
                  <div>
                    <strong className="text-anthracite font-medium text-xs tracking-widest uppercase block mb-1">Bienfaits</strong>
                    <span>{product.benefits}</span>
                  </div>
                </div>

                {/* Boutons ... (ton code original) */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleQuantityChange(product.id, -1)} className="w-10 h-10 flex items-center justify-center border border-anthracite text-anthracite hover:bg-anthracite hover:text-white transition-colors">
                        <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-serif text-lg text-anthracite">{quantities[product.id] || 1}</span>
                        <button onClick={() => handleQuantityChange(product.id, 1)} className="w-10 h-10 flex items-center justify-center border border-anthracite text-anthracite hover:bg-anthracite hover:text-white transition-colors">
                        <Plus size={16} />
                        </button>
                    </div>
                    <button onClick={() => handleAddToCart(product)} className="w-full flex items-center justify-center gap-2 bg-anthracite text-white py-3 px-4 text-xs font-medium tracking-widest uppercase hover:bg-sage transition-colors">
                        <ShoppingBag size={16} /> Ajouter au panier
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}