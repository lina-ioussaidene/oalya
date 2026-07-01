import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sparkles, Sun, Moon } from 'lucide-react';

const steps = [
  {
    icon: <Droplets className="w-8 h-8 text-sage" />,
    title: "Nettoyer",
    description: "Appliquez le Gel Nettoyant sur peau humide pour éliminer les impuretés en douceur."
  },
  {
    icon: <Sparkles className="w-8 h-8 text-sage" />,
    title: "Traiter",
    description: "Appliquez quelques gouttes du Sérum Éclat par pressions légères sur le visage."
  },
  {
    icon: <Sun className="w-8 h-8 text-sage" />,
    title: "Hydrater",
    description: "Terminez avec la Crème Hydratante pour sceller l'hydratation et protéger votre barrière cutanée."
  }
];

export default function Routine() {
  return (
    <section id="routines" className="py-24 bg-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-anthracite mb-4">Votre Rituel</h2>
          <div className="w-16 h-px bg-sage mx-auto mb-6"></div>
          <p className="text-anthracite/60 font-light max-w-xl mx-auto">
            Pour des résultats optimaux, suivez ces trois étapes simples chaque matin et soir.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-6 p-4 bg-cream rounded-full">
                {step.icon}
              </div>
              <h3 className="font-serif text-xl text-anthracite mb-3">{step.title}</h3>
              <p className="text-sm text-anthracite/70 font-light leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-anthracite/50 italic">
            "Une peau saine est le reflet d'un esprit serein."
          </p>
        </div>
      </div>
    </section>
  );
}