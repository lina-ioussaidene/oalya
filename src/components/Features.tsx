import React from 'react';
import { features } from '../data';
import { Leaf, MapPin, Recycle, Heart } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'leaf': <Leaf size={28} strokeWidth={1.5} />,
  'map-pin': <MapPin size={28} strokeWidth={1.5} />,
  'recycle': <Recycle size={28} strokeWidth={1.5} />,
  'heart': <Heart size={28} strokeWidth={1.5} />
};

export default function Features() {
  return (
    <section className="py-20 bg-cream border-t border-b border-anthracite/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-sage mb-6 shadow-sm border border-sage/10">
                {iconMap[feature.iconName]}
              </div>
              <h3 className="font-serif text-xl text-anthracite mb-3">{feature.title}</h3>
              <p className="text-sm font-light text-anthracite/70 leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
