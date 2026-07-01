import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react'; // Ajout de Loader2 pour un effet visuel de chargement
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase'; // 1. IMPORTATION DE SUPABASE

const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutForm({ isOpen, onClose }: CheckoutFormProps) {
  // Extraction de clearCart (si tu l'as configuré pour vider le panier après achat)
  const { cartItems, cartTotal, clearCart } = useCart(); 
  const [loading, setLoading] = useState(false); // 2. ÉTAT DE CHARGEMENT
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    wilaya: '',
    commune: '',
    adresse: ''
  });

  // 3. LOGIQUE D'ENVOI À SUPABASE (MODIFIÉE EN ASYNC)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    try {
      setLoading(true);

      // Envoi des données dans la table 'orders'
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone,
            email: formData.email || null,
            wilaya: formData.wilaya,
            commune: formData.commune,
            adresse: formData.adresse,
            cart_items: cartItems,
            total_amount: cartTotal,
            status: 'en cours'
          }
        ]);

      if (error) throw error;

      alert('Votre commande a été enregistrée avec succès !');

      // Si tu as une fonction pour vider le panier dans ton CartContext, on l'appelle ici
      if (clearCart) {
        clearCart();
      }

      // Réinitialisation du formulaire
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        wilaya: '',
        commune: '',
        adresse: ''
      });

      onClose();
    } catch (error: any) {
      console.error("Erreur lors de la commande :", error);
      alert(`Erreur lors de l'envoi : ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose} // Bloque la fermeture pendant l'envoi
            className="fixed inset-0 bg-anthracite/40 backdrop-blur-sm z-50"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm">
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-anthracite">Finaliser la commande</h2>
                <button 
                  onClick={onClose} 
                  disabled={loading}
                  className="text-anthracite hover:text-sage transition-colors disabled:opacity-30"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Récapitulatif de la commande */}
                <div className="bg-cream/30 p-4 rounded-sm">
                  <h3 className="font-serif text-lg text-anthracite mb-3">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item: any) => (
                      <div key={item.product.id} className="flex justify-between text-anthracite/70">
                        <span>{item.product.name} x{item.quantity}</span>
                        <span>{(item.product.price * item.quantity).toLocaleString()} DZD</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-anthracite/10 flex justify-between font-medium text-anthracite">
                      <span>Total</span>
                      <span>{cartTotal.toLocaleString()} DZD</span>
                    </div>
                  </div>
                </div>

                {/* Identité */}
                <div>
                  <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-gray-100">Identité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-anthracite/70 mb-2">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        required
                        disabled={loading}
                        value={formData.nom}
                        onChange={handleChange}
                        className="w-full bg-cream/30 border border-gray-200 px-4 py-3 text-anthracite focus:outline-none focus:border-sage transition-colors disabled:opacity-50"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-anthracite/70 mb-2">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        required
                        disabled={loading}
                        value={formData.prenom}
                        onChange={handleChange}
                        className="w-full bg-cream/30 border border-gray-200 px-4 py-3 text-anthracite focus:outline-none focus:border-sage transition-colors disabled:opacity-50"
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-gray-100">Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-anthracite/70 mb-2">
                        Numéro de téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        required
                        disabled={loading}
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full bg-cream/30 border border-gray-200 px-4 py-3 text-anthracite focus:outline-none focus:border-sage transition-colors disabled:opacity-50"
                        placeholder="05XX XX XX XX"
                      />
                      <p className="text-xs text-anthracite/50 mt-1">Indispensable pour le livreur</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-anthracite/70 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        disabled={loading}
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-cream/30 border border-gray-200 px-4 py-3 text-anthracite focus:outline-none focus:border-sage transition-colors disabled:opacity-50"
                        placeholder="votre@email.com"
                      />
                      <p className="text-xs text-anthracite/50 mt-1">Pour la confirmation de commande</p>
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div>
                  <h3 className="font-serif text-lg text-anthracite mb-4 pb-2 border-b border-gray-100">Adresse de livraison</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-anthracite/70 mb-2">Wilaya</label>
                      <select
                        name="wilaya"
                        required
                        disabled={loading}
                        value={formData.wilaya}
                        onChange={handleChange}
                        className="w-full bg-cream/30 border border-gray-200 px-4 py-3 text-anthracite focus:outline-none focus:border-sage transition-colors disabled:opacity-50"
                      >
                        <option value="">Sélectionnez une wilaya</option>
                        {wilayas.map((wilaya) => (
                          <option key={wilaya} value={wilaya}>{wilaya}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-anthracite/70 mb-2">Commune</label>
                      <input
                        type="text"
                        name="commune"
                        required
                        disabled={loading}
                        value={formData.commune}
                        onChange={handleChange}
                        className="w-full bg-cream/30 border border-gray-200 px-4 py-3 text-anthracite focus:outline-none focus:border-sage transition-colors disabled:opacity-50"
                        placeholder="Votre commune"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-anthracite/70 mb-2">Adresse détaillée</label>
                      <textarea
                        name="adresse"
                        required
                        disabled={loading}
                        value={formData.adresse}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-cream/30 border border-gray-200 px-4 py-3 text-anthracite focus:outline-none focus:border-sage transition-colors resize-none disabled:opacity-50"
                        placeholder="Rue, numéro de maison, point de repère..."
                      />
                      <p className="text-xs text-anthracite/50 mt-1">Important pour aider le livreur</p>
                    </div>
                  </div>
                </div>

                {/* Bouton d'envoi dynamique avec état de chargement */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sage hover:bg-sage-dark text-white py-4 text-xs font-medium tracking-[0.2em] uppercase transition-colors flex justify-center items-center gap-2 disabled:bg-sage/50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Traitement en cours...
                      </>
                    ) : (
                      "Envoyer la commande"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}