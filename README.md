# 🌿 Oalya Botanics

Plateforme e-commerce et tableau de bord d'administration pour la marque de cosmétiques naturels Oalya Botanics. Ce projet inclut une vitrine pour les clients et un espace de gestion sécurisé pour l'administrateur.

## 🚀 Technologies Utilisées

*   **Frontend :** React.js (Vite)
*   **Styling :** Tailwind CSS
*   **Icônes & Animations :** Lucide React, Framer Motion
*   **Backend & Base de données :** Supabase (PostgreSQL, Authentification, Storage)
*   **Hébergement :** Vercel

## ✨ Fonctionnalités Principales

**Côté Client :**
*   Catalogue de produits avec images et descriptions détaillées (ingrédients, bienfaits).
*   Système de commande fluide (panier et formulaire de livraison).

**Côté Administrateur (Lien secret protégé) :**
*   **Authentification sécurisée :** Accès restreint par email/mot de passe via Supabase Auth.
*   **Gestion des commandes :** Suivi en temps réel des nouvelles commandes, détails clients (wilaya, téléphone) et mise à jour des statuts (En attente, Confirmée, Expédiée, Livrée).
*   **Gestion du catalogue (CRUD) :** Ajout, modification et suppression de produits.
*   **Upload d'images :** Hébergement direct des images produits sur les serveurs sécurisés de Supabase (Bucket `product-images`).

---

## 🛠️ Installation et Configuration en Local

### 1. Prérequis
*   Avoir [Node.js](https://nodejs.org/) installé sur sa machine.
*   Un compte [Supabase](https://supabase.com/) actif avec un projet créé.

### 2. Cloner le projet et installer les dépendances
```bash
# Cloner le dépôt (si hébergé sur GitHub)
git clone <lien-de-ton-repo>

# Accéder au dossier du projet
cd oalya-botanics

# Installer les dépendances
npm install