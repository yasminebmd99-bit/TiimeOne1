# 🚀 Guide Complet : Configuration Supabase pour TimeOne Staffy

## 📋 Étape 1 : Créer un Compte et un Projet Supabase

### 1.1 Créer un compte
1. Allez sur **https://supabase.com**
2. Cliquez sur **"Start your project"** ou **"Sign In"**
3. Connectez-vous avec :
   - GitHub (recommandé)
   - Google
   - Email

### 1.2 Créer un nouveau projet
1. Une fois connecté, cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `timeone-staffy` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe **FORT** et **NOTEZ-LE** quelque part
   - **Region** : Choisissez **"Europe West (Paris)"** ou la région la plus proche
   - **Pricing Plan** : Sélectionnez **"Free"** (gratuit)
3. Cliquez sur **"Create new project"**
4. ⏳ **Attendez 2-3 minutes** que le projet soit créé (une barre de progression s'affiche)

---

## 📊 Étape 2 : Exécuter le Schéma SQL

### 2.1 Accéder à l'éditeur SQL
1. Dans votre projet Supabase, regardez le menu de gauche
2. Cliquez sur **"SQL Editor"** (icône avec `</>`)
3. Cliquez sur **"New query"** en haut à droite

### 2.2 Copier et exécuter le schéma
1. Ouvrez le fichier `database/schema.sql` dans votre projet
2. **Copiez TOUT le contenu** du fichier (Ctrl+A puis Ctrl+C)
3. **Collez** le contenu dans l'éditeur SQL de Supabase
4. Cliquez sur le bouton **"Run"** (ou appuyez sur Ctrl+Enter)
5. ✅ Vous devriez voir un message **"Success. No rows returned"**

### 2.3 Vérifier que les tables sont créées
1. Dans le menu de gauche, cliquez sur **"Table Editor"**
2. Vous devriez voir **2 tables** :
   - ✅ `projects` (avec 10 lignes)
   - ✅ `naf_codes` (vide pour l'instant)
3. Cliquez sur `projects` pour voir les 10 projets pré-insérés

---

## 🔑 Étape 3 : Récupérer vos Identifiants API

### 3.1 Accéder aux paramètres API
1. Dans le menu de gauche, cliquez sur **"Settings"** (icône engrenage en bas)
2. Cliquez sur **"API"** dans le sous-menu

### 3.2 Copier vos identifiants
Vous verrez deux informations importantes :

#### **Project URL**
- Section : "Project URL"
- Format : `https://xxxxxxxxxxxxx.supabase.co`
- 📋 **Copiez cette URL complète**

#### **anon public**
- Section : "Project API keys"
- Cherchez la clé nommée **"anon" "public"**
- C'est une **longue chaîne de caractères** (environ 200 caractères)
- 📋 **Copiez cette clé complète**

> ⚠️ **Important** : Ne partagez JAMAIS votre clé `service_role` publiquement !

---

## ⚙️ Étape 4 : Configurer l'Application

### 4.1 Ouvrir le fichier de configuration
1. Dans votre projet, ouvrez le fichier : `src/config.js`
2. Vous verrez ce code :

```javascript
export const config = {
  supabase: {
    url: 'VOTRE_URL_SUPABASE',
    anonKey: 'VOTRE_CLE_ANON_SUPABASE'
  },
  // ...
};
```

### 4.2 Remplacer les valeurs
Remplacez les valeurs par vos identifiants :

```javascript
export const config = {
  supabase: {
    url: 'https://xxxxxxxxxxxxx.supabase.co',  // ← Collez votre Project URL ici
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // ← Collez votre anon key ici
  },
  // ...
};
```

### 4.3 Sauvegarder le fichier
- Appuyez sur **Ctrl+S** pour sauvegarder
- Le serveur Vite va automatiquement recharger l'application

---

## ✅ Étape 5 : Vérifier que Tout Fonctionne

### 5.1 Vérifier la console
1. Ouvrez votre navigateur sur **http://localhost:3000**
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **"Console"**
4. ✅ Vous ne devriez **PAS** voir le message : `⚠️ Supabase non configuré`
5. ❌ Si vous voyez encore ce message, vérifiez que vous avez bien sauvegardé `src/config.js`

### 5.2 Tester l'ajout d'un code NAF
1. Sur la page d'accueil, cliquez sur n'importe quel projet (ex: **6xpos**)
2. Cliquez sur le bouton **"Ajouter un code NAF"**
3. Remplissez le formulaire :
   - **Code NAF** : `62.01Z`
   - **Requête** : `Test de connexion Supabase`
   - **Départements** : Sélectionnez quelques départements
4. Cliquez sur **"Ajouter"**
5. ✅ Le code NAF devrait apparaître dans le tableau

### 5.3 Vérifier dans Supabase
1. Retournez sur Supabase
2. Allez dans **"Table Editor"**
3. Cliquez sur la table **`naf_codes`**
4. ✅ Vous devriez voir votre code NAF ajouté avec toutes les informations

---

## 🎉 Félicitations !

Votre application est maintenant connectée à Supabase ! Toutes les données seront sauvegardées et synchronisées automatiquement.

### Ce que vous pouvez faire maintenant :
- ✅ Ajouter des codes NAF pour chaque projet
- ✅ Modifier les statuts en cliquant dessus
- ✅ Supprimer des codes NAF
- ✅ Les données persistent même après rafraîchissement de la page
- ✅ Accéder aux données depuis n'importe quel appareil

---

## 🔧 Dépannage

### ❌ Erreur : "Supabase non configuré"
**Solution** : Vérifiez que vous avez bien remplacé les valeurs dans `src/config.js` et sauvegardé le fichier.

### ❌ Erreur lors de l'ajout de données
**Solutions** :
1. Vérifiez que le schéma SQL a bien été exécuté (vérifiez dans Table Editor)
2. Vérifiez que votre **anon key** est correcte (pas la service_role key)
3. Vérifiez que les politiques RLS sont bien créées

### ❌ Les données ne s'affichent pas
**Solutions** :
1. Ouvrez la console du navigateur (F12) pour voir les erreurs
2. Vérifiez que l'URL Supabase est correcte (doit commencer par `https://`)
3. Vérifiez que la clé API n'a pas d'espaces avant ou après

### 🆘 Besoin d'aide ?
- Documentation Supabase : https://supabase.com/docs
- Vérifiez les logs dans la console du navigateur (F12)
- Vérifiez les logs dans Supabase : Menu "Logs" → "Postgres Logs"

---

## 📝 Informations Supplémentaires

### Structure de la base de données

**Table `projects`** :
- `id` : Identifiant unique du projet (texte)
- `name` : Nom du projet
- `created_at` : Date de création

**Table `naf_codes`** :
- `id` : Identifiant unique (UUID généré automatiquement)
- `project_id` : Référence au projet
- `code` : Code NAF (ex: 62.01Z)
- `query` : Description de la requête
- `departments` : Tableau des codes de départements sélectionnés
- `status` : Statut (non injecté, injecté, en cours, terminé)
- `created_at` : Date de création
- `updated_at` : Date de dernière modification (mise à jour automatique)

### Sécurité
- Les politiques RLS sont configurées pour permettre toutes les opérations
- Pour un environnement de production, vous devriez ajouter une authentification
- Ne partagez jamais votre `service_role` key publiquement

---

**🎯 Votre application est maintenant prête à être utilisée avec Supabase !**
