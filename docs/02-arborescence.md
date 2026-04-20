# 🗂️ Arborescence du repo

## Objectif

Donner la carte complète des dossiers du projet, avec le rôle de chacun, pour ne plus jamais chercher où est quoi.

## Périmètre

Couvre uniquement les dossiers significatifs. Les `node_modules`, `.next`, etc. sont ignorés.

## Fichiers / dossiers concernés

Tout le repo sauf les gitignored.

## Structure

```
pluginbase/
├── .claude/                    # Config Claude (ignorer, géré par l'outil)
├── .cursor/                    # Config Cursor (ignorer, géré par l'outil)
├── AGENTS.md                   # Consignes Copilot — à lire par Copilot au démarrage
├── CLAUDE.md                   # Source de vérité technique du projet
├── DEPLOYMENT.md               # Guide déploiement Vercel
├── README.md                   # Démarrage rapide pour un dev
├── ROLES.md                    # Rôles des différents agents/IA
├── START_HERE.md               # Point d'entrée pour nouveaux arrivants
├── package.json                # Scripts racine (dev, build, test...)
├── pnpm-lock.yaml              # Lockfile — ne pas éditer à la main
├── pnpm-workspace.yaml         # Déclaration des workspaces
├── setup-env.js                # Script d'initialisation .env
├── docs/                       # ← CETTE DOC
│
├── apps/
│   ├── web/                    # Frontend Next.js (principal)
│   └── api/                    # Backend Fastify (pas actif)
│
└── packages/
    └── types/                  # Types TS partagés frontend/backend
```

## Détails — `apps/web/`

```
apps/web/
├── app/
│   ├── page.tsx                # Landing publique /
│   ├── layout.tsx              # Layout racine (fonts, metadata)
│   ├── not-found.tsx           # Page 404
│   ├── globals.css             # CSS variables design system
│   ├── icon.tsx                # Favicon dynamique
│   ├── og.png/route.tsx        # OG image dynamique (ou statique /public/og.png)
│   ├── robots.ts               # Robots.txt dynamique
│   │
│   ├── scan/                   # Action de scan
│   │   └── page.tsx
│   │
│   └── (main)/                 # Layout avec header, pour pages "app"
│       ├── layout.tsx          # Header, DevStatusBar, WritePermissionBanner
│       ├── inventaire/
│       │   └── page.tsx        # Vue principale
│       ├── doublons/
│       │   └── page.tsx
│       ├── purge/
│       │   └── page.tsx
│       ├── plugin/
│       │   └── [id]/
│       │       └── page.tsx    # Fiche détail
│       └── aide/
│           ├── page.tsx        # Feedback + export
│           └── windows/
│               └── page.tsx    # Guide Windows Program Files
│
├── components/
│   ├── ui/                     # Primitives de base (StatusBadge...)
│   ├── layout/                 # AppHeader, WritePermissionBanner
│   ├── scan/                   # ScanInterface et dépendants
│   ├── inventory/              # FilterSidebar, InventoryList, InventoryRow, etc.
│   ├── doublons/               # MultiFormatGroupCard, FunctionalGroupCard
│   ├── plugin/                 # AboutBlock, InCollectionBlock, ExternalLinksBlock
│   ├── purge/                  # PurgeSelector, PurgeConfirmDialog, etc.
│   ├── onboarding/             # WelcomeBanner
│   ├── landing/                # LandingHero, LandingProblem, etc.
│   ├── aide/                   # FeedbackSection, SessionSharePanel
│   └── dev/                    # DevStatusBar (invisible en prod)
│
├── lib/
│   ├── plugin-knowledge.ts            # Dict KNOWN_PLUGINS + interface
│   ├── plugin-normalizer.ts           # normalizePluginPattern + resolveKnownPlugin
│   ├── plugin-scanner.ts              # Scan récursif + gestion erreurs
│   ├── plugin-deleter.ts              # Suppression via FSA API
│   ├── plugin-description-generator.ts # À propos : tier 1 + auto
│   ├── similar-plugins.ts             # Plugins de même catégorie
│   ├── external-search.ts             # Liens Google / KVR / PluginBoutique
│   ├── duplicate-detector.ts          # Détection multi-format + fonctionnelle
│   ├── file-permissions.ts            # Request readwrite via FSA API
│   ├── category-knowledge.ts          # (à venir) Descriptions catégories
│   ├── logger.ts                      # logger.debug en dev uniquement
│   └── tests/                     # Tests Vitest purs
│
├── stores/
│   ├── inventory-store.ts             # Persist v2
│   ├── filters-store.ts               # Éphémère
│   ├── onboarding-store.ts            # Persist
│   ├── session-log-store.ts           # Persist
│   ├── unrecognized-store.ts          # Persist
│   ├── deletion-log-store.ts          # Persist
│   └── file-handles-store.ts          # Volatile, jamais persisté
│
├── hooks/
│   ├── useFilteredItems.ts            # Filtrage memoized
│   └── useSessionLogger.ts            # Wrapper sur session-log-store
│
├── types/
│   └── file-system-access.d.ts        # Typings pour FSA API
│
├── scripts/
│   ├── dict-audit.ts                  # Audit reconnaissance dict
│   ├── smoke-test.sh                  # Check build prod + absence console.log
│   └── fixtures/
│       └── real-collection.txt        # Liste noms de fichiers VST3 réels
│
├── public/                     # Assets statiques
├── package.json                # Deps et scripts spécifiques web
├── tailwind.config.ts          # Tokens design system exposés à Tailwind
├── next.config.js              # Config Next
├── vercel.json                 # Headers sécurité, région cdg1
└── .env.local.example          # Variables d'env à copier
```

**Note** : certains fichiers listés ci-dessus peuvent ne pas encore exister dans le repo selon l'avancement. À vérifier au cas par cas.

## Détails — `apps/api/`

```
apps/api/
├── src/
│   ├── index.ts                # Point d'entrée Fastify
│   ├── routes/                 # Endpoints /auth, /scanner, /plugins, /views
│   ├── services/               # Logique métier
│   └── middlewares/            # Auth, CORS, logging
├── prisma/
│   ├── schema.prisma           # Modèle de données (voir CLAUDE.md section 5)
│   ├── seed.ts                 # (futur) Seed PluginMaster
│   └── seed/
│       └── plugins.json        # (futur) Entrées à seeder
├── package.json
└── .env.example
```

**Statut** : le backend n'est pas actif en production. Il existe en code mais n'est déployé nulle part. Toute persistance V1 passe par localStorage côté client.

## Détails — `packages/types/`

```
packages/types/
├── src/
│   ├── index.ts                # Exports barrel
│   └── plugin-normalize.ts     # Fonction partagée front/back (dupliquée avec lib/)
└── package.json
```

**Note** : la fonction `normalizePluginPattern` existe dans deux endroits potentiellement (ici et `apps/web/lib/plugin-normalizer.ts`). À consolider en une seule source de vérité quand le backend sera actif.

## Dépendances

- [[01-architecture]] pour le "pourquoi" de cette structure
- [[03-features/*]] pour le détail de ce qui vit dans chaque sous-dossier

## Risques / points d'attention

- **Ne pas créer de nouveau top-level dossier** sans raison — préférer étendre l'existant (`apps/web/components/*`, `apps/web/lib/*`).
- **Éviter les imports cross-workspace hors `packages/types`** : web ne devrait pas importer api directement.
- **`components/` vs `app/`** : pas de composants dans `app/` à part les pages elles-mêmes. Toute logique UI réutilisable va dans `components/`.
- **Si Copilot crée un fichier ailleurs**, vérifier avant merge qu'il n'introduit pas un chaos de structure.

## Prochaines actions

- [ ] Vérifier l'état réel du dossier `apps/api/` (est-ce que `schema.prisma` existe, seed, etc.)
- [ ] Décider si `packages/types/` reste ou est absorbé par `apps/web/types/` tant que l'API n'est pas active
- [ ] Ajouter un fichier `.editorconfig` à la racine si pas présent (cohérence tabs/espaces)
