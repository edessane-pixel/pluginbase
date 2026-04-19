import { create } from 'zustand';

/**
 * Store VOLATILE (sans persist) pour les handles de fichiers système.
 * Les FileSystemDirectoryHandle ne sont pas sérialisables et disparaissent
 * au refresh de la page — c'est intentionnel et requis par le navigateur.
 */
interface FileHandlesState {
  rootDirHandle: FileSystemDirectoryHandle | null;
  rootDirName: string | null;
  writePermissionGranted: boolean;
  /** Mapping itemId → relativePath depuis le dernier scan */
  pluginPathMap: Map<string, string>;
  setRoot: (handle: FileSystemDirectoryHandle, name: string) => void;
  clearRoot: () => void;
  setWritePermission: (granted: boolean) => void;
  setPluginPathMap: (map: Map<string, string>) => void;
}

export const useFileHandlesStore = create<FileHandlesState>()((set) => ({
  rootDirHandle: null,
  rootDirName: null,
  writePermissionGranted: false,
  pluginPathMap: new Map(),

  setRoot: (handle, name) =>
    set({ rootDirHandle: handle, rootDirName: name }),

  clearRoot: () =>
    set({
      rootDirHandle: null,
      rootDirName: null,
      writePermissionGranted: false,
      pluginPathMap: new Map(),
    }),

  setWritePermission: (granted) =>
    set({ writePermissionGranted: granted }),

  setPluginPathMap: (map) =>
    set({ pluginPathMap: map }),
}));
