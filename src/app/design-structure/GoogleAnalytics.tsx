'use client';

import { trackEvent } from '@/lib/analytics';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!measurementId || initialized.current) return;
    initialized.current = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!measurementId) return;
    trackEvent('page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
    const musicItemMatch = pathname.match(/^\/music\/([^/]+)\/?$/);
    if (musicItemMatch?.[1]) {
      trackEvent('music_item_view', { item_id: decodeURIComponent(musicItemMatch[1]) });
    }
  }, [pathname]);

  if (!measurementId) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  );
}
