'use client';

import React from 'react';
import { Search, ExternalLink } from 'lucide-react';
import type { ExternalLink as ExternalLinkType } from '@/lib/external-search';
import type { ResolvedDescription } from '@/lib/plugin-description-generator';

interface ExternalLinksBlockProps {
  links: ExternalLinkType[];
  source: ResolvedDescription['source'];
}

export function ExternalLinksBlock({ links, source }: ExternalLinksBlockProps) {
  return (
    <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[10px] p-4 space-y-3">
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
        EN SAVOIR PLUS
      </h2>

      {source === 'unknown' && (
        <p className="font-body text-[13px] text-[var(--text-muted)] leading-relaxed">
          Aide-nous à améliorer PluginBase : utilise ces liens pour identifier ce plugin, et dis-nous ce que tu trouves.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {links.map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[6px] font-body text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-sunken)] hover:border-[var(--border-strong)] transition-all duration-150 ease-out"
          >
            {link.icon === 'search' ? (
              <Search size={14} className="text-[var(--text-muted)]" />
            ) : (
              <ExternalLink size={14} className="text-[var(--text-muted)]" />
            )}
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
