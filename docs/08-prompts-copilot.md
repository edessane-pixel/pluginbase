# 🤖 Prompts Copilot — Bibliothèque

## Objectif

Garder les prompts réutilisables pour Copilot Agent, dans leur version finale validée, pour éviter de les refaire à chaque fois et capitaliser sur ce qui marche.

## Périmètre

- Prompts "techniques" déjà validés (livrés avec succès)
- Prompts en cours de test (pas encore validés)
- Gabarit générique réutilisable
- Leçons apprises en travaillant avec Copilot Agent

Ne couvre pas : les prompts "conversationnels" courts du quotidien.

## Fichiers / dossiers concernés

Ce fichier est autonome, mais il pointe vers :
- [[07-roadmap]] pour savoir quelle tâche lancer ensuite
- Les PR GitHub pour voir les résultats des prompts passés

## Dépendances

- Copilot Agent actif sur `edessane-pixel/pluginbase`
- `CLAUDE.md`, `AGENTS.md`, `ROLES.md` à la racine (à jour)

## Règles d'usage de Copilot Agent

### Les 5 règles non négociables apprises

1. **Lui dire explicitement de vérifier son travail avec `git diff --name-only main` avant d'ouvrir la PR.** Sinon il peut annoncer "work complete" alors qu'il n'a committé qu'une partie.

2. **Lui interdire les modifications hors scope.** Sans ça, il corrige des bugs tiers, refactore du code, et la PR devient impossible à reviewer.

3. **Lui faire lister dans la description de la PR les fichiers réellement modifiés.** Preuve de ce qui a été fait, vérifiable.

4. **Toujours reviewer l'onglet "Files changed" avant de merger.** Ne jamais faire confiance au résumé de Copilot seul (voir PR #8).

5. **Un prompt = une feature.** Pas deux en parallèle. Pas trois à la fois. Pas de "et aussi pendant que tu y es...".

### Checklist avant de lancer une tâche Copilot

- [ ] `main` est à jour (`git pull origin main`)
- [ ] Aucune autre session Copilot en cours
- [ ] `CLAUDE.md` à jour si la tâche touche à la stack
- [ ] Prompt verrouille le scope explicitement
- [ ] Prompt exige `git diff --name-only main` avant PR
- [ ] Prompt définit les critères d'acceptation mesurables

### Checklist après la PR Copilot

- [ ] Onglet "Files changed" : liste conforme à l'attendu
- [ ] Aucun fichier modifié hors scope
- [ ] `pnpm test` passe (vérifier dans l'onglet Checks)
- [ ] `pnpm build` passe
- [ ] Description PR contient le `git diff --name-only main`
- [ ] Passer de Draft à Ready for review
- [ ] Merger
- [ ] `git pull origin main` en local
- [ ] Test visuel dans le navigateur

## Gabarit générique — Prompt Copilot

````markdown
# Tâche : [nom court descriptif]

## ⚠ CONSIGNE STRICTE DE SCOPE

Tu ne fais QUE ce qui est décrit dans ce prompt. Tu ne touches pas à :
- Des bugs que tu pourrais identifier dans d'autres fichiers
- Des optimisations de code "au passage"
- Des refactors que tu juges pertinents
- [liste des zones HORS SCOPE de cette tâche en particulier]

Si tu détectes un problème hors scope, NOTE-LE dans la description de la PR sans le corriger.

## ⚠ VÉRIFICATION OBLIGATOIRE AVANT D'OUVRIR LA PR

Avant d'ouvrir la PR, exécute :
```
git diff --name-only main
```

Et vérifie que la sortie contient au MINIMUM :

[liste exhaustive des fichiers attendus]

Si la liste est incomplète, ne pas ouvrir la PR. Continuer à créer les fichiers manquants.

Dans la description de la PR, coller le résultat exact de `git diff --name-only main`.

## Contexte

Lis CLAUDE.md, AGENTS.md, ROLES.md à la racine.

[Décrire le pourquoi de la tâche en 3-5 lignes]

## Travail à faire

[Partie 1, 2, 3, ...]

[Détail du travail, un bloc par partie, avec du code complet quand c'est critique]

## Critères d'acceptation

[Critère mesurable 1]
[Critère mesurable 2]
...

## Rapport obligatoire dans la description de la PR

- Résultat de `git diff --name-only main`
- Nombre de fichiers créés vs modifiés
- Résultat de `pnpm test`
- Résultat de `pnpm build`

## Règles non négociables

- Ne supprime AUCUN fichier existant
- TypeScript strict, pas de `any`, named exports uniquement
- Composants < 150 lignes
- Textes 100% français
- Design system strict (CSS variables, pas de hex hardcodé)
````

## Prompts validés — Livrés avec succès

### 1. Fix dossiers système Windows
Livré dans la PR sur la gestion des blocages Chrome. Voir [[06-bugs/chrome-program-files]].

### 2. Expansion dictionnaire
Dictionnaire passé de 30 à 300+ entrées. Taux de reconnaissance 81%. Livré.

### 3. Mode Purge (suppression sécurisée)
Feature la plus sensible du projet. Livrée proprement avec double confirmation et mot-clé à taper.

## Prompts en cours ou à refaire

### Fiches plugin enrichies (v2)
- **Statut** : PR #8 fermée (incomplète), nouvelle tâche relancée
- **Risque** : Copilot peut à nouveau livrer un sous-ensemble sans avertir
- **Mitigation** : consigne `git diff --name-only main` explicite dans le prompt
- Prompt complet disponible dans la session de travail (à archiver ici quand livré)

## Prompts à venir (préparés, pas encore lancés)

### Insights + graphes
Prévu pour après le test utilisateurs. Ne PAS lancer avant feedback terrain.

### Pages catégories
Prévu pour après Insights.

### Tracker coût
Prévu en parallèle ou après les catégories, selon demande utilisateurs.

## Template — Message aux testeurs

```
Salut [prénom],

J'ai développé un outil web gratuit qui scanne ta collection de plugins audio, détecte les doublons, et t'aide à y voir clair. 100% dans ton navigateur, rien n'est uploadé, pas de compte à créer.

Lien : [URL Vercel]

Prends 10 minutes pour l'essayer. Scanne un de tes dossiers VST3 (si tu es sur Windows, lis le guide /aide/windows — Chrome bloque Program Files).

Ensuite, dis-moi :

1. Qu'est-ce qui t'a surpris (en bien ou en mal) ?
2. Qu'est-ce qui manque cruellement ?
3. Tu reviendrais une deuxième fois ?

Tu peux aussi aller sur /aide et me coller le résumé JSON de ta session — ça m'aide énormément.

Merci !
Elze
```

## Risques / points d'attention

- **Copilot Agent peut mentir dans son résumé.** Toujours vérifier Files changed.
- **Copilot peut refuser de faire une tâche complexe** en la scindant sans prévenir.
- **Ne pas lancer 2 tâches Copilot en parallèle** sur le même repo : conflits de merge garantis.
- **Garder ce fichier à jour** : chaque nouveau prompt validé mérite d'être archivé ici.

## Prochaines actions

- [ ] Archiver ici le prompt "Fiches enrichies v2" quand livré avec succès
- [ ] Créer le prompt "Insights + graphes" complet après test utilisateurs
- [ ] Documenter chaque échec/incident Copilot dans `06-bugs/`
- [ ] Ajouter une note `05-decisions/pourquoi-copilot-vs-cursor` avec le retour d'expérience
