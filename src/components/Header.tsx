import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Trash2, Plus, Minus } from 'lucide-react';
import { products } from '../data'; 
import { useCart } from '../context/CartContext';
import CheckoutForm from './CheckoutForm';

// MODIFICATION ICI : Le composant s'appelle bien Header
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, incrementQuantity, decrementQuantity, cartTotal, cartCount } = useCart();

  const navLinks = [
    { name: "Boutique", href: "#shop" },
    { name: "Routines", href: "#routines" },
    { name: "Notre Histoire", href: "#story" },
  ];

  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    const foundProduct = products.find(p => 
      p.name.toLowerCase().includes(query) || 
      p.englishName.toLowerCase().includes(query)
    );

    if (foundProduct) {
      const element = document.getElementById(`product-${foundProduct.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsSearchOpen(false);
      setSearchQuery('');
    } else {
      alert("Oups ! Produit non trouvé. Découvrez toute notre collection ci-dessous.");
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed w-full z-50 bg-cream/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex-shrink-0 font-serif text-2xl text-anthracite tracking-wider">
              OALYA
            </div>

            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-xs font-medium uppercase tracking-widest text-anthracite hover:text-sage transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-5">
              
              <div className="flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "150px", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSearch}
                      className="mr-2"
                    >
                      <input 
                        ref={inputRef}
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full bg-transparent border-b border-anthracite outline-none text-xs text-anthracite placeholder-anthracite/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => !searchQuery && setIsSearchOpen(false)}
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <Search 
                  size={20} 
                  className="text-anthracite cursor-pointer hover:text-sage" 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                />
              </div>

              
              
              <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={20} className="text-anthracite hover:text-sage" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sage text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              
              <button className="md:hidden text-anthracite" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-medium uppercase tracking-widest text-anthracite hover:text-sage"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MODAL / DRAWER DU PANIER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-anthracite/20 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-serif text-2xl text-anthracite">Votre Panier</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-anthracite hover:text-sage">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <p className="text-center text-anthracite/50 font-light mt-10">Votre panier est vide.</p>
                ) : (
                  cartItems.map((item: any) => (
                    <div key={item.product.id} className="flex gap-4 items-center bg-cream/30 p-3 rounded">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-serif text-lg text-anthracite">{item.product.name}</h4>
                        <p className="text-sm text-anthracite/70">{item.product.price} {item.product.currency}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => decrementQuantity(item.product.id)}
                            className="w-6 h-6 flex items-center justify-center border border-anthracite/30 text-anthracite hover:bg-anthracite hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-serif text-sm text-anthracite">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => incrementQuantity(item.product.id)}
                            className="w-6 h-6 flex items-center justify-center border border-anthracite/30 text-anthracite hover:bg-anthracite hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-anthracite/50 hover:text-red-500 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-cream/20">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-light text-anthracite uppercase tracking-widest text-sm">Total</span>
                    <span className="font-serif text-2xl text-anthracite">{cartTotal.toLocaleString()} {cartItems[0]?.product.currency || 'DZD'}</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-sage hover:bg-sage-dark text-white py-4 text-xs font-medium tracking-[0.2em] uppercase transition-colors"
                  >
                    Commander
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutForm isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
}