'use client';

import React, { useState, useEffect } from 'react';
import { useFileHandlesStore } from '../../../stores/file-handles-store';
import { useInventoryStore, buildItemId } from '../../../stores/inventory-store';
import { useDeletionLogStore } from '../../../stores/deletion-log-store';
import { deletePlugins } from '../../../lib/plugin-deleter';
import type { DetectedPlugin } from '../../../lib/plugin-scanner';
import type { DeletionResult } from '../../../lib/plugin-deleter';
import { PurgeNoHandle } from '../../../components/purge/PurgeNoHandle';
import { PurgePermissionGate } from '../../../components/purge/PurgePermissionGate';
import { PurgeSelector } from '../../../components/purge/PurgeSelector';
import { PurgeConfirmDialog } from '../../../components/purge/PurgeConfirmDialog';
import { PurgeProgress } from '../../../components/purge/PurgeProgress';
import { PurgeResults } from '../../../components/purge/PurgeResults';
import { PurgeHistory } from '../../../components/purge/PurgeHistory';

type PurgeStep =
  | { step: 'no_handle' }
  | { step: 'permission_needed' }
  | { step: 'selecting'; selectedIds: Set<string> }
  | { step: 'confirming'; selectedPlugins: DetectedPlugin[] }
  | { step: 'deleting'; progress: { current: number; total: number; currentName: string } }
  | { step: 'done'; results: DeletionResult[] };

export default function PurgePage() {
  const { rootDirHandle, rootDirName, writePermissionGranted } = useFileHandlesStore();
  const { markAsDeleted } = useInventoryStore();
  const { log: logDeletion } = useDeletionLogStore();

  const [state, setState] = useState<PurgeStep>({ step: 'no_handle' });

  // Synchronise l'état initial en fonction des handles disponibles
  useEffect(() => {
    if (!rootDirHandle) {
      setState({ step: 'no_handle' });
      return;
    }
    if (!writePermissionGranted) {
      setState({ step: 'permission_needed' });
      return;
    }
    // Si déjà en cours de sélection/confirmation/suppression, ne pas reset
    setState((prev) => {
      if (prev.step === 'selecting' || prev.step === 'confirming' || prev.step === 'deleting' || prev.step === 'done') {
        return prev;
      }
      return { step: 'selecting', selectedIds: new Set() };
    });
  }, [rootDirHandle, writePermissionGranted]);

  const handlePermissionGranted = () => {
    setState({ step: 'selecting', selectedIds: new Set() });
  };

  const handleSelectionChange = (ids: Set<string>) => {
    setState({ step: 'selecting', selectedIds: ids });
  };

  const handleConfirmRequest = (plugins: DetectedPlugin[]) => {
    setState({ step: 'confirming', selectedPlugins: plugins });
  };

  const handleCancelConfirm = () => {
    setState((prev) => {
      if (prev.step === 'confirming') {
        const ids = new Set(prev.selectedPlugins.map((p) => buildItemId(p.nameRaw, p.format)));
        return { step: 'selecting', selectedIds: ids };
      }
      return prev;
    });
  };

  const handleDelete = async () => {
    if (state.step !== 'confirming') return;
    const plugins = state.selectedPlugins;
    if (!rootDirHandle || !rootDirName) return;

    setState({
      step: 'deleting',
      progress: { current: 0, total: plugins.length, currentName: plugins[0]?.nameRaw ?? '' },
    });

    const results: DeletionResult[] = [];

    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      setState({
        step: 'deleting',
        progress: { current: i, total: plugins.length, currentName: plugin.nameRaw },
      });

      const [result] = await deletePlugins(rootDirHandle, [plugin]);
      results.push(result);
    }

    // Mettre à jour l'inventaire : retirer les plugins supprimés avec succès
    const successfulIds = results
      .filter((r) => r.status === 'success')
      .map((r) => buildItemId(r.plugin.nameRaw, r.plugin.format));

    if (successfulIds.length > 0) {
      markAsDeleted(successfulIds);
    }

    // Logger toutes les suppressions (succès, protégés, erreurs)
    const logEntries = results
      .filter((r) => r.status === 'success' || r.status === 'system_protected' || r.status === 'error')
      .map((r) => ({
        id: crypto.randomUUID(),
        pluginName: r.plugin.nameRaw,
        format: r.plugin.format,
        deletedAt: Date.now(),
        rootDirName,
        status: r.status as 'success' | 'system_protected' | 'error',
      }));

    if (logEntries.length > 0) {
      logDeletion(logEntries);
    }

    setState({ step: 'done', results });
  };

  const showHistory = state.step !== 'deleting';

  return (
    <>
      {state.step === 'no_handle' && <PurgeNoHandle />}

      {state.step === 'permission_needed' && (
        <PurgePermissionGate onPermissionGranted={handlePermissionGranted} />
      )}

      {state.step === 'selecting' && (
        <div className="-mx-6 -my-8 md:-my-12">
          <PurgeSelector
            selectedIds={state.selectedIds}
            onSelectionChange={handleSelectionChange}
            onConfirm={handleConfirmRequest}
          />
        </div>
      )}

      {state.step === 'confirming' && (
        <>
          <div className="-mx-6 -my-8 md:-my-12">
            <PurgeSelector
              selectedIds={new Set(state.selectedPlugins.map((p) => buildItemId(p.nameRaw, p.format)))}
              onSelectionChange={() => {}}
              onConfirm={() => {}}
            />
          </div>
          <PurgeConfirmDialog
            plugins={state.selectedPlugins}
            rootDirName={rootDirName ?? ''}
            onConfirm={handleDelete}
            onCancel={handleCancelConfirm}
          />
        </>
      )}

      {state.step === 'deleting' && (
        <PurgeProgress
          current={state.progress.current}
          total={state.progress.total}
          currentName={state.progress.currentName}
        />
      )}

      {state.step === 'done' && <PurgeResults results={state.results} />}

      {showHistory && <PurgeHistory />}
    </>
  );
}
