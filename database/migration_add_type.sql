-- Migration pour ajouter la colonne 'type' et séparer les données
-- À EXÉCUTER DANS L'ÉDITEUR SQL DE SUPABASE

-- 1. Ajouter la colonne 'type' à la table naf_codes
ALTER TABLE naf_codes 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'project';

-- 2. Mettre à jour les index
CREATE INDEX IF NOT EXISTS idx_naf_codes_type ON naf_codes(type);

-- 3. (Optionnel) Si vous voulez nettoyer les données existantes pour repartir à zéro :
-- TRUNCATE TABLE naf_codes;
