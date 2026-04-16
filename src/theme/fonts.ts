import {
  DM_Sans,
  Fira_Code,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Manrope,
  Outfit,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from 'next/font/google';

// ----------------------------------------------------------------------

// Next.js requires font loaders to be called as `const x = Font(...)` at module scope.
export const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
export const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
export const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans' });

export const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});
export const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });
export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  weight: '400',
});

export const sansFonts = {
  outfit,
  inter,
  manrope,
  plusJakartaSans,
  spaceGrotesk,
  dmSans,
  ibmPlexSans,
} as const;

export const monoFonts = {
  geistMono,
  jetBrainsMono,
  firaCode,
  ibmPlexMono,
} as const;

export type SansFontId = keyof typeof sansFonts;
export type MonoFontId = keyof typeof monoFonts;
