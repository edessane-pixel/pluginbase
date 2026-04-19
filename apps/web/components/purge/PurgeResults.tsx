'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, XCircle, Copy } from 'lucide-react';
import type { DeletionResult } from '../../lib/plugin-deleter';

const STATUS_LABELS: Record<DeletionResult['status'], string> = {
  success: 'Supprimé',
  system_protected: 'Protégé système',
  handle_lost: 'Handle perdu',
  permission_denied: 'Permission refusée',
  not_found: 'Introuvable',
  error: 'Erreur',
};

interface PurgeResultsProps {
  results: DeletionResult[];
}

export function PurgeResults({ results }: PurgeResultsProps) {
  const [copied, setCopied] = useState(false);

  const successCount = results.filter((r) => r.status === 'success').length;
  const protectedCount = results.filter((r) => r.status === 'system_protected').length;
  const errorCount = results.filter(
    (r) => r.status !== 'success' && r.status !== 'system_protected'
  ).length;

  const protectedPlugins = results.filter((r) => r.status === 'system_protected');

  const copyProtectedList = () => {
    const text = protectedPlugins.map((r) => r.plugin.relativePath).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Presse-papiers non disponible — ignorer silencieusement
    });
  };

  const getStatusColor = (status: DeletionResult['status']) => {
    if (status === 'success') return 'bg-[var(--status-essential-bg)] text-[var(--status-essential)]';
    if (status === 'system_protected') return 'bg-[var(--status-learn-bg)] text-[var(--status-learn)]';
    return 'bg-[var(--status-doublon-bg)] text-[var(--status-doublon)]';
  };

  const getStatusIcon = (status: DeletionResult['status']) => {
    if (status === 'success') return <CheckCircle2 size={14} />;
    if (status === 'system_protected') return <AlertTriangle size={14} />;
    return <XCircle size={14} />;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
          Purge terminée
        </h1>
        <p className="font-mono text-sm text-[var(--text-secondary)]">
          <span className="text-[var(--status-essential)] font-bold">{successCount} supprimés</span>
          {protectedCount > 0 && (
            <span className="text-[var(--status-learn)] font-bold"> · {protectedCount} protégés par le système</span>
          )}
          {errorCount > 0 && (
            <span className="text-[var(--status-doublon)] font-bold"> · {errorCount} erreur{errorCount > 1 ? 's' : ''}</span>
          )}
        </p>
      </div>

      {protectedCount > 0 && (
        <div className="bg-[var(--status-learn-bg)] rounded-[10px] border border-[var(--border)] p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-[var(--status-learn)] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-body text-sm text-[var(--status-learn)] font-medium">
                Certains plugins sont dans des dossiers système (Program Files). Chrome refuse leur suppression.
              </p>
              <p className="font-body text-sm text-[var(--status-learn)]">
                Pour ceux-là, utilise le désinstalleur Windows ou supprime-les manuellement depuis l'Explorateur.
              </p>
            </div>
          </div>
          <button
            onClick={copyProtectedList}
            className="flex items-center gap-2 text-xs font-mono text-[var(--status-learn)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Copy size={12} />
            {copied ? 'Copié !' : 'Copier la liste des plugins protégés'}
          </button>
        </div>
      )}

      {/* Liste des résultats */}
      <div className="bg-[var(--bg-surface)] rounded-[10px] border border-[var(--border)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
            Détail des résultats
          </h3>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
          {results.map((result, idx) => (
            <div key={idx} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <span className="font-display font-medium text-sm text-[var(--text-primary)]">
                  {result.plugin.nameRaw}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)] ml-2">
                  {result.plugin.relativePath}
                </span>
                {result.error && (
                  <p className="font-mono text-[10px] text-[var(--status-doublon)] mt-0.5">
                    {result.error}
                  </p>
                )}
              </div>
              <span className={`flex items-center gap-1 font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[4px] flex-shrink-0 ${getStatusColor(result.status)}`}>
                {getStatusIcon(result.status)}
                {STATUS_LABELS[result.status]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/inventaire"
          className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-[6px] font-display font-bold text-sm transition-all"
        >
          Retour à l'inventaire
        </Link>
        <p className="text-xs font-body text-[var(--text-muted)]">
          Ta liste de plugins se mettra à jour au prochain scan.
        </p>
      </div>
    </div>
  );
}
