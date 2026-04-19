/**
 * Type décrivant l'issue d'une tentative de sélection de dossier
 */
export type PickerOutcome =
  | { status: 'ok'; dirHandle: FileSystemDirectoryHandle }
  | { status: 'cancelled' }
  | { status: 'blocked_by_browser' }
  | { status: 'unknown_error'; error: unknown };

/**
 * Représente un plugin détecté lors d'un scan, avec les informations nécessaires
 * pour le retrouver et le supprimer sur le disque.
 */
export interface DetectedPlugin {
  nameRaw: string;
  format: string;
  /** Chemin relatif depuis le dossier racine sélectionné, ex: "Serum_x64.vst3" ou "Brand/Plugin.vst3" */
  relativePath: string;
  /** Nom du dossier racine sélectionné lors du scan, ex: "VST3" */
  parentDirName: string;
}

/**
 * Résultat complet d'un scan de dossier.
 */
export interface ScanOutcome {
  plugins: DetectedPlugin[];
  skipped: number;
  cancelled: boolean;
  /** Handle du dossier racine sélectionné (non sérialisable, volatile) */
  rootDirHandle?: FileSystemDirectoryHandle;
  /** Nom du dossier racine, ex: "VST3" */
  rootDirName?: string;
}

/**
 * Encapsule showDirectoryPicker avec une gestion fine des erreurs de sécurité/annulation
 */
export async function openDirectoryPicker(): Promise<PickerOutcome> {
  try {
    const dirHandle = await window.showDirectoryPicker({ 
      mode: 'read',
      startIn: 'desktop'
    });
    return { status: 'ok', dirHandle };
  } catch (err) {
    if (err instanceof DOMException) {
      // Chrome renvoie AbortError si l'utilisateur clique sur "Annuler"
      // MAIS AUSSI s'il clique sur "Annuler" après le message "Contient des fichiers système"
      if (err.name === 'AbortError') return { status: 'cancelled' };
      
      // SecurityError ou NotAllowedError pour les dossiers système bloqués (ex: C:\Windows)
      if (err.name === 'SecurityError' || err.name === 'NotAllowedError') {
        return { status: 'blocked_by_browser' };
      }
    }
    return { status: 'unknown_error', error: err };
  }
}
