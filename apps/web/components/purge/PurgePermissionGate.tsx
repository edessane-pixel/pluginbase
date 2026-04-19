'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Unlock } from 'lucide-react';
import { requestWritePermission } from '../../lib/file-permissions';
import { useFileHandlesStore } from '../../stores/file-handles-store';

interface PurgePermissionGateProps {
  onPermissionGranted: () => void;
}

export function PurgePermissionGate({ onPermissionGranted }: PurgePermissionGateProps) {
  const { rootDirHandle, rootDirName, setWritePermission } = useFileHandlesStore();
  const [requesting, setRequesting] = useState(false);
  const [denied, setDenied] = useState(false);

  const handleRequestPermission = async () => {
    if (!rootDirHandle) return;
    setRequesting(true);
    setDenied(false);

    try {
      const result = await requestWritePermission(rootDirHandle);
      if (result === 'granted') {
        setWritePermission(true);
        onPermissionGranted();
      } else {
        setDenied(true);
      }
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 py-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
          Prêt à purger
        </h1>
        <p className="text-[var(--text-secondary)] font-body">
          Une permission supplémentaire est requise avant de pouvoir supprimer des fichiers.
        </p>
      </div>

      <div className="bg-[var(--bg-elevated)] rounded-[10px] border border-[var(--border)] p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Unlock size={18} className="text-[var(--text-secondary)] mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-body text-[var(--text-primary)] font-medium">
              Pour supprimer des fichiers, on a besoin d'une permission supplémentaire du navigateur.
            </p>
            <p className="text-sm font-body text-[var(--text-secondary)]">
              Ce qui va se passer : Chrome te demande d'autoriser l'écriture dans le dossier{' '}
              <code className="font-mono text-[12px] bg-[var(--bg-sunken)] px-1.5 py-0.5 rounded">
                {rootDirName ?? 'sélectionné'}
              </code>
              . Une fois accordée, une bannière restera en haut de ta fenêtre pour te le rappeler.
              Tu peux révoquer à tout moment.
            </p>
            <p className="text-sm font-body text-[var(--text-secondary)]">
              Rien ne sera supprimé tant que tu n'auras pas sélectionné les plugins{' '}
              <strong>ET</strong> confirmé deux fois.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-[var(--status-learn-bg)] rounded-[6px] p-3">
          <AlertTriangle size={16} className="text-[var(--status-learn)] mt-0.5 flex-shrink-0" />
          <p className="text-xs font-body text-[var(--status-learn)]">
            Les suppressions sont <strong>irréversibles</strong>. Tu devras réinstaller les plugins
            depuis leurs installateurs d'origine si tu les veux à nouveau.
          </p>
        </div>
      </div>

      {denied && (
        <div className="bg-[var(--status-doublon-bg)] border border-[var(--border)] rounded-[10px] p-4 flex items-center gap-3">
          <AlertTriangle size={16} className="text-[var(--status-doublon)]" />
          <p className="text-sm font-body text-[var(--status-doublon)]">
            Permission refusée. Tu peux réessayer en cliquant à nouveau sur le bouton.
          </p>
        </div>
      )}

      <button
        onClick={handleRequestPermission}
        disabled={requesting}
        className="flex items-center gap-2 px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-[6px] font-display font-bold text-base transition-all transform hover:scale-[1.02] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        <ShieldCheck size={18} />
        {requesting ? 'Demande en cours…' : 'Autoriser la suppression'}
      </button>
    </div>
  );
}
