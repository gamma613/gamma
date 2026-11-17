'use client';

import { useEffect } from 'react';

export function DevVersionMeta() {
  useEffect(() => {
    let active = true;
    let timeout: ReturnType<typeof setTimeout>;

    const refreshVersion = async () => {
      try {
        const response = await fetch('/api/version', { cache: 'no-store' });
        if (response.ok) {
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
        // Keep the last known version if the development server is restarting.
      } finally {
        if (active) timeout = setTimeout(refreshVersion, 1000);
      }
    };

    void refreshVersion();

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
