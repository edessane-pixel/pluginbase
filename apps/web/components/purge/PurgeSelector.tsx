'use client';

import React, { useState, useMemo } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useInventoryStore, InventoryItem, PluginStatus } from '../../stores/inventory-store';
import { useFileHandlesStore } from '../../stores/file-handles-store';
import type { DetectedPlugin } from '../../lib/plugin-scanner';

const STATUS_LABELS: Record<PluginStatus, string> = {
  ESSENTIAL: 'Essentiel',
  DOUBLON: 'Doublon',
  UNUSED: 'Inutilisé',
  TO_LEARN: 'À apprendre',
  TO_SELL: 'À vendre',
  TO_TEST: 'À tester',
  UNCLASSIFIED: 'Non classifié',
};

interface PurgeSelectorProps {
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onConfirm: (plugins: DetectedPlugin[]) => void;
}

export function PurgeSelector({ selectedIds, onSelectionChange, onConfirm }: PurgeSelectorProps) {
  const items = useInventoryStore((s) => s.items);
  const { rootDirHandle, rootDirName, pluginPathMap } = useFileHandlesStore();

  const [statusFilter, setStatusFilter] = useState<Set<PluginStatus>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((i) => { if (i.category) cats.add(i.category); });
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter.size > 0 && !statusFilter.has(item.status)) return false;
      if (categoryFilter.size > 0 && (!item.category || !categoryFilter.has(item.category))) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !item.displayName.toLowerCase().includes(q) &&
          !(item.brand ?? '').toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [items, statusFilter, categoryFilter, search]);

  const toggleStatus = (s: PluginStatus) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const toggleCategory = (c: string) => {
    setCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  };

  const selectByStatus = (status: PluginStatus) => {
    const next = new Set(selectedIds);
    items.filter((i) => i.status === status && pluginPathMap.has(i.id)).forEach((i) => next.add(i.id));
    onSelectionChange(next);
  };

  const deselectAll = () => onSelectionChange(new Set());

  const toggleItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    onSelectionChange(next);
  };

  const isInScope = (item: InventoryItem) => pluginPathMap.has(item.id);

  const handleConfirm = () => {
    if (!rootDirHandle || !rootDirName) return;
    const plugins: DetectedPlugin[] = Array.from(selectedIds)
      .map((id) => {
        const item = items.find((i) => i.id === id);
        if (!item) return null;
        const relativePath = pluginPathMap.get(id) ?? item.nameRaw;
        return {
          nameRaw: item.nameRaw,
          format: item.format,
          relativePath,
          parentDirName: rootDirName,
        } satisfies DetectedPlugin;
      })
      .filter((p): p is DetectedPlugin => p !== null);
    onConfirm(plugins);
  };

  return (
    <div className="flex gap-0 min-h-[calc(100vh-64px-200px)]">
      {/* Sidebar filtres */}
      <aside className="w-[220px] flex-shrink-0 bg-[var(--bg-elevated)] border-r border-[var(--border)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-3">
            Sélection rapide
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => selectByStatus('DOUBLON')}
              className="w-full text-left text-xs font-body text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors py-1"
            >
              Tous les Doublons
            </button>
            <button
              onClick={() => selectByStatus('UNUSED')}
              className="w-full text-left text-xs font-body text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors py-1"
            >
              Tous les Inutilisés
            </button>
            <button
              onClick={() => selectByStatus('TO_SELL')}
              className="w-full text-left text-xs font-body text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors py-1"
            >
              Tous les À vendre
            </button>
            <button
              onClick={deselectAll}
              className="w-full text-left text-xs font-mono text-[var(--text-muted)] hover:text-[var(--status-doublon)] transition-colors py-1 flex items-center gap-1"
            >
              <X size={10} /> Tout désélectionner
            </button>
          </div>
        </div>

        {/* Filtre statut */}
        <div className="p-4 border-b border-[var(--border)] space-y-2">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">Statut</h4>
          {(Object.keys(STATUS_LABELS) as PluginStatus[]).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={statusFilter.has(s)}
                onChange={() => toggleStatus(s)}
                className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[var(--accent)]"
              />
              <span className="text-xs font-body text-[var(--text-primary)]">{STATUS_LABELS[s]}</span>
            </label>
          ))}
        </div>

        {/* Filtre catégorie */}
        {categories.length > 0 && (
          <div className="p-4 border-b border-[var(--border)] space-y-2">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">Catégorie</h4>
            {categories.map((c) => (
              <label key={c} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryFilter.has(c)}
                  onChange={() => toggleCategory(c)}
                  className="w-3.5 h-3.5 rounded border-[var(--border)] accent-[var(--accent)]"
                />
                <span className="text-xs font-body text-[var(--text-primary)]">{c}</span>
              </label>
            ))}
          </div>
        )}

        {/* Compteur */}
        <div className="mt-auto p-4 border-t border-[var(--border)]">
          <p className="font-mono text-[11px] text-[var(--text-secondary)]">
            <span className="text-[var(--text-primary)] font-bold">{selectedIds.size}</span> plugins sélectionnés
          </p>
        </div>
      </aside>

      {/* Liste principale */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-[var(--text-primary)]">
              Sélectionne les plugins à supprimer
            </h2>
            <p className="font-mono text-[11px] text-[var(--text-muted)]">
              {filteredItems.length} affichés · {selectedIds.size} sélectionnés
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher…"
              className="bg-[var(--bg-sunken)] border border-[var(--border)] rounded-[6px] px-3 py-1.5 text-xs font-body focus:outline-none focus:border-[var(--accent)] transition-colors w-40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[var(--text-muted)] font-body text-sm">
              Aucun plugin ne correspond aux filtres.
            </div>
          ) : (
            filteredItems.map((item) => {
              const inScope = isInScope(item);
              const relativePath = pluginPathMap.get(item.id);
              const checked = selectedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => { if (inScope) toggleItem(item.id); }}
                  className={`
                    flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] transition-colors
                    ${inScope ? 'cursor-pointer hover:bg-[var(--bg-elevated)]' : 'opacity-50 cursor-not-allowed'}
                    ${checked ? 'bg-[var(--accent-light)]' : ''}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!inScope}
                    onChange={() => { if (inScope) toggleItem(item.id); }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-[var(--border)] accent-[var(--accent)] flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-medium text-[15px] text-[var(--text-primary)]">
                        {item.displayName}
                      </span>
                      {!inScope && (
                        <span className="font-mono text-[10px] uppercase bg-[var(--bg-sunken)] text-[var(--text-muted)] px-1.5 py-0.5 rounded-[4px]">
                          Hors scope actuel, non supprimable
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        {item.brand ?? 'Inconnu'} · {item.format}
                        {item.category ? ` · ${item.category}` : ''}
                      </span>
                      {relativePath && (
                        <span className="font-mono text-[10px] text-[var(--text-muted)] truncate max-w-xs">
                          {relativePath}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`
                    font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[4px] flex-shrink-0
                    ${item.status === 'DOUBLON' ? 'bg-[var(--status-doublon-bg)] text-[var(--status-doublon)]' : ''}
                    ${item.status === 'UNUSED' ? 'bg-[var(--status-sleep-bg)] text-[var(--status-sleep)]' : ''}
                    ${item.status === 'TO_SELL' ? 'bg-[var(--status-sell-bg)] text-[var(--status-sell)]' : ''}
                    ${!['DOUBLON', 'UNUSED', 'TO_SELL'].includes(item.status) ? 'bg-[var(--bg-sunken)] text-[var(--text-muted)]' : ''}
                  `}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* CTA sticky */}
        <div className="sticky bottom-0 bg-[var(--bg-surface)] border-t border-[var(--border)] p-4 flex items-center justify-between">
          <p className="font-mono text-[11px] text-[var(--text-muted)]">
            {selectedIds.size === 0
              ? 'Aucun plugin sélectionné'
              : `${selectedIds.size} plugin${selectedIds.size > 1 ? 's' : ''} sélectionné${selectedIds.size > 1 ? 's' : ''}`}
          </p>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--status-doublon)] hover:bg-[#a93226] text-white rounded-[6px] font-display font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.01]"
          >
            Passer à la confirmation
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
