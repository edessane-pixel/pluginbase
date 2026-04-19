'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface PurgeProgressProps {
  current: number;
  total: number;
  currentName: string;
}

export function PurgeProgress({ current, total, currentName }: PurgeProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="max-w-lg mx-auto space-y-8 py-16 text-center">
      <div className="w-16 h-16 bg-[var(--status-doublon-bg)] rounded-full flex items-center justify-center mx-auto">
        <Loader2 size={28} className="text-[var(--status-doublon)] animate-spin" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
          Suppression en cours…
        </h2>
        <p className="font-mono text-sm text-[var(--text-muted)]">
          Suppression de <span className="text-[var(--text-primary)]">{currentName}</span>
        </p>
      </div>

      <div className="space-y-2">
        <div className="w-full h-2 bg-[var(--bg-sunken)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--status-doublon)] rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="font-mono text-[11px] text-[var(--text-muted)]">
          {current} / {total}
        </p>
      </div>
    </div>
  );
}
