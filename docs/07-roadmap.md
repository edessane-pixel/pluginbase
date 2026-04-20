# 🛣️ Roadmap PluginBase

## Objectif

Lister ce qui reste à faire, dans l'ordre de priorité, pour ne jamais coder au hasard. À mettre à jour quand une feature est livrée ou quand le contexte change.

## Périmètre

Couvre toutes les features produit et techniques. Ne couvre pas la doc (toujours en continu) ni les bugs (voir `06-bugs/`).

## Fichiers / dossiers concernés

Cette roadmap impacte potentiellement tout le repo. Elle est LA référence pour décider sur quoi bosser.

## Dépendances

- [[00-dashboard]] pointe ici
- [[08-prompts-copilot]] contient les prompts préparés pour les prochaines tâches

## État actuel — V1 en construction

### ✅ Livré

- Scanner navigateur via File System Access API
- Reconnaissance des plugins (~81% sur collection test, 300+ entrées dans le dict)
- Classification : statuts (Essentiel, Doublon, Inutilisé, À apprendre, À vendre, À tester)
- Favoris + notes personnelles + tags
- Détection doublons multi-format et fonctionnels
- Vue inventaire filtrable + recherche + tri + virtualisation
- Fiches détail basiques
- Purge : suppression sécurisée depuis le disque
- Gestion Program Files : guide Windows `/aide/windows`
- Landing page V1
- Welcome banner post-premier-scan
- Journal de session local (`/aide`) avec export JSON
- Collecte des plugins non reconnus

### 🔄 En cours

- **Fiches plugin enrichies** — AboutBlock, InCollectionBlock, ExternalLinksBlock
  - PR Copilot #8 fermée (incomplète), nouvelle PR relancée avec consignes strictes
  - Voir [[08-prompts-copilot/fiches-enrichies-v2]]

## Priorité haute (cette semaine)

### 1. Finaliser les fiches enrichies
- Vérifier que la nouvelle PR Copilot livre tous les fichiers attendus
- Merge, pull, test visuel sur Serum + Kontakt + un plugin inconnu
- Marquer comme livré ci-dessus

### 2. Mise en ligne Vercel
- Pousser le code actuel sur Vercel
- Vérifier que le scanner fonctionne en HTTPS (prérequis FSA API)
- Préparer l'URL à partager aux testeurs
- Voir [[05-decisions/pourquoi-vercel-pas-emergent]]

### 3. Test utilisateurs (5 producteurs)
- Envoyer le lien à 5 producteurs de profils variés
- Récupérer leurs retours via formulaire + JSON export `/aide`
- Identifier les 3 frustrations majeures
- Ne RIEN coder d'autre tant que ce cycle n'est pas bouclé

## Priorité moyenne

### 4. Page Insights
- Graphes Recharts : répartition par catégorie, par marque
- Révélations automatiques ("Tu as 56 compresseurs, un pro en utilise 10")
- Timeline d'activité basée sur session-log-store
- Voir [[08-prompts-copilot/insights-v1]]

### 5. Pages catégories
- `/categorie/[slug]` avec fiche FR, benchmark, liste des plugins de la cat
- `category-knowledge.ts` avec 12 catégories rédigées
- Lien depuis FilterSidebar, InCollectionBlock

### 6. Tracker de coût (feature à forte charge émotionnelle)
- Champ `purchasePrice` optionnel sur InventoryItem
- Dashboard "Tu as dépensé X € dont Y € en INUTILISÉ"
- UX simple : input inline sur la fiche détail

## Priorité basse (V2+)

### 7. Scan des projets DAW
- Parser `.als` (Ableton), `.flp` (FL Studio), `.logicx`
- Matcher les plugins utilisés dans les projets avec l'inventaire
- "Tu as ouvert Serum dans 47 projets cette année"
- Implique scanner Rust natif (browser ne pourra jamais)

### 8. Scanner natif Rust
- Binaire Windows standalone
- Accès complet au disque (inclus Program Files)
- Endpoint `/scanner/upload` côté API

### 9. Backend actif
- Déploiement Fastify sur Railway/Render
- Migration localStorage → Postgres
- Auth Better Auth
- Possibilité d'accéder à sa collection depuis plusieurs machines

### 10. Extension navigateur anti-achat
- Extension Chrome/Firefox qui détecte les pages produits Plugin Boutique / KVR
- Affiche "Tu as déjà 8 compresseurs opto dans ta collection"
- Lien retour vers pluginbase.xxx

### 11. Export CSV + PDF
- Export complet de l'inventaire au format CSV
- Génération de liste à désinstaller au format PDF

### 12. Fiches FR curées par IA
- Via backend + Claude API
- Validation manuelle pour éviter hallucinations
- Cache permanent pour maîtriser les coûts

## À décider

- **Modèle éco** : gratuit permanent / freemium / don ?
- **Stratégie RGPD** pour la partie backend
- **Domaine custom** : pluginbase.fr ? autre ?
- **Licence open source ou propriétaire ?**

## Risques / points d'attention

- **Ne pas empiler les features sans feedback utilisateur** — risque de construire pour personne
- **Chaque feature doit être livrée complète avant la suivante** — pas de work-in-progress qui s'accumule
- **Garder une liste à jour des PR Copilot** — certaines sont mergées, certaines fermées, il faut savoir où on en est

## Prochaines actions

- [ ] Après merge de la PR fiches enrichies → pousser sur Vercel
- [ ] Rédiger le message d'invitation aux 5 testeurs (template dans [[08-prompts-copilot]])
- [ ] Préparer le questionnaire post-test (5-7 questions max)
- [ ] Attendre les retours avant de lancer "Insights" ou "Catégories"
