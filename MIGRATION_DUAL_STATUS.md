# 🔄 Migration : Statuts Indépendants pour Projet et Scraper

## ✅ Ce qui a été fait

Votre application a été modifiée pour supporter **deux statuts indépendants** :
- **`status_project`** : Statut dans le tableau "Gestion des codes NAF"
- **`status_scraper`** : Statut dans le tableau "Leads scrapés"

Les **mêmes codes NAF** apparaissent maintenant dans les deux tableaux, mais chaque tableau gère son propre statut.

---

## 🚨 IMPORTANT : Migration SQL à exécuter

Avant de déployer, vous **DEVEZ** exécuter cette migration dans Supabase :

### Étapes :

1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Cliquez sur **SQL Editor** (menu de gauche)
4. Copiez-collez le code ci-dessous :

```sql
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
```

5. Cliquez sur **Run** ▶️

---

## 📤 Déploiement

Une fois la migration SQL exécutée, déployez le code :

```bash
git add .
git commit -m "Feature: Statuts indépendants pour projet et scraper"
git push
```

Vercel redéploiera automatiquement votre application ! 🚀

---

## 🎯 Résultat

Après la migration :
- ✅ Les codes NAF sont **partagés** entre les deux tableaux
- ✅ Chaque tableau a son **propre statut indépendant**
- ✅ Modifier le statut dans un tableau **ne change PAS** le statut dans l'autre

Parfait pour votre workflow ! 🎉
