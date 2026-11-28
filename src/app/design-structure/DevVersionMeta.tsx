'use client';

import { useEffect } from 'react';

const MIN_REFRESH_INTERVAL_MS = 500;

export function DevVersionMeta() {
  useEffect(() => {
    let active = true;
    let inFlight = false;
    let lastFetchedAt = 0;
    let controller: AbortController | null = null;

    const refreshVersion = async () => {
      const now = Date.now();
      if (inFlight || now - lastFetchedAt < MIN_REFRESH_INTERVAL_MS) return;

      inFlight = true;
      lastFetchedAt = now;
      controller = new AbortController();

      try {
        const response = await fetch('/api/version', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (active && response.ok) {
          const { version } = (await response.json()) as { version: string };
          let meta = document.querySelector<HTMLMetaElement>('meta[name="app-version"]');

          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'app-version';
            document.head.appendChild(meta);
          }

          meta.content = version;
        }
      } catch {
        // Keep the last known version if the development server is restarting or aborted.
      } finally {
        inFlight = false;
        controller = null;
      }
    };

    const handleFocus = () => {
      void refreshVersion();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshVersion();
      }
    };

    void refreshVersion();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
