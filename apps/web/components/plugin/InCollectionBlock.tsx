'use client';

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { CATEGORY_KNOWLEDGE } from '@/lib/category-knowledge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { SimilarGroup } from '@/lib/similar-plugins';

interface InCollectionBlockProps {
  similarGroup: SimilarGroup;
  categoryKey: string | null;
}

export function InCollectionBlock({ similarGroup, categoryKey }: InCollectionBlockProps) {
  const catKnowledge = categoryKey ? CATEGORY_KNOWLEDGE[categoryKey.toUpperCase()] : null;
  const categoryLabel = catKnowledge?.label ?? categoryKey ?? 'plugins';

  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-6 space-y-4">
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
        DANS TA COLLECTION
      </h2>

      <div className="space-y-1">
        <p className="font-display text-[18px] font-semibold text-[var(--text-primary)]">
          Tu as {similarGroup.totalInCategory} autre{similarGroup.totalInCategory > 1 ? 's' : ''}{' '}
          {categoryLabel.toLowerCase()}
        </p>
        <p className="font-body text-[15px] text-[var(--text-secondary)] italic">
          Lequel est vraiment ton essentiel&nbsp;?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {similarGroup.samples.map(plugin => (
          <Link
            key={plugin.id}
            href={`/plugin/${encodeURIComponent(plugin.id)}`}
            className="group block border border-[var(--border)] rounded-[8px] p-3 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] transition-all duration-150 ease-out"
          >
            <p className="font-display text-[14px] font-medium text-[var(--text-primary)] truncate">
              {plugin.displayName}
            </p>
            <p className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
              {plugin.brand ?? 'Marque inconnue'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={plugin.status} />
              {plugin.favorite && (
                <Star size={12} className="text-[#F5A623]" fill="#F5A623" />
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-1">
        <Link
          href="/inventaire"
          className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          Voir tous les {categoryLabel.toLowerCase()} →
        </Link>
      </div>
    </section>
  );
}
