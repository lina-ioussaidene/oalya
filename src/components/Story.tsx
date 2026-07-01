import React from 'react';
import { motion } from 'framer-motion';

export default function Story() {
  return (
    <section id="story" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Story Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full max-w-lg lg:max-w-none mx-auto"
          >
            {/* Le conteneur parent qui définit la taille */}
            <div className="relative">
              <img 
                src="/images/plantesbotaniques.png" 
                alt="Plantes botaniques et ingrédients naturels" 
                className="w-full h-auto object-cover"
              />
              
              {/* Decorative Frame : positionné exactement sur l'image */}
              <div className="absolute inset-0 border border-sage/30 hidden lg:block pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Story Text */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 lg:pl-10 text-center lg:text-left"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-anthracite mb-6">
              L'Alliance de la <span className="italic">Pureté Botanique</span> et de la Science
            </h2>
            <div className="w-12 h-px bg-sage mx-auto lg:mx-0 mb-8"></div>
            
            <div className="space-y-6 text-base font-light text-anthracite/80 leading-relaxed">
              <p>
                Oalya Botanics est née d'une conviction profonde : la nature possède tout ce dont 
                notre peau a besoin pour s'épanouir. Face à une industrie souvent saturée de composants 
                chimiques superflus, nous avons fait le choix du retour à l'essentiel.
              </p>
              <p>
                Notre mission ? Réinventer la Clean Beauty en Algérie. Nous formulons nos soins localement, 
                en sélectionnant rigoureusement les actifs botaniques les plus purs et les plus efficaces. 
                Chaque ingrédient a une utilité précise, sans aucun compromis sur la sensorialité ni sur 
                le respect de l'équilibre naturel de votre peau.
              </p>
              <p>
                Moins, mais mieux. C'est notre promesse pour une beauté authentique et éclatante.
              </p>
            </div>
            
            <div className="mt-10">
              <button className="text-xs font-medium tracking-[0.2em] text-anthracite uppercase border-b border-anthracite pb-1 hover:text-sage hover:border-sage transition-colors">
                En savoir plus sur notre laboratoire
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}