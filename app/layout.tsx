import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://dashboardoscar.vercel.app"
  ),
  title: {
    default: "Awards Analytics Dashboard",
    template: "%s · Awards Analytics",
  },
  description:
    "Dashboard interativo com histórico completo do Oscar (1927–2024) e The Game Awards (2014–2024). Explore indicações, vencedores e tendências.",
  keywords: ["Oscar", "Academy Awards", "The Game Awards", "cinema", "games", "premiação"],
  authors: [{ name: "Awards Analytics" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Awards Analytics Dashboard",
    title: "Awards Analytics Dashboard",
    description:
      "Explore ~100 anos do Oscar e 12 anos do The Game Awards em um único painel interativo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awards Analytics Dashboard",
    description:
      "Explore ~100 anos do Oscar e 12 anos do The Game Awards em um único painel interativo.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
