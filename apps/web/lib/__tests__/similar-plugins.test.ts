import { describe, it, expect } from 'vitest';
import { findSimilarPlugins } from '../similar-plugins';
import type { InventoryItem } from '../../stores/inventory-store';

function makeItem(overrides: Partial<InventoryItem> & { id: string }): InventoryItem {
  return {
    nameRaw: overrides.id,
    format: 'VST3',
    brand: 'TestBrand',
    displayName: overrides.id,
    category: null,
    status: 'UNCLASSIFIED',
    favorite: false,
    customTags: [],
    ...overrides,
  };
}

describe('findSimilarPlugins', () => {
  it('retourne null si le plugin courant n\'a pas de catégorie', () => {
    const current = makeItem({ id: 'p1', category: null });
    const all = [current, makeItem({ id: 'p2', category: 'EQ' })];
    expect(findSimilarPlugins(current, all)).toBeNull();
  });

  it('retourne null si aucun autre plugin de la même catégorie', () => {
    const current = makeItem({ id: 'p1', category: 'Reverb' });
    const all = [current, makeItem({ id: 'p2', category: 'EQ' })];
    expect(findSimilarPlugins(current, all)).toBeNull();
  });

  it('ne retourne pas le plugin courant dans les samples', () => {
    const current = makeItem({ id: 'p1', category: 'EQ' });
    const others = ['p2', 'p3', 'p4', 'p5', 'p6'].map(id =>
      makeItem({ id, category: 'EQ' })
    );
    const all = [current, ...others];
    const result = findSimilarPlugins(current, all);
    expect(result).not.toBeNull();
    expect(result!.samples.every(s => s.id !== 'p1')).toBe(true);
  });

  it('retourne au maximum 5 samples', () => {
    const current = makeItem({ id: 'current', category: 'Compressor' });
    const others = Array.from({ length: 10 }, (_, i) =>
      makeItem({ id: `p${i}`, category: 'Compressor' })
    );
    const result = findSimilarPlugins(current, [current, ...others]);
    expect(result!.samples.length).toBeLessThanOrEqual(5);
  });

  it('totalInCategory reflète le nombre total sans le courant', () => {
    const current = makeItem({ id: 'current', category: 'Compressor' });
    const others = Array.from({ length: 7 }, (_, i) =>
      makeItem({ id: `p${i}`, category: 'Compressor' })
    );
    const result = findSimilarPlugins(current, [current, ...others]);
    expect(result!.totalInCategory).toBe(7);
  });

  it('priorise un plugin de même sous-catégorie devant un autre', () => {
    const current = makeItem({ id: 'current', category: 'Compressor', subcategory: 'opto' });
    const sameSubcat = makeItem({ id: 'same-sub', category: 'Compressor', subcategory: 'opto' });
    const diffSubcat = makeItem({ id: 'diff-sub', category: 'Compressor', subcategory: 'vca' });
    const result = findSimilarPlugins(current, [current, diffSubcat, sameSubcat]);
    expect(result!.samples[0].id).toBe('same-sub');
  });

  it('priorise les favoris par rapport aux non-favoris', () => {
    const current = makeItem({ id: 'current', category: 'EQ' });
    const favorited = makeItem({ id: 'fav', category: 'EQ', favorite: true });
    const regular = makeItem({ id: 'reg', category: 'EQ', favorite: false });
    const result = findSimilarPlugins(current, [current, regular, favorited]);
    expect(result!.samples[0].id).toBe('fav');
  });

  it('priorise ESSENTIAL par rapport à UNCLASSIFIED', () => {
    const current = makeItem({ id: 'current', category: 'Reverb' });
    const essential = makeItem({ id: 'ess', category: 'Reverb', status: 'ESSENTIAL' });
    const unclassified = makeItem({ id: 'unc', category: 'Reverb', status: 'UNCLASSIFIED' });
    const result = findSimilarPlugins(current, [current, unclassified, essential]);
    expect(result!.samples[0].id).toBe('ess');
  });
});
