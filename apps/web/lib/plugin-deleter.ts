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

type NavigationResult =
  | { ok: true; handle: FileSystemDirectoryHandle }
  | { ok: false; status: DeletionResult['status'] };

/**
 * Navigue vers un sous-dossier intermédiaire depuis un handle racine.
 * Retourne le handle du sous-dossier ou un statut d'erreur.
 */
async function navigateToParent(
  rootHandle: FileSystemDirectoryHandle,
  pathParts: string[]
): Promise<NavigationResult> {
  let current: FileSystemDirectoryHandle = rootHandle;
  for (const part of pathParts) {
    try {
      current = await current.getDirectoryHandle(part);
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === 'NotFoundError') return { ok: false, status: 'not_found' };
        if (err.name === 'SecurityError' || err.name === 'NotAllowedError') {
          return { ok: false, status: 'system_protected' };
        }
        if (err.name === 'InvalidStateError') return { ok: false, status: 'handle_lost' };
      }
      return { ok: false, status: 'error' };
    }
  }
  return { ok: true, handle: current };
}

function classifyDOMError(err: DOMException): DeletionResult['status'] {
  if (err.name === 'SecurityError' || err.name === 'NotAllowedError') return 'system_protected';
  if (err.name === 'NotFoundError') return 'not_found';
  if (err.name === 'InvalidStateError') return 'handle_lost';
  return 'error';
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
      const parentParts = parts.slice(0, -1);

      const nav = await navigateToParent(rootHandle, parentParts);
      if (!nav.ok) {
        results.push({ plugin, status: nav.status });
        continue;
      }

      await nav.handle.removeEntry(fileName, { recursive: true });
      results.push({ plugin, status: 'success' });
    } catch (err) {
      if (err instanceof DOMException) {
        results.push({ plugin, status: classifyDOMError(err) });
        continue;
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
