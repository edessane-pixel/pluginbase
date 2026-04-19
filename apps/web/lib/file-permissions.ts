/**
 * Résultats possibles d'une demande de permission d'écriture.
 */
export type WritePermissionState = 'granted' | 'denied' | 'no-handle';

/**
 * Extension de l'API File System Access pour les méthodes de permission
 * qui ne sont pas encore dans les types TypeScript standard.
 */
interface FileSystemHandleWithPermission extends FileSystemDirectoryHandle {
  queryPermission(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
  requestPermission(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

/**
 * Demande une permission d'écriture sur un handle de dossier existant.
 * DOIT être appelé depuis un gestionnaire d'événement utilisateur (clic, etc.)
 * pour satisfaire l'exigence d'activation du navigateur.
 *
 * Cette fonction peut upgrader la permission d'un handle read-only
 * sans nécessiter un nouveau showDirectoryPicker().
 */
export async function requestWritePermission(
  handle: FileSystemDirectoryHandle
): Promise<WritePermissionState> {
  const h = handle as FileSystemHandleWithPermission;
  const current = await h.queryPermission({ mode: 'readwrite' });
  if (current === 'granted') return 'granted';

  const requested = await h.requestPermission({ mode: 'readwrite' });
  return requested === 'granted' ? 'granted' : 'denied';
}
