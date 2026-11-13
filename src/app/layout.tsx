import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { description, seo, site, town } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessSchema, websiteSchema } from "@/components/seo/structured-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Bespoke fashion house in ${town}, Nigeria`,
    template: `%s | ${site.name}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  verification: {
    google: seo.googleVerification || undefined,
    yandex: seo.yandexVerification || undefined,
    other: seo.bingVerification ? { "msvalidate.01": seo.bingVerification } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${jost.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={businessSchema()} />
        <JsonLd data={websiteSchema()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-page"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
