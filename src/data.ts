import { Product, Feature, Review, FaqItem } from './types';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Sérum Éclat',
    englishName: 'The Radiant Serum',
    price: 4500,
    currency: 'DZD',
    ingredients: 'Vitamine C pure & Complexe Botanique.',
    benefits: 'Stimule le collagène, illumine le teint et réduit les taches pigmentaires.',
    imageUrl: '/images/serum.png',
  },
  {
    id: 'p2',
    name: 'Crème Hydratante',
    englishName: 'The Hydrating Cream',
    price: 3800,
    currency: 'DZD',
    ingredients: 'Aloe Vera bio & Extraits de Jojoba.',
    benefits: 'Hydrate en profondeur pendant 24h, apaise les rougeurs et protège la barrière cutanée.',
    imageUrl: '/images/creme.png',
  },
  {
    id: 'p3',
    name: 'Gel Nettoyant Équilibrant',
    englishName: 'The Balancing Cleanser',
    price: 3200,
    currency: 'DZD',
    ingredients: 'Hamamélis & Extrait de Menthe Sauvage.',
    benefits: 'Purifie la peau en douceur, régule l\'excès de sébum et resserre les pores sans assécher.',
    imageUrl: '/images/gel.png',
  }
];

export const features: Feature[] = [
  {
    id: 'f1',
    title: '100% Biologique & Vegan',
    description: 'Ingrédients certifiés, sans aucun produit chimique nocif.',
    iconName: 'leaf',
  },
  {
    id: 'f2',
    title: 'Formulé en Algérie',
    description: 'Savoir-faire et plantes locales rigoureusement sélectionnées.',
    iconName: 'map-pin', // Represents local formulation, we will use a relevant icon from lucide
  },
  {
    id: 'f3',
    title: 'Éco-responsable',
    description: 'Flacons en verre ambré recyclables et packagings durables.',
    iconName: 'recycle',
  },
  {
    id: 'f4',
    title: 'Cruelty-Free',
    description: 'Aucun test sur les animaux. Notre engagement éthique.',
    iconName: 'heart',
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Amina M.',
    rating: 5,
    text: 'Le Sérum Éclat a complètement transformé ma texture de peau en 2 semaines ! Je ne peux plus m\'en passer.',
  },
  {
    id: 'r2',
    author: 'Sarah L.',
    rating: 5,
    text: 'Enfin des produits sains, locaux et d\'une qualité incroyable. La crème hydratante est parfaite sous le maquillage.',
  },
  {
    id: 'r3',
    author: 'Kenza B.',
    rating: 5,
    text: 'Le gel nettoyant laisse une sensation de fraîcheur sans tiraillement. Je recommande les yeux fermés Oalya Botanics.',
  }
];

export const faqs: FaqItem[] = [
  {
    id: 'faq1',
    question: 'Les produits conviennent-ils aux peaux sensibles ?',
    answer: 'Oui, toutes nos formulations sont testées dermatologiquement et privilégient des ingrédients apaisants sans parfum de synthèse.',
  },
  {
    id: 'faq2',
    question: 'Où sont fabriqués vos produits ?',
    answer: 'Ils sont fièrement pensés et formulés en Algérie, à partir d\'actifs bio rigoureusement sélectionnés.',
  },
  {
    id: 'faq3',
    question: 'Quels sont vos délais de livraison ?',
    answer: 'Nous livrons partout en Algérie sous 48h à 72h, à domicile ou en point relais Stop-Desk.',
  }
];
