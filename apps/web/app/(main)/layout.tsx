'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { AppHeader } from '../../components/layout/AppHeader';
import { useSessionLogStore } from '../../stores/session-log-store';
import { useFileHandlesStore } from '../../stores/file-handles-store';
import { DevStatusBar } from '../../components/dev/DevStatusBar';

export default function MainLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const log = useSessionLogStore(s => s.log);
  const { writePermissionGranted, rootDirName, clearRoot } = useFileHandlesStore();

  useEffect(() => {
    log({ type: 'page_view', path: pathname });
  }, [pathname, log]);

  const showBanner = writePermissionGranted && pathname !== '/purge';

  const handleRevoke = () => {
    clearRoot();
    router.push('/scan');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <AppHeader />

      {showBanner && (
        <div className="bg-[var(--status-learn-bg)] border-b border-[var(--border)] px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-[var(--status-learn)] flex-shrink-0" />
            <p className="text-xs font-body text-[var(--status-learn)]">
              PluginBase a actuellement la permission de supprimer des fichiers dans{' '}
              <code className="font-mono text-[11px]">{rootDirName ?? 'le dossier sélectionné'}</code>.
            </p>
          </div>
          <button
            onClick={handleRevoke}
            className="text-[10px] font-mono text-[var(--status-learn)] hover:text-[var(--text-primary)] transition-colors whitespace-nowrap underline underline-offset-2"
          >
            Révoquer
          </button>
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 md:py-12">
        {children}
      </main>
      <footer className="max-w-5xl mx-auto w-full px-6 py-12 border-t border-[var(--border)] text-center text-[var(--text-muted)] text-sm font-body mt-12">
        <p>© 2026 PluginBase — L'assistant de lucidité pour votre studio.</p>
      </footer>
      <DevStatusBar />
    </div>
  );
}
