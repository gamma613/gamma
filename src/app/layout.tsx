import { cn } from '@/lib/utils';
import { Header } from '@/modules/header';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/theme/styles/app.css';
import { monoFonts, sansFonts } from '@/theme/fonts';
import type { Metadata } from 'next';
import ClientProviders from './ClientProviders';

const fontVars = [
  ...Object.values(sansFonts).map((f) => f.variable),
  ...Object.values(monoFonts).map((f) => f.variable),
].join(' ');

export const metadata: Metadata = {
  description: '',
  title: {
    default: 'DJ gamma 🦇 Ottawa, Canada',
    template: '%s | DJ gamma 🦇 Ottawa, Canada',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans dark', fontVars)}>
      <body className="antialiased">
        <ClientProviders>
          <Header />
          <main className="pb-(--header-height)">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
