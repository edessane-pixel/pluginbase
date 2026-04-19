import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Entrée du journal de suppression — trace irréversible d'une suppression de fichier.
 */
export interface DeletionLogEntry {
  id: string;
  pluginName: string;
  format: string;
  /** Timestamp Unix (ms) */
  deletedAt: number;
  /** Nom du dossier racine dans lequel la suppression a eu lieu */
  rootDirName: string;
  status: 'success' | 'system_protected' | 'error';
}

interface DeletionLogState {
  entries: DeletionLogEntry[];
  log: (newEntries: DeletionLogEntry[]) => void;
  clear: () => void;
}

export const useDeletionLogStore = create<DeletionLogState>()(
  persist(
    (set) => ({
      entries: [],

      log: (newEntries) =>
        set((state) => ({
          entries: [...newEntries, ...state.entries],
        })),

      clear: () => set({ entries: [] }),
    }),
    {
      name: 'pluginbase-deletion-log-v1',
    }
  )
);
