'use client';

import React from 'react';
import { Info } from 'lucide-react';
import type { ResolvedDescription } from '@/lib/plugin-description-generator';

interface AboutBlockProps {
  resolved: ResolvedDescription;
}

export function AboutBlock({ resolved }: AboutBlockProps) {
  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-6 space-y-4">
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
        À PROPOS
      </h2>

      {resolved.source === 'unknown' ? (
        <div className="flex items-start gap-3 bg-[var(--bg-elevated)] rounded-[8px] px-4 py-3">
          <Info size={16} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" />
          <p className="font-body text-[15px] text-[var(--text-secondary)] leading-relaxed">
            {resolved.text}
          </p>
        </div>
      ) : (
        <p className="font-body text-[15px] text-[var(--text-primary)] leading-relaxed">
          {resolved.text}
        </p>
      )}
    </section>
  );
}
