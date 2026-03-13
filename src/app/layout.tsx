import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Player } from "@/modules/player";
import ClientProviders from "./ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
          <div className="min-h-screen mx-auto px-6 flex flex-col max-w-md sm:max-w-3xl" style={{background: '#99ff0010'}}>
            <header className="h-[50px] md:h-[80px] px-6 flex items-center border-b">
              <div className="flex-1">
                <Link href='/' className="inline-block">
                  <Image
                    src="/logo-transparent.png"
                    alt="gamma logo"
                    height="44"
                    width="44"
                    priority
                  />
                </Link>
                {/* <button className="text-xl" onClick={() => console.log('hi')}>☰</button> */}
                
              </div>

              <div className="flex justify-center">
                <Player />
              </div>

              <div className="flex-1 flex justify-end">
                🍔 
              </div>

            </header>

            <main className="flex-1">
              {children}
            </main>

            {/* <footer className="h-[50px] shrink-0 border-t">
              fooder
            </footer> */}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
