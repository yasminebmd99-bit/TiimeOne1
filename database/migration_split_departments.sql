-- Migration pour séparer les départements projet et scraper
-- À EXÉCUTER DANS L'ÉDITEUR SQL DE SUPABASE

-- 1. Sauvegarder les départements existants (conversion text[] vers jsonb)
ALTER TABLE naf_codes ADD COLUMN IF NOT EXISTS departments_temp jsonb;
UPDATE naf_codes SET departments_temp = to_jsonb(departments) WHERE departments IS NOT NULL;

-- 2. Supprimer l'ancienne colonne departments
ALTER TABLE naf_codes DROP COLUMN IF EXISTS departments;

-- 3. Créer deux nouvelles colonnes de départements
ALTER TABLE naf_codes 
ADD COLUMN IF NOT EXISTS departments_project jsonb DEFAULT '[]'::jsonb;

ALTER TABLE naf_codes 
ADD COLUMN IF NOT EXISTS departments_scraper jsonb DEFAULT '[]'::jsonb;

-- 4. Restaurer les départements existants dans departments_project
UPDATE naf_codes SET departments_project = departments_temp WHERE departments_temp IS NOT NULL;

-- 5. Nettoyer la colonne temporaire
ALTER TABLE naf_codes DROP COLUMN IF EXISTS departments_temp;

-- Résultat : Chaque code NAF a maintenant deux listes de départements indépendantes
