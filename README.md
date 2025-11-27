# TimeOne Staffy

Application web moderne de suivi des leads et gestion des codes NAF.

## 🚀 Démarrage rapide

### Prérequis
- Node.js (version 16 ou supérieure)
- Un compte Supabase (gratuit)

### Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer Supabase**
   - Suivez les instructions dans `database/setup-instructions.md`
   - Exécutez le schéma SQL dans votre projet Supabase
   - Ajoutez vos identifiants dans `src/config.js`

3. **Lancer l'application**
   ```bash
   npm run dev
   ```
   
   L'application s'ouvrira automatiquement dans votre navigateur à l'adresse `http://localhost:3000`

## 📁 Structure du projet

```
tiimeone/
├── src/
│   ├── components/       # Composants réutilisables
│   ├── pages/           # Pages de l'application
│   ├── styles/          # Styles CSS
│   ├── utils/           # Utilitaires
│   ├── config.js        # Configuration
│   ├── database.js      # Client Supabase
│   ├── router.js        # Routeur
│   └── main.js          # Point d'entrée
├── database/            # Schéma SQL et instructions
├── index.html           # HTML principal
├── package.json         # Dépendances
└── vite.config.js       # Configuration Vite
```

## 🎨 Fonctionnalités

- ✅ Interface moderne avec mode sombre et effets glassmorphisme
- ✅ Routage côté client avec URLs SEO-friendly
- ✅ Gestion de 10 projets
- ✅ CRUD complet pour les codes NAF
- ✅ Sélection multi-départements (hors DOM-TOM et Corse)
- ✅ Toggle de statuts animé
- ✅ Calcul automatique des départements manquants
- ✅ Persistance des données avec Supabase

## 🗺️ Navigation

- `/` ou `/home` - Page d'accueil avec les cartes de projets
- `/projet/:nom-projet` - Page détail d'un projet
- `/projet/:nom-projet/leads-scrapes` - Page leads scrapés

## 🛠️ Technologies utilisées

- **Vite** - Build tool rapide
- **Vanilla JavaScript** - Pas de framework, performance maximale
- **Supabase** - Base de données et backend
- **CSS moderne** - Variables CSS, animations, glassmorphisme

## 📝 Licence

Projet privé - TimeOne Staffy