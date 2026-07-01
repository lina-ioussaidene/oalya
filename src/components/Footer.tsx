import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-anthracite text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-2xl mb-6">Oalya Botanics</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Cosmétique bio et Clean Beauty. Des formulations pures et efficaces, 
              fièrement imaginées en Algérie pour sublimer votre beauté naturelle.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase mb-6 text-white/80">Navigation</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><a href="#shop" className="hover:text-sage transition-colors">Boutique</a></li>
              <li><a href="#story" className="hover:text-sage transition-colors">Notre Histoire</a></li>
              <li><a href="#contact" className="hover:text-sage transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase mb-6 text-white/80">Légal</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><a href="#" className="hover:text-sage transition-colors">Mentions Légales</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">CGV</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Livraison & Retours</a></li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 font-light">
            © {new Date().getFullYear()} Oalya Botanics. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-white/40">
            <a href="#" className="hover:text-sage transition-colors">Instagram</a>
            <a href="#" className="hover:text-sage transition-colors">Facebook</a>
            <a href="#" className="hover:text-sage transition-colors">TikTok</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
