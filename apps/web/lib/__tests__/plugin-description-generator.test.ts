import { describe, it, expect } from 'vitest';
import { buildPluginDescription } from '../plugin-description-generator';
import type { KnownPlugin } from '../plugin-knowledge';

const curatedPlugin: KnownPlugin = {
  brand: 'Xfer Records',
  displayName: 'Serum',
  category: 'Synth',
  aliases: ['serum'],
  description: "Serum, c'est LE synthétiseur wavetable moderne.",
};

const knownPluginNoDesc: KnownPlugin = {
  brand: 'SomeBrand',
  displayName: 'SomePlugin',
  category: 'Compressor',
  aliases: ['some_plugin'],
};

const knownPluginWithSubcat: KnownPlugin = {
  brand: 'SomeBrand',
  displayName: 'SomePlugin',
  category: 'Compressor',
  subcategory: 'opto',
  aliases: ['some_plugin'],
};

describe('buildPluginDescription', () => {
  it('retourne source curated pour un plugin avec description curée', () => {
    const result = buildPluginDescription(curatedPlugin, 'Serum');
    expect(result.source).toBe('curated');
    expect(result.text).toBe(curatedPlugin.description);
  });

  it('retourne source auto pour un plugin connu sans description', () => {
    const result = buildPluginDescription(knownPluginNoDesc, 'SomePlugin');
    expect(result.source).toBe('auto');
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.text).toContain('SomePlugin');
    expect(result.text).toContain('SomeBrand');
  });

  it('inclut la sous-catégorie dans la description auto', () => {
    const result = buildPluginDescription(knownPluginWithSubcat, 'SomePlugin');
    expect(result.source).toBe('auto');
    expect(result.text).toContain('opto');
  });

  it('retourne source unknown pour un plugin inconnu (null)', () => {
    const result = buildPluginDescription(null, 'UnknownPlugin');
    expect(result.source).toBe('unknown');
    expect(result.text).toContain('UnknownPlugin');
  });

  it('la description unknown mentionne d\'utiliser les liens', () => {
    const result = buildPluginDescription(null, 'SomeWeirdPlugin');
    expect(result.text.toLowerCase()).toContain('liens');
  });
});
