import type { KnownPlugin } from './plugin-knowledge';
import { CATEGORY_KNOWLEDGE } from './category-knowledge';

export interface ResolvedDescription {
  source: 'curated' | 'auto' | 'unknown';
  text: string;
}

export function buildPluginDescription(
  known: KnownPlugin | null,
  fallbackName: string
): ResolvedDescription {
  // Tier 1 : description curée
  if (known?.description) {
    return { source: 'curated', text: known.description };
  }

  // Tier 2 : auto-génération à partir des données connues
  if (known) {
    const catKnowledge = CATEGORY_KNOWLEDGE[known.category.toUpperCase()];
    const parts: string[] = [];

    // Phrase 1 : qui c'est
    if (known.subcategory) {
      parts.push(
        `${known.displayName}, c'est un ${catKnowledge?.labelSingular ?? 'plugin'} ` +
        `de type ${known.subcategory}, fabriqué par ${known.brand}.`
      );
    } else {
      parts.push(
        `${known.displayName}, c'est un ${catKnowledge?.labelSingular ?? 'plugin'} ` +
        `fabriqué par ${known.brand}.`
      );
    }

    // Phrase 2 : contexte catégorie (oneLiner)
    if (catKnowledge?.oneLiner) {
      parts.push(catKnowledge.oneLiner);
    }

    // Phrase 3 : description sous-catégorie (si dispo dans CATEGORY_KNOWLEDGE)
    const subcatInfo = catKnowledge?.subcategories?.find(s => s.key === known.subcategory);
    if (subcatInfo?.description) {
      parts.push(subcatInfo.description);
    }

    return { source: 'auto', text: parts.join(' ') };
  }

  // Tier 3 : inconnu
  return {
    source: 'unknown',
    text: `PluginBase n'a pas encore de fiche détaillée pour ${fallbackName}. Utilise les liens ci-dessous pour trouver des informations.`,
  };
}
