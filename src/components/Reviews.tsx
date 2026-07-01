import React from 'react';
import { reviews } from '../data';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Reviews() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-anthracite mb-4">Mots de nos Clientes</h2>
          <div className="w-16 h-px bg-sage mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white p-8 border border-anthracite/5 shadow-sm"
            >
              <div className="flex space-x-1 mb-6 text-sage">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-anthracite/80 font-light italic mb-8 min-h-[80px]">
                "{review.text}"
              </p>
              <div className="text-sm font-medium tracking-widest text-anthracite uppercase">
                — {review.author}
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
