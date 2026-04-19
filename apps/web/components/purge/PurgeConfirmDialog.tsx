'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';
import type { DetectedPlugin } from '../../lib/plugin-scanner';

const CONFIRMATION_WORD = 'SUPPRIMER';

interface PurgeConfirmDialogProps {
  plugins: DetectedPlugin[];
  rootDirName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PurgeConfirmDialog({
  plugins,
  rootDirName,
  onConfirm,
  onCancel,
}: PurgeConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText === CONFIRMATION_WORD;

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[var(--bg-sunken)] bg-opacity-90 z-50" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="relative bg-[var(--bg-surface)] rounded-[14px] border border-[var(--border)] shadow-lg w-full max-w-2xl my-auto">
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="p-8 space-y-6">
              <Dialog.Title className="font-display font-bold text-2xl text-[var(--text-primary)]">
                Confirmer la suppression de {plugins.length} plugin{plugins.length > 1 ? 's' : ''}
              </Dialog.Title>

              {/* Avertissement critique */}
              <div
                className="bg-[var(--status-doublon-bg)] rounded-[10px] p-6 space-y-2 border border-[var(--border)]"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-[var(--status-doublon)] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-body font-bold text-[var(--status-doublon)] text-sm">
                      Cette action est IRRÉVERSIBLE.
                    </p>
                    <p className="font-body text-[var(--status-doublon)] text-sm">
                      Ces plugins seront supprimés définitivement de ton disque :{' '}
                      <code className="font-mono text-[12px]">{rootDirName}</code>.
                    </p>
                    <p className="font-body text-[var(--status-doublon)] text-sm">
                      Tu ne pourras PAS les récupérer avec PluginBase. Tu devras les réinstaller
                      depuis leurs installateurs d'origine si tu les veux à nouveau.
                    </p>
                  </div>
                </div>
              </div>

              {/* Liste récapitulative */}
              <div className="space-y-2">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                  Plugins à supprimer
                </h3>
                <div className="max-h-48 overflow-y-auto bg-[var(--bg-elevated)] rounded-[6px] border border-[var(--border)] divide-y divide-[var(--border)]">
                  {plugins.map((p) => (
                    <div key={`${p.format}-${p.nameRaw}`} className="px-4 py-2 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-display font-medium text-sm text-[var(--text-primary)]">
                          {p.nameRaw}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)] ml-2">
                          {p.relativePath}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] flex-shrink-0">
                        {p.format}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Champ de confirmation */}
              <div className="space-y-2">
                <label className="font-body text-sm text-[var(--text-primary)]">
                  Pour confirmer, tape{' '}
                  <code className="font-mono font-bold text-[var(--status-doublon)]">
                    {CONFIRMATION_WORD}
                  </code>{' '}
                  en majuscules :
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={CONFIRMATION_WORD}
                  autoComplete="off"
                  className="w-full bg-[var(--bg-sunken)] border border-[var(--border)] rounded-[6px] px-4 py-3 font-mono text-base focus:outline-none focus:border-[var(--status-doublon)] transition-colors"
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-[6px] font-display font-bold text-sm transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  disabled={!isConfirmed}
                  className="px-6 py-3 bg-[var(--status-doublon)] hover:bg-[#a93226] text-white rounded-[6px] font-display font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
