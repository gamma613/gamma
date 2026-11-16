'use client';

import { trackEvent } from '@/lib/analytics';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    // Analytics is optional; initialize it once when a measurement ID is configured.
    if (!measurementId || initialized.current) return;
    initialized.current = true;

    // Set up the standard gtag queue before loading its script so early events are kept.
    window.dataLayer = window.dataLayer || [];
    // Preserve the arguments object used by Google's standard gtag bootstrap.
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());

    // Disable automatic page views; the pathname effect below tracks client-side navigation.
    window.gtag('config', measurementId, { send_page_view: false });

    // Load the Google tag only after the queue is ready, and avoid adding it twice.
    const scriptId = 'google-analytics-gtag';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Next.js route changes do not reload the document, so report each page view here.
    if (!measurementId) return;
    trackEvent('page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });

    // Also identify music detail pages with their decoded item slug.
    const musicItemMatch = pathname.match(/^\/music\/([^/]+)\/?$/);
    if (musicItemMatch?.[1]) {
      trackEvent('music_item_view', { item_id: decodeURIComponent(musicItemMatch[1]) });
    }
  }, [pathname]);

  if (!measurementId) return null;

  return null;
}
