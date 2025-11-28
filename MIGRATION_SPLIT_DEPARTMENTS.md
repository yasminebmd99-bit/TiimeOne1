# 🔄 Migration : Départements Séparés pour Projet et Scraper

## ✅ Ce qui a été fait

Votre application a été modifiée pour supporter **deux listes de départements indépendantes** :
- **`departments_project`** : Départements pour le tableau "Gestion des codes NAF"
- **`departments_scraper`** : Départements pour le tableau "Leads scrapés"

Les **mêmes codes NAF et requêtes** apparaissent dans les deux tableaux, mais :
- ✅ Chaque tableau gère ses **propres départements**
- ✅ Chaque tableau gère son **propre statut**

---

## 🚨 IMPORTANT : Migration SQL à exécuter

Avant de déployer, vous **DEVEZ** exécuter cette migration dans Supabase :

### Étapes :

1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Cliquez sur **SQL Editor** (menu de gauche)
4. Copiez-collez le code ci-dessous :

```sql
-- Migration pour séparer les départements projet et scraper
-- À EXÉCUTER DANS L'ÉDITEUR SQL DE SUPABASE

-- 1. Sauvegarder les départements existants
ALTER TABLE naf_codes ADD COLUMN IF NOT EXISTS departments_temp jsonb;
UPDATE naf_codes SET departments_temp = departments WHERE departments IS NOT NULL;

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
```

5. Cliquez sur **Run** ▶️

---

## 📤 Déploiement

Une fois la migration SQL exécutée, déployez le code :

```bash
git add .
git commit -m "Feature: Départements indépendants pour projet et scraper"
git push
```

Vercel redéploiera automatiquement votre application ! 🚀

---

## 🎯 Résultat

Après la migration :
- ✅ Les codes NAF et requêtes sont **partagés** entre les deux tableaux
- ✅ Chaque tableau a ses **propres départements indépendants**
- ✅ Chaque tableau a son **propre statut indépendant**
- ✅ Modifier les départements dans un tableau **ne change PAS** les départements dans l'autre

Parfait pour votre workflow ! 🎉
