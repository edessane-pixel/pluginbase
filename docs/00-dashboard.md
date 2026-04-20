# 📊 Dashboard PluginBase

> Point d'entrée de toute la documentation du projet. Toujours commencer ici.

## Statut actuel du projet

- **Phase** : Fin V0 / Début V1
- **Repo actuel** : `edessane-pixel/pluginbase` (repo précédent archivé : `elze32/pluginbase`)
- **Dernière grosse étape** : Purge fonctionnelle en production locale, fiches plugin enrichies en cours
- **Reconnaissance plugins** : ~81% (448 scannés, 84 non reconnus sur une collection test)
- **En ligne ?** : Non, tourne uniquement sur `http://localhost:3000` et API sur `:3001`

## Objectif

Avoir en un coup d'œil où en est le projet, où sont les infos, et par quoi reprendre quand on ouvre Obsidian après une pause.

## Périmètre

Ce document agrège les liens vers toute la doc du projet. Il ne contient pas de détails — que des pointeurs.

## Liens rapides — Documentation

### Fondamentaux
- [[01-architecture]] — Stack technique, flux de données, choix d'architecture
- [[02-arborescence]] — Carte des dossiers et responsabilité de chaque zone

### Features
- [[03-features/scanner]] — Scan navigateur File System Access API
- [[03-features/inventaire]] — Vue principale, filtres, tri, virtualisation
- [[03-features/doublons]] — Détection multi-format et fonctionnelle
- [[03-features/purge]] — Suppression sécurisée des plugins
- [[03-features/fiches-plugin]] — Page détail enrichie (en cours)
- [[03-features/onboarding]] — Landing, premier scan, welcome banner

### Dictionnaire de plugins
- [[04-plugins/normaliseur]] — Fonction `normalizePluginPattern`
- [[04-plugins/dictionnaire]] — `KNOWN_PLUGINS` et stratégie d'expansion
- [[04-plugins/plugins-inconnus]] — Plugins non reconnus à résoudre

### Décisions & réflexions
- [[05-decisions/choix-scanner-navigateur-vs-rust]]
- [[05-decisions/pas-de-backend-v1]]
- [[05-decisions/persistance-locale-zustand]]

### Bugs & incidents
- [[06-bugs/chrome-program-files]] — Blocage dossiers système Windows
- [[06-bugs/plugin-introuvable-fiche]] — IDs qui ne matchaient plus (résolu)
- [[06-bugs/copilot-ment-dans-resume]] — PR #8 incomplète malgré résumé

### Roadmap & prompts
- [[07-roadmap]] — Ce qui reste à faire, priorisé
- [[08-prompts-copilot]] — Bibliothèque de prompts réutilisables

## Reprise rapide du projet

Si tu reprends le projet après plusieurs jours, lis dans cet ordre :

1. Ce fichier ([[00-dashboard]])
2. [[01-architecture]] pour te rappeler la stack
3. [[07-roadmap]] pour voir ce qui est prioritaire maintenant
4. La note de la feature sur laquelle tu travailles (dans `03-features/`)
5. [[08-prompts-copilot]] si tu vas lancer une tâche Copilot

## Commandes terminal courantes

```bash
# Lancer le dev (depuis la racine du repo)
pnpm dev

# Lancer uniquement le web (Next.js)
pnpm --filter web dev

# Lancer uniquement l'API (Fastify)
pnpm --filter api dev

# Build complet (vérification avant merge)
pnpm build

# Lancer les tests
pnpm test

# Audit du dictionnaire
pnpm --filter web dict:audit

# Récupérer les modifs Copilot après merge de PR
git pull origin main
```

## Dépendances

- Toutes les notes du dossier `docs/`
- Le `CLAUDE.md` à la racine (source de vérité pour la stack)
- Les fichiers `AGENTS.md`, `ROLES.md`, `START_HERE.md` (consignes Copilot)

## Risques / points d'attention

- **Ne jamais modifier** la section "Stack technique" sans mettre à jour `CLAUDE.md` en parallèle.
- La doc peut diverger du code — si tu constates un écart, fixer la doc prime sur ignorer.
- Cette doc n'est pas auto-générée : tout changement significatif du code mérite une MAJ manuelle ici.

## Prochaines actions

- Compléter les notes `03-features/*` manquantes au fil des prochaines sessions
- Ajouter une note `04-plugins/plugins-inconnus` avec la liste réelle (extraire depuis `/aide` → export)
- Documenter chaque PR Copilot dans `06-bugs/` ou `05-decisions/` si elle pose question.