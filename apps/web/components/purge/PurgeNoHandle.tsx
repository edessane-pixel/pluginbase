'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ScanLine, RefreshCw } from 'lucide-react';

export function PurgeNoHandle() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 max-w-lg mx-auto">
      <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center">
        <Trash2 size={32} className="text-[var(--text-muted)]" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
          Purge : supprimer des plugins
        </h1>
        <p className="text-[var(--text-secondary)] font-body leading-relaxed">
          Pour supprimer des plugins, tu dois d'abord les scanner. Le navigateur
          a besoin de l'accès au dossier qui les contient.
        </p>
      </div>

      <div className="w-full bg-[var(--bg-elevated)] rounded-[10px] border border-[var(--border)] p-5 text-left space-y-2">
        <div className="flex items-start gap-3">
          <RefreshCw size={16} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
          <p className="text-sm font-body text-[var(--text-secondary)]">
            Si tu as déjà scanné, il faut re-scanner — les autorisations d'accès
            aux dossiers ne survivent pas à un refresh de page.
          </p>
        </div>
      </div>

      <Link
        href="/scan"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-[6px] font-display font-bold text-base transition-all transform hover:scale-[1.02] shadow-sm"
      >
        <ScanLine size={18} />
        Aller scanner
      </Link>
    </div>
  );
}
