import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "@/theme/styles/app.css";
import { Header, HeaderProvider } from "@/modules/header";
import ClientProviders from "./ClientProviders";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description: "",
  title: {
    default: "DJ gamma 🦇 Ottawa, Canada",
    template: "%s | DJ gamma 🦇 Ottawa, Canada",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", outfit.variable)}>
      <body className={`${geistMono.variable} antialiased`}>
        <ClientProviders>
          <HeaderProvider>
            <Header />
          </HeaderProvider>

          <div className="mx-auto px-6 flex flex-col max-w-md sm:max-w-3xl pt-[62px] md:pt-[98px]">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
