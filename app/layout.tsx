import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCountdown from "@/components/StickyCountdown";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Build AI-Powered Talent Pools Outside LinkedIn | AI with Michal",
  description:
    "Learn how to discover and analyze candidates using alternative data sources and AI. Live 90-minute implementation workshop with Michal Juhas.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://aiwithmichal.com"
  ),
  openGraph: {
    title: "Build AI-Powered Talent Pools Outside LinkedIn",
    description:
      "Stop searching the same LinkedIn profiles as everyone else. Learn AI-powered talent discovery.",
    type: "website",
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`}>
        <head>
          {GTM_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
              }}
            />
          )}
        </head>
        <body className="min-h-full antialiased">
          {GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}
          <Header />
          <div className="pt-16">{children}</div>
          <Footer />
          {/* Spacer so footer isn't hidden behind the sticky countdown bar */}
          <div className="h-16" />
          <StickyCountdown />
        </body>
      </html>
    </ClerkProvider>
  );
}
