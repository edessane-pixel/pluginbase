import type { DetectedPlugin } from './plugin-scanner';

export type { DetectedPlugin };

/**
 * Résultat de la tentative de suppression d'un plugin.
 */
export interface DeletionResult {
  plugin: DetectedPlugin;
  status:
    | 'success'
    | 'system_protected'
    | 'handle_lost'
    | 'permission_denied'
    | 'not_found'
    | 'error';
  error?: string;
}

/**
 * Supprime une liste de plugins depuis un handle de dossier racine.
 *
 * Fonction PURE : elle ne touche pas au state React/Zustand,
 * elle retourne uniquement les résultats.
 *
 * Supporte les chemins relatifs imbriqués (ex: "Brand/Plugin.vst3")
 * en naviguant dans les sous-dossiers intermédiaires.
 */
export async function deletePlugins(
  rootHandle: FileSystemDirectoryHandle,
  plugins: DetectedPlugin[]
): Promise<DeletionResult[]> {
  const results: DeletionResult[] = [];

  for (const plugin of plugins) {
    try {
      const parts = plugin.relativePath.split('/');
      const fileName = parts[parts.length - 1];
      let currentHandle: FileSystemDirectoryHandle = rootHandle;

      // Naviguer vers le dossier parent si le chemin contient des sous-dossiers
      for (const part of parts.slice(0, -1)) {
        currentHandle = await currentHandle.getDirectoryHandle(part);
      }

      await currentHandle.removeEntry(fileName, { recursive: true });
      results.push({ plugin, status: 'success' });
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'SecurityError' || err.name === 'NotAllowedError') {
          results.push({ plugin, status: 'system_protected' });
          continue;
        }
        if (err.name === 'NotFoundError') {
          results.push({ plugin, status: 'not_found' });
          continue;
        }
        if (err.name === 'InvalidStateError') {
          results.push({ plugin, status: 'handle_lost' });
          continue;
        }
      }
      results.push({
        plugin,
        status: 'error',
        error: err instanceof Error ? err.message : 'unknown',
      });
    }
  }

  return results;
}
