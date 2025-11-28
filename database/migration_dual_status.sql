-- Migration pour séparer les statuts projet et scraper
-- À EXÉCUTER DANS L'ÉDITEUR SQL DE SUPABASE

-- 1. Supprimer la colonne 'type' si elle existe (on ne sépare plus les données)
ALTER TABLE naf_codes DROP COLUMN IF EXISTS type;

-- 2. Sauvegarder les statuts existants dans une colonne temporaire
ALTER TABLE naf_codes ADD COLUMN IF NOT EXISTS status_temp TEXT;
UPDATE naf_codes SET status_temp = status WHERE status IS NOT NULL;

-- 3. Supprimer l'ancienne colonne status
ALTER TABLE naf_codes DROP COLUMN IF EXISTS status;

-- 4. Créer les deux nouvelles colonnes de statut
ALTER TABLE naf_codes 
ADD COLUMN IF NOT EXISTS status_project TEXT DEFAULT 'non injecté';

ALTER TABLE naf_codes 
ADD COLUMN IF NOT EXISTS status_scraper TEXT DEFAULT 'scrapé';

-- 5. Restaurer les statuts existants dans status_project
UPDATE naf_codes SET status_project = status_temp WHERE status_temp IS NOT NULL;

-- 6. Nettoyer la colonne temporaire
ALTER TABLE naf_codes DROP COLUMN IF EXISTS status_temp;

-- 7. Nettoyer l'index sur 'type' s'il existe
DROP INDEX IF EXISTS idx_naf_codes_type;

-- Résultat : Chaque code NAF a maintenant deux statuts indépendants
-- Les données sont partagées entre les deux tableaux
