import type { InventoryItem } from '@/stores/inventory-store';

export interface SimilarGroup {
  totalInCategory: number;
  samples: InventoryItem[];  // max 5
}

const SCORE_SAME_SUBCATEGORY = 10;
const SCORE_FAVORITE = 5;
const SCORE_ESSENTIAL = 3;

export function findSimilarPlugins(
  current: InventoryItem,
  all: InventoryItem[]
): SimilarGroup | null {
  if (!current.category) return null;

  // Tous les autres plugins de la même catégorie
  const sameCategory = all.filter(
    i => i.id !== current.id && i.category === current.category
  );

  if (sameCategory.length === 0) return null;

  // Prioriser :
  // 1. Même sous-catégorie (si current a une subcategory)
  // 2. Favoris
  // 3. Status ESSENTIAL
  // 4. Reste
  const scored = sameCategory.map(i => {
    let score = 0;
    if (current.subcategory && i.subcategory === current.subcategory) score += SCORE_SAME_SUBCATEGORY;
    if (i.favorite) score += SCORE_FAVORITE;
    if (i.status === 'ESSENTIAL') score += SCORE_ESSENTIAL;
    return { item: i, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    totalInCategory: sameCategory.length,
    samples: scored.slice(0, 5).map(s => s.item),
  };
}
