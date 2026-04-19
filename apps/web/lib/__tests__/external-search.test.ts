import { describe, it, expect } from 'vitest';
import { buildExternalLinks } from '../external-search';

describe('buildExternalLinks', () => {
  it('génère 3 liens par défaut sans manufacturerUrl', () => {
    const links = buildExternalLinks('Pro-Q 3', 'FabFilter');
    expect(links).toHaveLength(3);
  });

  it('génère 4 liens quand manufacturerUrl est fourni', () => {
    const links = buildExternalLinks('Pro-Q 3', 'FabFilter', 'https://fabfilter.com');
    expect(links).toHaveLength(4);
  });

  it('place le lien fabricant en premier quand fourni', () => {
    const links = buildExternalLinks('Serum', 'Xfer Records', 'https://xferrecords.com/products/serum');
    expect(links[0].label).toBe('Site du fabricant');
    expect(links[0].url).toBe('https://xferrecords.com/products/serum');
  });

  it('inclut les 3 liens standards (Google, KVR, Plugin Boutique)', () => {
    const links = buildExternalLinks('Serum', 'Xfer Records');
    const labels = links.map(l => l.label);
    expect(labels).toContain('Rechercher sur Google');
    expect(labels).toContain('KVR Audio');
    expect(labels).toContain('Plugin Boutique');
  });

  it('encode correctement les caractères spéciaux dans le nom', () => {
    const links = buildExternalLinks('Pro-Q 3 & EQ+', 'FabFilter');
    const googleLink = links.find(l => l.label === 'Rechercher sur Google');
    expect(googleLink?.url).not.toContain(' ');
    expect(googleLink?.url).not.toContain('&');
    expect(googleLink?.url).toContain('FabFilter');
  });

  it('fonctionne sans marque (brand null)', () => {
    const links = buildExternalLinks('UnknownPlugin', null);
    expect(links).toHaveLength(3);
    const googleLink = links.find(l => l.label === 'Rechercher sur Google');
    expect(googleLink?.url).toContain('UnknownPlugin');
    expect(googleLink?.url).not.toContain('null');
  });

  it('utilise la marque dans la requête de recherche', () => {
    const links = buildExternalLinks('VintageVerb', 'Valhalla DSP');
    const googleLink = links.find(l => l.label === 'Rechercher sur Google');
    expect(googleLink?.url).toContain(encodeURIComponent('Valhalla DSP VintageVerb'));
  });

  it('assigne l\'icône search au lien Google', () => {
    const links = buildExternalLinks('Serum', 'Xfer Records');
    const googleLink = links.find(l => l.label === 'Rechercher sur Google');
    expect(googleLink?.icon).toBe('search');
  });

  it('assigne l\'icône external aux autres liens', () => {
    const links = buildExternalLinks('Serum', 'Xfer Records');
    const kvrLink = links.find(l => l.label === 'KVR Audio');
    expect(kvrLink?.icon).toBe('external');
  });
});
