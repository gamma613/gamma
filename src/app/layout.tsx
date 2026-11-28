import { Header } from '@/app/design-structure/header';
import { VisualizerBarsLayer } from '@/app/design-structure/VisualizerBarsLayer';
import { BokehBackground } from '@/components';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/metadata';
import { cn } from '@/lib/utils';
import { monoFonts, sansFonts } from '@/theme/fonts';
import '@/theme/styles/app.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import ClientProviders from './design-structure/ClientProviders';
import { DevVersionMeta } from './design-structure/DevVersionMeta';

const fontVars = [
  ...Object.values(sansFonts).map((f) => f.variable),
  ...Object.values(monoFonts).map((f) => f.variable),
].join(' ');

export const metadata: Metadata = {
  description: '',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gamma613.ca'),
  openGraph: {
    images: [DEFAULT_SOCIAL_IMAGE],
    type: 'website',
  },
  other: {
    'app-version': process.env.NEXT_PUBLIC_APP_VERSION ?? 'development',
  },
  title: {
    default: 'DJ gamma 🦇 Ottawa, Canada',
    template: '%s | DJ gamma 🦇 Ottawa, Canada',
  },
  twitter: {
    card: 'summary',
    images: [DEFAULT_SOCIAL_IMAGE.url],
  },
};

// ----------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans dark', fontVars)}>
      <body className="antialiased">
        {process.env.NODE_ENV === 'development' && <DevVersionMeta />}
        <ClientProviders>
          <div className="relative min-h-screen">
            <BokehBackground className="z-0" />

            <VisualizerBarsLayer
              className="fixed inset-x-0 top-0 bottom-(--header-height) z-10"
              config={{
                decibelsMax: -10,
                decibelsMin: -90,
                double: 'left',
                fftSize: 512,
                hzMax: 22000,
                mirror: true,
                palette: 'rainbow',
                sensitivity: 1.1,
                smoothing: 0,
              }}
            />
            <div className="relative z-20">
              <Header />
              <main className="pb-(--header-height)">{children}</main>
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
