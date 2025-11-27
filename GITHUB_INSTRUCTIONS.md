# 🐙 Guide : Mettre votre projet sur GitHub

Voici les étapes pour héberger votre projet "TimeOne Staffy" sur GitHub.

## 1. Créer un dépôt sur GitHub

1.  Connectez-vous à votre compte [GitHub](https://github.com).
2.  Cliquez sur le **+** en haut à droite, puis **New repository**.
3.  Nommez votre dépôt (ex: `timeone-staffy`).
4.  Laissez-le en **Public** ou **Private** selon votre choix.
5.  **Ne cochez rien** dans la section "Initialize this repository with" (pas de README, pas de .gitignore, pas de license).
6.  Cliquez sur **Create repository**.

## 2. Initialiser Git sur votre ordinateur

Ouvrez un **nouveau terminal** dans VS Code (Ctrl+Shift+ù) et tapez les commandes suivantes une par une :

```bash
# 1. Initialiser git
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Faire le premier commit (sauvegarde)
git commit -m "Initial commit: TimeOne Staffy App"

# 4. Renommer la branche principale en 'main'
git branch -M main
```

## 3. Relier et envoyer vers GitHub

Sur la page de votre nouveau dépôt GitHub, copiez l'URL qui ressemble à :
`https://github.com/VOTRE_NOM/timeone-staffy.git`

Ensuite, dans votre terminal, lancez ces commandes (remplacez l'URL par la vôtre) :

```bash
# 5. Ajouter le lien vers GitHub (remplacez l'URL !)
git remote add origin https://github.com/VOTRE_NOM/timeone-staffy.git

# 6. Envoyer le code vers GitHub
git push -u origin main
```

---

## ✅ C'est fini !

Si vous rafraîchissez la page GitHub, vous verrez tous vos fichiers.

### Pour les prochaines mises à jour :
Quand vous ferez des modifications plus tard, il suffira de faire :

```bash
git add .
git commit -m "Description de vos changements"
git push
```
