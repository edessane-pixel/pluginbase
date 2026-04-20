# 🏗️ Architecture technique

## Objectif

Expliquer en 5 minutes comment le projet est structuré techniquement, pour que n'importe qui (toi dans 3 semaines, Copilot, un testeur dev) comprenne où les choses vivent et pourquoi.

## Périmètre

- Stack technique complet
- Flux de données principaux
- Frontières entre web / api / packages
- Choix d'architecture importants

Ne couvre PAS : le détail d'implémentation de chaque feature (voir `03-features/`).

## Fichiers / dossiers concernés

- `/CLAUDE.md` — source de vérité de la stack, lire avant toute modif
- `/package.json` — scripts racine du monorepo
- `/pnpm-workspace.yaml` — déclaration des workspaces
- `/apps/web/` — Next.js frontend
- `/apps/api/` — Fastify backend (non utilisé pour l'instant en prod)
- `/packages/types/` — types partagés

## Stack

### Frontend (`apps/web/`)

- **Framework** : Next.js 14 App Router
- **Langage** : TypeScript strict (pas de `any`)
- **Styles** : Tailwind CSS avec tokens CSS variables + CSS Modules pour composants complexes
- **UI primitives** : Radix UI (Dialog, DropdownMenu, AlertDialog, Switch, Select, Checkbox)
- **Animations** : Framer Motion (non nécessaire pour tout, utilisation parcimonieuse)
- **State global** : Zustand avec middleware `persist` pour la persistance localStorage
- **State serveur** : TanStack Query (préparé mais peu utilisé tant que pas de backend)
- **Formulaires** : React Hook Form + Zod
- **Icônes** : Lucide React uniquement
- **Charts** : Recharts (prévu pour page insights)
- **Tests** : Vitest

### Backend (`apps/api/`)

- **Runtime** : Node.js + Fastify (pas Express)
- **Langage** : TypeScript strict
- **ORM** : Prisma
- **DB** : PostgreSQL (Supabase recommandé)
- **Auth** : Better Auth (sessions JWT)
- **Validation** : Zod

**Statut actuel** : Non déployé. Toute la persistance V1 est côté client dans localStorage. L'API existe dans le code mais sert seulement à valider la structure pour une V2.

### Scanner natif (prévu, non implémenté)

- **Langage** : Rust
- **Distribution** : Binaire Windows standalone, plus tard app Tauri
- **Rôle futur** : Contourner les limites navigateur (accès à `Program Files`, scan projets DAW)

### Tooling

- **Package manager** : pnpm 10+ (jamais npm ni yarn)
- **Monorepo** : workspaces pnpm
- **Lint** : ESLint + Prettier
- **Git** : commits conventionnels (`feat:`, `fix:`, `chore:`, `docs:`)

## Flux de données principal

```
┌─────────────────────────────────────────────────┐
│ 1. User clique "Scanner" sur /scan              │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ 2. window.showDirectoryPicker() (browser API)   │
│    Renvoie un FileSystemDirectoryHandle         │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ 3. plugin-scanner.ts parcourt le dossier        │
│    Détecte .vst3 / .component / .clap / .aax    │
│    Renvoie { plugins, skipped, cancelled,       │
│              rootDirHandle, rootDirName }       │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ 4. plugin-normalizer.ts normalise chaque nom    │
│    resolveKnownPlugin() cherche dans le dict    │
│    Enrichit chaque item (brand, category...)    │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ 5. inventory-store.setItems() — Zustand persist │
│    file-handles-store.setRoot() — volatile      │
└──────────────────┬──────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────┐
│ 6. UI réagit :                                  │
│    /inventaire, /doublons, /plugin/[id], /purge │
└─────────────────────────────────────────────────┘
```

## Stores Zustand

| Store | Persisté ? | Rôle |
|-------|------------|------|
| `inventory-store` | ✅ localStorage v2 | Items de la collection, classifications |
| `filters-store` | ❌ éphémère | Filtres actifs sur l'inventaire |
| `onboarding-store` | ✅ localStorage | `hasCompletedFirstScan`, `hasSeenWelcome` |
| `session-log-store` | ✅ localStorage | Journal d'events pour feedback |
| `unrecognized-store` | ✅ localStorage | Plugins non reconnus à remonter |
| `deletion-log-store` | ✅ localStorage | Historique des suppressions |
| `file-handles-store` | ❌ volatile | `FileSystemDirectoryHandle` actuel, permission écriture |

**Règle importante** : les `FileSystemDirectoryHandle` ne sont **jamais** persistés. Ils ne survivent pas à un refresh. L'utilisateur doit rescan pour retrouver un handle.

## Routes Next.js

| Route | Rôle |
|-------|------|
| `/` | Landing publique |
| `/scan` | Page de scan (action) |
| `/(main)/inventaire` | Vue principale des plugins |
| `/(main)/inventaire?category=X` | Vue filtrée sur une catégorie |
| `/(main)/doublons` | Détection doublons multi-format + fonctionnels |
| `/(main)/plugin/[id]` | Fiche détail d'un plugin |
| `/(main)/purge` | Mode suppression sécurisée |
| `/(main)/aide` | Feedback, export session, liste inconnus |
| `/(main)/aide/windows` | Guide Windows pour Program Files |

Le groupe `(main)` partage un layout avec header + banner permission écriture si active.

## Dépendances externes critiques

- **File System Access API** (navigateur) — scanner + purge
- **localStorage** — toute la persistance V1
- **Recharts** (futur) — graphes insights
- **Radix UI** — toutes les primitives interactives

## Risques / points d'attention

- **Le scanner ne fonctionne que sur Chromium** (Chrome, Edge, Brave, Arc, Opera). Firefox et Safari tombent sur le fallback "navigateur non compatible".
- **Chrome bloque les dossiers système** : `C:\Program Files\*` impossible à scanner ou purger. Voir [[06-bugs/chrome-program-files]].
- **Persistance localStorage = local à ce navigateur** : l'utilisateur qui change de machine perd tout. Solution future : backend + auth.
- **Les handles File System API meurent au refresh** : toute feature qui en a besoin doit être consciente de ça (ex : purge exige rescan si refresh).
- **Pas de CI** pour l'instant. `pnpm build` + `pnpm test` doivent être lancés manuellement avant merge.

## Prochaines actions

- [ ] Déployer sur Vercel pour avoir une URL partageable
- [ ] Mettre en place une GitHub Action qui lance `pnpm build` + `pnpm test` sur chaque PR
- [ ] Documenter le schéma Prisma quand le backend sera activé (voir `CLAUDE.md` section 5)
- [ ] Décider de la stratégie de migration localStorage → backend quand l'auth sera branchée
