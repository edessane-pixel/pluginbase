import { describe, it, expect, vi } from 'vitest';
import { deletePlugins } from '../plugin-deleter';
import type { DetectedPlugin } from '../plugin-scanner';

function makePlugin(overrides: Partial<DetectedPlugin> = {}): DetectedPlugin {
  return {
    nameRaw: 'TestPlugin',
    format: 'VST3',
    relativePath: 'TestPlugin.vst3',
    parentDirName: 'VST3',
    ...overrides,
  };
}

function makeMockHandle(
  removeEntry: (name: string, opts?: FileSystemRemoveOptions) => Promise<void>
): FileSystemDirectoryHandle {
  return {
    kind: 'directory',
    name: 'VST3',
    isSameEntry: vi.fn(),
    getDirectoryHandle: vi.fn(),
    getFileHandle: vi.fn(),
    removeEntry,
    resolve: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    [Symbol.asyncIterator]: vi.fn(),
    queryPermission: vi.fn(),
    requestPermission: vi.fn(),
  } as unknown as FileSystemDirectoryHandle;
}

describe('deletePlugins', () => {
  it('retourne status success quand removeEntry réussit', async () => {
    const removeEntry = vi.fn().mockResolvedValue(undefined);
    const handle = makeMockHandle(removeEntry);
    const plugin = makePlugin();

    const results = await deletePlugins(handle, [plugin]);

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('success');
    expect(results[0].plugin).toBe(plugin);
    expect(removeEntry).toHaveBeenCalledWith('TestPlugin.vst3', { recursive: true });
  });

  it('retourne status system_protected sur SecurityError', async () => {
    const err = new DOMException('Blocked', 'SecurityError');
    const removeEntry = vi.fn().mockRejectedValue(err);
    const handle = makeMockHandle(removeEntry);
    const plugin = makePlugin();

    const results = await deletePlugins(handle, [plugin]);

    expect(results[0].status).toBe('system_protected');
  });

  it('retourne status system_protected sur NotAllowedError', async () => {
    const err = new DOMException('Not Allowed', 'NotAllowedError');
    const removeEntry = vi.fn().mockRejectedValue(err);
    const handle = makeMockHandle(removeEntry);
    const plugin = makePlugin();

    const results = await deletePlugins(handle, [plugin]);

    expect(results[0].status).toBe('system_protected');
  });

  it('retourne status not_found sur NotFoundError', async () => {
    const err = new DOMException('Not Found', 'NotFoundError');
    const removeEntry = vi.fn().mockRejectedValue(err);
    const handle = makeMockHandle(removeEntry);
    const plugin = makePlugin();

    const results = await deletePlugins(handle, [plugin]);

    expect(results[0].status).toBe('not_found');
  });

  it('retourne status error avec message sur erreur inconnue', async () => {
    const removeEntry = vi.fn().mockRejectedValue(new Error('disque plein'));
    const handle = makeMockHandle(removeEntry);
    const plugin = makePlugin();

    const results = await deletePlugins(handle, [plugin]);

    expect(results[0].status).toBe('error');
    expect(results[0].error).toBe('disque plein');
  });

  it('retourne status error avec "unknown" si l\'erreur n\'est pas une Error', async () => {
    const removeEntry = vi.fn().mockRejectedValue('oops');
    const handle = makeMockHandle(removeEntry);
    const plugin = makePlugin();

    const results = await deletePlugins(handle, [plugin]);

    expect(results[0].status).toBe('error');
    expect(results[0].error).toBe('unknown');
  });

  it('traite plusieurs plugins et retourne un résultat par plugin', async () => {
    let callCount = 0;
    const removeEntry = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 2) return Promise.reject(new DOMException('Blocked', 'SecurityError'));
      return Promise.resolve();
    });
    const handle = makeMockHandle(removeEntry);

    const plugins = [
      makePlugin({ nameRaw: 'Plugin1', relativePath: 'Plugin1.vst3' }),
      makePlugin({ nameRaw: 'Plugin2', relativePath: 'Plugin2.vst3' }),
      makePlugin({ nameRaw: 'Plugin3', relativePath: 'Plugin3.vst3' }),
    ];

    const results = await deletePlugins(handle, plugins);

    expect(results).toHaveLength(3);
    expect(results[0].status).toBe('success');
    expect(results[1].status).toBe('system_protected');
    expect(results[2].status).toBe('success');
  });

  it('navigue dans les sous-dossiers pour les chemins imbriqués', async () => {
    const removeEntry = vi.fn().mockResolvedValue(undefined);
    const subHandle = makeMockHandle(removeEntry);
    const getDirectoryHandle = vi.fn().mockResolvedValue(subHandle);

    const rootHandle = {
      ...makeMockHandle(removeEntry),
      getDirectoryHandle,
    } as unknown as FileSystemDirectoryHandle;

    const plugin = makePlugin({ relativePath: 'Brand/Plugin.vst3' });

    const results = await deletePlugins(rootHandle, [plugin]);

    expect(getDirectoryHandle).toHaveBeenCalledWith('Brand');
    expect(removeEntry).toHaveBeenCalledWith('Plugin.vst3', { recursive: true });
    expect(results[0].status).toBe('success');
  });
});
