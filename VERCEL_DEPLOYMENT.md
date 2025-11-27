# 🚀 Déploiement sur Vercel

Guide complet pour déployer votre application TimeOne Staffy sur Vercel.

## Prérequis

- ✅ Votre code est sur GitHub (déjà fait !)
- ✅ Un compte Vercel (gratuit)

## Étapes de déploiement

### 1. Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **Sign Up**
3. Choisissez **Continue with GitHub**
4. Autorisez Vercel à accéder à vos dépôts GitHub

### 2. Importer votre projet

1. Une fois connecté, cliquez sur **Add New Project**
2. Cherchez votre dépôt `TiimeOne1` dans la liste
3. Cliquez sur **Import**

### 3. Configurer le projet

Vercel détectera automatiquement que c'est un projet Vite. Vérifiez que :

- **Framework Preset** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

> ⚠️ **Important** : Ne modifiez pas ces paramètres, ils sont corrects par défaut.

### 4. Configurer les variables d'environnement

> ⚠️ **CRITIQUE** : Vous devez configurer vos clés Supabase en tant que variables d'environnement pour la sécurité.

1. Dans la section **Environment Variables**, ajoutez :

```
VITE_SUPABASE_URL = votre_url_supabase
VITE_SUPABASE_ANON_KEY = votre_cle_anon
```

2. Remplacez les valeurs par celles de votre projet Supabase

### 5. Modifier votre code pour utiliser les variables d'environnement

Avant de déployer, vous devez modifier `src/config.js` :

**Remplacez** :
```javascript
export const config = {
  supabase: {
    url: 'https://votre-url.supabase.co',
    anonKey: 'votre-cle-anon'
  },
  // ...
};
```

**Par** :
```javascript
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://votre-url.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'votre-cle-anon'
  },
  // ...
};
```

> 💡 Les valeurs par défaut permettent de continuer à travailler en local.

### 6. Déployer

1. Cliquez sur **Deploy**
2. Attendez quelques minutes (Vercel va construire votre application)
3. Une fois terminé, vous verrez un message de succès avec votre URL !

### 7. Configurer Supabase pour autoriser votre domaine Vercel

1. Allez dans votre projet Supabase
2. **Settings** > **API** > **URL Configuration**
3. Ajoutez votre URL Vercel (ex: `https://tiime-one1.vercel.app`) dans **Site URL**
4. Dans **Redirect URLs**, ajoutez également votre URL Vercel

## 🎉 C'est terminé !

Votre application est maintenant en ligne ! Vous pouvez y accéder via l'URL fournie par Vercel.

## Mises à jour automatiques

Chaque fois que vous faites un `git push` sur GitHub, Vercel redéploiera automatiquement votre application ! 🚀

## Commandes utiles

```bash
# Pousser vos modifications
git add .
git commit -m "Description de vos changements"
git push

# Vercel redéploiera automatiquement
```

## Dépannage

### Erreur de build
- Vérifiez que `npm run build` fonctionne en local
- Vérifiez les logs de build dans Vercel

### Erreur Supabase
- Vérifiez que les variables d'environnement sont bien configurées
- Vérifiez que l'URL Vercel est autorisée dans Supabase

### Page blanche
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que les variables d'environnement sont correctes
