import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ShoppingBag, TrendingUp, Lock, LogOut, Plus, 
  Edit, Trash2, Eye, X, CheckCircle, Clock, Truck, 
  Image as ImageIcon, Loader2, MapPin, Phone, Mail
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  englishName: string;
  price: number;
  currency: string;
  ingredients: string;
  benefits: string;
  imageUrl: string;
  created_at?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  wilaya: string;
  commune: string;
  adresse: string;
  total_amount: number;
  status: string;
  created_at: string;
  cart_items: any[];
}

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'stats'>('orders');
  const [orderFilter, setOrderFilter] = useState<'pending' | 'processed'>('pending');
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  
  // Modals States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [productForm, setProductForm] = useState({
    name: '', englishName: '', price: '', currency: 'DZD',
    ingredients: '', benefits: '', imageUrl: ''
  });

  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, totalProducts: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadData();
    });
  }, []);

  const loadData = async () => {
    loadOrders();
    loadProducts();
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setOrders(data);
      updateStats(data, products);
    }
    setOrdersLoading(false);
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const formattedProducts: Product[] = data.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        englishName: item.english_name,
        price: Number(item.price),
        currency: item.currency || 'DZD',
        ingredients: item.ingredients,
        benefits: item.benefits,
        imageUrl: item.image_url,
        created_at: item.created_at
      }));
      setProducts(formattedProducts);
      updateStats(orders, formattedProducts);
    }
    setProductsLoading(false);
  };

  const updateStats = (ordersData: Order[], productsData: Product[]) => {
    setStats({
      totalOrders: ordersData.length,
      totalRevenue: ordersData.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      pendingOrders: ordersData.filter(o => o.status === 'en cours').length,
      totalProducts: productsData.length
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Erreur: ' + error.message);
    else if (data.session) {
      setSession(data.session);
      loadData();
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // UPLOAD D'IMAGE FONCTIONNEL
  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    console.log('Uploading file:', fileName, 'to path:', filePath);

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    console.log('Public URL:', data.publicUrl);
    return data.publicUrl;
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = productForm.imageUrl;

      // Si une nouvelle image a été sélectionnée, on l'upload
      if (imageFile) {
        try {
          finalImageUrl = await handleImageUpload(imageFile);
        } catch (uploadError: any) {
          console.error('Upload failed:', uploadError);
          alert('Erreur lors de l\'upload de l\'image: ' + uploadError.message);
          setLoading(false);
          return;
        }
      }

      const productData = {
        name: productForm.name,
        english_name: productForm.englishName,
        price: parseFloat(productForm.price),
        currency: productForm.currency,
        ingredients: productForm.ingredients,
        benefits: productForm.benefits,
        image_url: finalImageUrl || '/images/placeholder.png'
      };

      console.log('Saving product data:', productData);

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }

      setShowProductForm(false);
      setImageFile(null);
      setProductForm({ name: '', englishName: '', price: '', currency: 'DZD', ingredients: '', benefits: '', imageUrl: '' });
      await loadProducts();
      alert(editingProduct ? 'Produit mis à jour' : 'Produit ajouté et visible sur le site !');
    } catch (error: any) {
      console.error('Error saving product:', error);
      if (error.message.includes('row-level security')) {
        alert('Erreur de sécurité RLS: Vous devez configurer les politiques RLS dans Supabase pour permettre l\'insertion dans la table products.');
      } else {
        alert('Erreur lors de la sauvegarde : ' + (error.message || ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await loadProducts();
        alert('Produit supprimé avec succès');
      } catch (error: any) {
        console.error('Error deleting product:', error);
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  // CHANGEMENT DE STATUT IMMEDIAT
  const updateOrderStatus = async (orderId: string, status: string) => {
    // Mise à jour optimiste pour l'interface (immédiat)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) throw error;
      updateStats(orders, products);
    } catch (error: any) {
      alert("Erreur lors de la mise à jour : " + error.message);
      loadOrders(); // Annule en cas d'erreur
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-xl w-full max-w-md space-y-6">
          <div className="flex justify-center mb-6">
            <Lock className="text-sage" size={40} />
          </div>
          <h2 className="text-center font-serif text-2xl">Accès Admin Oalya</h2>
          <input type="email" placeholder="Email" className="w-full border p-3 focus:border-sage outline-none" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className="w-full border p-3 focus:border-sage outline-none" onChange={(e) => setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full bg-anthracite text-white py-3 uppercase tracking-widest text-sm font-medium">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    );
  }

  // Filtrage des commandes pour affichage
  const displayedOrders = orders.filter(o => 
    orderFilter === 'pending' ? o.status === 'en cours' : o.status !== 'en cours'
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="font-serif text-xl text-anthracite">Dashboard Oalya</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation principale */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-3 font-medium transition-colors border-b-2 ${activeTab === 'orders' ? 'border-sage text-sage' : 'border-transparent text-gray-500'}`}>
            Commandes ({orders.length})
          </button>
          <button onClick={() => setActiveTab('products')} className={`px-4 py-3 font-medium transition-colors border-b-2 ${activeTab === 'products' ? 'border-sage text-sage' : 'border-transparent text-gray-500'}`}>
            Produits ({products.length})
          </button>
        </div>

        {/* --- SECTION COMMANDES --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Sous-filtres */}
            <div className="flex gap-2">
              <button onClick={() => setOrderFilter('pending')} className={`px-4 py-2 rounded-full text-sm font-medium ${orderFilter === 'pending' ? 'bg-sage text-white' : 'bg-white text-gray-600 border'}`}>
                Nouvelles en attente ({orders.filter(o => o.status === 'en cours').length})
              </button>
              <button onClick={() => setOrderFilter('processed')} className={`px-4 py-2 rounded-full text-sm font-medium ${orderFilter === 'processed' ? 'bg-anthracite text-white' : 'bg-white text-gray-600 border'}`}>
                Commandes traitées ({orders.filter(o => o.status !== 'en cours').length})
              </button>
            </div>

            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-gray-100 text-gray-600">
                    <tr>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Date</th>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Client</th>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Wilaya</th>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Commune</th>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Adresse</th>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Produit</th>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Total</th>
                      <th className="p-4 font-medium text-sm whitespace-nowrap">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedOrders.length === 0 ? (
                      <tr><td colSpan={8} className="p-8 text-center text-gray-500">Aucune commande dans cette catégorie.</td></tr>
                    ) : (
                      displayedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="p-4 text-sm whitespace-nowrap">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                          <td className="p-4">
                            <p className="font-medium">{order.nom} {order.prenom}</p>
                            <p className="text-xs text-gray-500">{order.telephone}</p>
                            <p className="text-xs text-gray-500">{order.email}</p>
                          </td>
                          <td className="p-4 text-sm whitespace-nowrap">{order.wilaya}</td>
                          <td className="p-4 text-sm whitespace-nowrap">{order.commune}</td>
                          <td className="p-4 text-sm max-w-xs truncate">{order.adresse}</td>
                          <td className="p-4 text-sm max-w-xs">
                            {order.cart_items?.map((item: any, idx: number) => (
                              <div key={idx} className="text-xs">
                                {item.quantity}x {item.product?.name || item.name}
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-medium whitespace-nowrap">{order.total_amount} DZD</td>
                          <td className="p-4 whitespace-nowrap">
                            <select 
                              value={order.status} 
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="bg-gray-50 border border-gray-200 text-sm rounded p-1 outline-none focus:border-sage"
                            >
                              <option value="en cours">En cours</option>
                              <option value="confirmée">Confirmée</option>
                              <option value="expédiée">Expédiée</option>
                              <option value="livrée">Livrée</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION PRODUITS --- */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">Catalogue Oalya</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', englishName: '', price: '', currency: 'DZD', ingredients: '', benefits: '', imageUrl: '' });
                  setImageFile(null);
                  setShowProductForm(true);
                }} 
                className="bg-sage text-white px-4 py-2 flex items-center gap-2 hover:bg-[#6b7b68] transition"
              >
                <Plus size={18} /> Ajouter un produit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 shadow-sm rounded border border-gray-100 flex flex-col">
                  <div className="h-48 bg-gray-50 rounded mb-4 overflow-hidden flex items-center justify-center">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={40} />
                    )}
                  </div>
                  <h3 className="font-serif text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{p.englishName}</p>
                  <p className="font-medium mb-4">{p.price} DZD</p>
                  
                  <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                    <button onClick={() => { 
                      setEditingProduct(p); 
                      setProductForm({ name: p.name, englishName: p.englishName, price: p.price.toString(), currency: p.currency, ingredients: p.ingredients, benefits: p.benefits, imageUrl: p.imageUrl });
                      setImageFile(null);
                      setShowProductForm(true); 
                    }} className="flex-1 border border-anthracite py-2 text-sm text-center hover:bg-anthracite hover:text-white transition">
                      Modifier
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="px-4 border border-red-200 text-red-500 hover:bg-red-50 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODALE : DÉTAILS DE LA COMMANDE --- */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="font-serif text-xl">Commande #{selectedOrder.id.substring(0, 8)}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black"><X size={24} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Infos Client */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Client</h4>
                    <p className="font-medium text-lg">{selectedOrder.nom} {selectedOrder.prenom}</p>
                    <p className="flex items-center gap-2 text-gray-600 mt-2"><Phone size={16}/> {selectedOrder.telephone}</p>
                    <p className="flex items-center gap-2 text-gray-600 mt-1"><Mail size={16}/> {selectedOrder.email}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Livraison</h4>
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin size={18} className="mt-1 flex-shrink-0 text-sage" />
                      <div>
                        <p className="font-medium text-black">{selectedOrder.wilaya} - {selectedOrder.commune}</p>
                        <p>{selectedOrder.adresse}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Produits Commandés */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Produits commandés</h4>
                  <div className="bg-gray-50 border rounded p-4 space-y-3">
                    {selectedOrder.cart_items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-medium">{item.quantity}x {item.product?.name || item.name}</span>
                        <span>{(item.product?.price || item.price) * item.quantity} DZD</span>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold text-lg">
                      <span>Total à payer</span>
                      <span className="text-sage">{selectedOrder.total_amount} DZD</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <button onClick={() => setSelectedOrder(null)} className="bg-anthracite text-white px-6 py-2">Fermer</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALE : FORMULAIRE PRODUIT --- */}
      <AnimatePresence>
        {showProductForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-serif text-xl">{editingProduct ? 'Modifier le produit' : 'Nouveau Produit'}</h3>
                <button onClick={() => setShowProductForm(false)} className="text-gray-500 hover:text-black"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Nom du produit</label>
                    <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full border p-2 outline-none focus:border-sage" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Nom Anglais</label>
                    <input type="text" required value={productForm.englishName} onChange={e => setProductForm({...productForm, englishName: e.target.value})} className="w-full border p-2 outline-none focus:border-sage" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Prix (DZD)</label>
                    <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full border p-2 outline-none focus:border-sage" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-500 mb-1">Upload de l'image</label>
                    <input type="file" accept="image/*" onChange={(e) => { if(e.target.files) setImageFile(e.target.files[0]) }} className="w-full border p-2 text-sm text-gray-600 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sage/10 file:text-sage hover:file:bg-sage/20" />
                    {productForm.imageUrl && !imageFile && <p className="text-xs text-green-600 mt-1">Image existante conservée si non modifiée.</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Ingrédients</label>
                  <textarea required rows={2} value={productForm.ingredients} onChange={e => setProductForm({...productForm, ingredients: e.target.value})} className="w-full border p-2 outline-none focus:border-sage resize-none" />
                </div>
                
                <div>
                  <label className="block text-xs uppercase text-gray-500 mb-1">Bienfaits</label>
                  <textarea required rows={3} value={productForm.benefits} onChange={e => setProductForm({...productForm, benefits: e.target.value})} className="w-full border p-2 outline-none focus:border-sage resize-none" />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-sage text-white py-3 mt-4 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : 'Enregistrer le produit'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}