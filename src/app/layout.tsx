import { cn } from "@/lib/utils";
import { Header } from "@/modules/header";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/theme/styles/app.css";
import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import ClientProviders from "./ClientProviders";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
    <html lang="en" className={cn("font-sans dark", outfit.variable)}>
      <body className={`${geistMono.variable} antialiased`}>
        <ClientProviders>
          <Header />

          <div className="mx-auto px-6 flex flex-col max-w-3xl pb-(--header-height)">
            <main className="flex-1">{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
