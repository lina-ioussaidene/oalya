-- Configuration des politiques RLS pour Supabase
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Désactiver RLS temporairement pour la table products (optionnel - pour le développement)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Politique pour permettre l'insertion de produits (pour l'admin)
CREATE POLICY "Allow insert products for authenticated users"
ON products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Politique pour permettre la mise à jour de produits (pour l'admin)
CREATE POLICY "Allow update products for authenticated users"
ON products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Politique pour permettre la suppression de produits (pour l'admin)
CREATE POLICY "Allow delete products for authenticated users"
ON products
FOR DELETE
TO authenticated
USING (true);

-- 5. Politique pour permettre la lecture de produits (pour tout le monde)
CREATE POLICY "Allow select products for everyone"
ON products
FOR SELECT
TO public
USING (true);

-- 6. Configuration pour la table orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 7. Politique pour permettre l'insertion de commandes (pour les clients)
CREATE POLICY "Allow insert orders for authenticated users"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 8. Politique pour permettre la lecture de commandes (pour l'admin)
CREATE POLICY "Allow select orders for authenticated users"
ON orders
FOR SELECT
TO authenticated
USING (true);

-- 9. Politique pour permettre la mise à jour de commandes (pour l'admin)
CREATE POLICY "Allow update orders for authenticated users"
ON orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 10. Configuration pour le storage bucket product-images
-- Assurez-vous que le bucket 'product-images' existe et est public

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 11. Politique pour permettre l'upload d'images
CREATE POLICY "Allow upload images for authenticated users"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 12. Politique pour permettre la lecture des images (public)
CREATE POLICY "Allow public read images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 13. Politique pour permettre la suppression d'images
CREATE POLICY "Allow delete images for authenticated users"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
