# 🚀 Défi Mobilité M'Airidia

Application web complète pour la campagne de mobilité estudiantine.

## Architecture

```
mairidia/
├── index.html          → Page d'embarquement (landing)
├── quiz.html           → Quiz 5 questions + scoring automatique
├── profil.html         → Résultat profil personnalisé + numéro
├── defis.html          → Choix des 5 micro-défis
├── confirmation.html   → Confirmation défi + template post réseaux
├── classement.html     → Page publique classement (auto-refresh 30s)
├── challenge7.html     → Challenge 7 jours
├── css/style.css       → Styles globaux
├── js/app.js           → Scoring, profils, utilitaires partagés
├── api/
│   ├── participant.js  → POST : créer participant
│   ├── classement.js   → GET  : retourner classement public
│   └── points.js       → POST : valider défi + créditer points (admin)
├── data/
│   └── participants.json → Base de données JSON
└── vercel.json         → Config déploiement Vercel
```

## Déploiement sur Vercel

### 1. Prérequis
- Compte GitHub
- Compte Vercel (gratuit)

### 2. Mettre le projet sur GitHub
```bash
cd mairidia
git init
git add .
git commit -m "Initial commit — Défi Mobilité M'Airidia"
git remote add origin https://github.com/TON-USER/mairidia-defi.git
git push -u origin main
```

### 3. Déployer sur Vercel
1. Va sur [vercel.com](https://vercel.com)
2. "Add New Project" → importer depuis GitHub
3. Sélectionne le repo `mairidia-defi`
4. **Ajouter la variable d'environnement** : `ADMIN_KEY` = `ton-mot-de-passe-admin`
5. Cliquer "Deploy"

Vercel génère une URL du type `mairidia-defi.vercel.app`.

### 4. Afficher le classement sur écran campus
Ouvrir `https://mairidia-defi.vercel.app/classement.html` en plein écran.
La page se rafraîchit automatiquement toutes les 30 secondes.

---

## Mécanique RGPD

- **Aucun nom réel collecté** — participation par pseudonyme + numéro unique
- **Numéros de format** : `MAI-AAAAMM-XXXX` (ex: `MAI-202501-4231`)
- **Résultats publiés uniquement** sur la page classement — pas d'email
- **Pour récupérer un lot** : se présenter à l'accueil avec son numéro

---

## Valider un défi (côté équipe)

Quand un participant poste sa preuve avec #DefimobiliteMAiridia :

```bash
curl -X POST https://mairidia-defi.vercel.app/api/points \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: ton-mot-de-passe-admin" \
  -d '{
    "numero": "MAI-202501-4231",
    "defi_id": 1,
    "points_bonus": 10
  }'
```

Réponse : `{ "success": true, "nouveau_total": 15, "tickets": 1 }`

---

## Profils mobilité

| Profil | Emoji | Description |
|---|---|---|
| Explorateur Méridien | 🚶 | Ouvert, dans ses habitudes mais prêt à changer |
| Optimiseur Urbain | ⚡ | Pragmatique, cherche l'efficacité |
| Éco-Connecté | 🌿 | Motivé par l'environnement |
| Multimodal Engagé | 🔀 | Combine déjà plusieurs modes |
| Déclencheur de Changement | 💡 | Influence les autres |

## Micro-défis

| # | Défi | Points |
|---|---|---|
| 1 | Vélo / Marche 1 jour | +10 pts |
| 2 | Nouveau transport | +10 pts |
| 3 | Covoiturage | +10 pts |
| 4 | Multimodal | +10 pts |
| 5 | Calculer son trajet | +10 pts |

Quiz complété : **+5 pts**
Challenge 7 jours : **+30 pts**
5 défis réalisés → **lot garanti**
