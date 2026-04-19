'use client';

import React, { useState } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { useDeletionLogStore } from '../../stores/deletion-log-store';

const MAX_ENTRIES = 20;

const STATUS_LABELS = {
  success: 'Supprimé',
  system_protected: 'Protégé système',
  error: 'Erreur',
} as const;

const STATUS_COLORS = {
  success: 'bg-[var(--status-essential-bg)] text-[var(--status-essential)]',
  system_protected: 'bg-[var(--status-learn-bg)] text-[var(--status-learn)]',
  error: 'bg-[var(--status-doublon-bg)] text-[var(--status-doublon)]',
} as const;

export function PurgeHistory() {
  const { entries, clear } = useDeletionLogStore();
  const [confirming, setConfirming] = useState(false);

  if (entries.length === 0) return null;

  const displayed = entries.slice(0, MAX_ENTRIES);

  const handleClear = () => {
    if (confirming) {
      clear();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-16 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[var(--text-muted)]" />
          <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
            Historique des suppressions
          </h2>
          <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded">
            {entries.length}
          </span>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--status-doublon)] transition-colors"
        >
          <Trash2 size={12} />
          {confirming ? 'Confirmer l\'effacement ?' : 'Effacer l\'historique'}
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-[10px] border border-[var(--border)] overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {displayed.map((entry) => (
            <div key={entry.id} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-medium text-sm text-[var(--text-primary)]">
                    {entry.pluginName}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {entry.format}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {formatDate(entry.deletedAt)}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    · {entry.rootDirName}
                  </span>
                </div>
              </div>
              <span className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[4px] flex-shrink-0 ${STATUS_COLORS[entry.status]}`}>
                {STATUS_LABELS[entry.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
