'use client';
// TEMPORARY DEBUG PAGE — DELETE AFTER TESTING
import React from 'react';
import { AboutBlock } from '../../../components/plugin/AboutBlock';
import { ExternalLinksBlock } from '../../../components/plugin/ExternalLinksBlock';
import { InCollectionBlock } from '../../../components/plugin/InCollectionBlock';
import type { ResolvedDescription } from '../../../lib/plugin-description-generator';
import type { SimilarGroup } from '../../../lib/similar-plugins';
import type { ExternalLink } from '../../../lib/external-search';

const mockResolved: ResolvedDescription = {
  source: 'curated',
  text: "Serum, c'est LE synthétiseur wavetable moderne. Pensé pour la production électronique.",
};

const mockSimilarGroup: SimilarGroup = {
  totalInCategory: 3,
  samples: [
    { id: 'vst3-vital', nameRaw: 'Vital', format: 'VST3', brand: 'Vital Audio', displayName: 'Vital', category: 'Synth', status: 'TO_TEST', favorite: false, personalNote: '', customTags: [] },
    { id: 'vst3-massive-x', nameRaw: 'Massive X', format: 'VST3', brand: 'Native Instruments', displayName: 'Massive X', category: 'Synth', status: 'UNCLASSIFIED', favorite: true, personalNote: '', customTags: [] },
  ],
};

const mockLinks: ExternalLink[] = [
  { label: 'Site du fabricant', url: 'https://xferrecords.com/products/serum', icon: 'external' },
  { label: 'Rechercher sur Google', url: 'https://www.google.com/search?q=Xfer+Records+Serum', icon: 'search' },
  { label: 'KVR Audio', url: 'https://www.kvraudio.com/search?q=Serum', icon: 'external' },
];

export default function DebugBlocksPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
        Debug: Block Rendering Test
      </h1>
      <p className="font-body text-sm text-[var(--text-muted)]">
        This page tests the 3 enrichment blocks with hardcoded data.
      </p>

      <AboutBlock resolved={mockResolved} />

      <InCollectionBlock similarGroup={mockSimilarGroup} categoryKey="Synth" />

      <ExternalLinksBlock links={mockLinks} source={mockResolved.source} />

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-700 font-mono text-sm">
          If you can see the 3 blocks above, the components render correctly.
        </p>
      </div>
    </div>
  );
}
