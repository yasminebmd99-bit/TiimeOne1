-- Migration pour séparer les statuts projet et scraper
-- À EXÉCUTER DANS L'ÉDITEUR SQL DE SUPABASE

-- 1. Supprimer la colonne 'type' (on ne sépare plus les données)
ALTER TABLE naf_codes DROP COLUMN IF EXISTS type;

-- 2. Renommer la colonne 'status' en 'status_project'
ALTER TABLE naf_codes RENAME COLUMN status TO status_project;

-- 3. Ajouter la colonne 'status_scraper'
ALTER TABLE naf_codes 
ADD COLUMN IF NOT EXISTS status_scraper TEXT DEFAULT 'scrapé';

-- 4. Mettre à jour les valeurs par défaut
ALTER TABLE naf_codes 
ALTER COLUMN status_project SET DEFAULT 'non injecté';

-- 5. Nettoyer l'index sur 'type' s'il existe
DROP INDEX IF EXISTS idx_naf_codes_type;

-- Résultat : Chaque code NAF aura maintenant deux statuts indépendants
